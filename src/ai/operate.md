<!-- llms: Operate the AI assistant: upgrade its images, failover, conversations, logs and health, and troubleshooting. -->
# Operate

## Upgrade

Each component is an image of the service. Pull the new one on every node
first, so a failover does not wait for it, then change the image and restart
the container:

```bash
docker pull ghcr.io/opensvc/ai-agent:<version>      # on each node
om system/svc/ai config update --set container#agent.image=ghcr.io/opensvc/ai-agent:<version>
om system/svc/ai restart --rid container#agent
```

The MCPs serve no embedded resource or skill from om3-mcp 0.3.0 and
oc3-mcp 0.2.0. For an upgrade from an earlier version:

1. [Publish](install.md#publish-the-skills) in the collector, 0.3.19 or
   later, the objects they served: `node-maintenance` and `object-config`
   for `om3`, `form-definition` for `oc3`.
2. Change the image of om3-mcp and set its
   [collector settings](configure.md#resources-and-skills) in one update of
   the configuration, then restart it once. Do not set them before: an
   om3-mcp older than 0.3.0 refuses `OPENSVC_MCP_AUTH_CONFIG_FILE` without
   its HTTPS listener, and does not start.

Otherwise the assistant loses these objects.

The agent converts its database to its schema at start, in one transaction,
when it knows the conversion, and refuses to start on a version it does not:
[back the database up](#conversations) before an upgrade.

## Failover

The service moves with its address, `ip#0`, and its volume:

```bash
om system/svc/ai switch --to n2 --wait
```

The agent starts on the other node with the conversations as they were: the
volume is replicated as it is written. A turn running during the switch is
lost, and the user sends the message again.

Each node needs what the service installs from its datastores, which it does
at start, and the images.

## Conversations

The database is `conversations.db` on the volume of the service, the path
`OPENSVC_AI_CONVERSATION_DB_PATH` names in the container, on the node the
service runs on:

```bash
du -sh /srv/ai-state.system.vol.<cluster>/state
```

A user deletes their conversations from the webapp, one by one. The expired
ones are deleted when a user lists or creates one.

To back the database up, stop the agent, so that its journal is merged into
the file, copy `conversations.db`, then start it again:

```bash
om system/svc/ai stop --rid container#agent
cp -a /srv/ai-state.system.vol.<cluster>/state/conversations.db /backup/
om system/svc/ai start --rid container#agent
```

Replication protects from the loss of a node, not from a deletion or a
corruption, which it replicates too.

## Logs and health

```bash
sudo curl --cacert /var/lib/opensvc/certs/ca_certificates https://ai.system.svc.cluster1:8090/health
journalctl -t opensvc-ai-agent -t opensvc-mcp -t oc3-mcp
```

The agent writes one audit line per event, as JSON: the conversations
created and deleted, the runs started and completed, each tool call and its
outcome, and each request to the model with its tokens and `duration_ms`.
None holds a token, a prompt or a result.

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| The webapp shows no assistant | `ai.agent_url` is unset or invalid in the cluster configuration, or the user signed in without OpenID |
| Every message of a new cluster answers "Authentication required" | The MCP was not restarted after the cluster was added to the catalogue |
| The browser console reports a CORS error | The origin of the webapp is not in `OPENSVC_AI_CORS_ALLOWED_ORIGINS` |
| Every message answers "Authentication required" | The issuer or the client id of `delegation` in the catalogue differ from the daemon's: compare them with `GET /api/auth/info` |
| "Agent busy. Try again later." | More turns at once than `OPENSVC_AI_MAX_CONCURRENT_ASKS`, 4 by default, or, for one user, than `OPENSVC_AI_MAX_CONCURRENT_ASKS_PER_USER`, 2 by default |
| Slow answers | The model: the `duration_ms` of the requests to it in the audit lines |
| "Your conversation quota is reached", creating a conversation | The user holds `OPENSVC_AI_CONVERSATION_MAX_PER_USER` conversations |
| "Conversation busy or conversation limit reached.", sending a message | A turn of the conversation is running, or waits for the confirmation of an action, 10 minutes at most; the user stores more than `OPENSVC_AI_CONVERSATION_MAX_USER_MIB` of messages; or the instance reached its limit, the database full at `OPENSVC_AI_CONVERSATION_MAX_DATABASE_MIB` or the turns of the conversation at their maximum |
| "Authentication or agent temporarily unavailable." | An MCP cannot read the discovery or the keys of the OpenID provider it verifies the tokens with: the service needs to reach it over HTTPS |
| A resource or a skill is missing from the list of the assistant | The user may read more than the 8 skills or 10 resources the agent lists, which keeps the first by name |
| The assistant of a cluster lists no resource and no skill | Nothing is published for the `om3` backend, or not to the groups of the user; the collector is older than 0.3.19; om3-mcp has no [collector settings](configure.md#resources-and-skills); or its exchange is refused, which its log tells: `invalid_grant` when the exchange client does not accept the provider of the cluster, a 401 of the collector when the profile does not request its scopes |
