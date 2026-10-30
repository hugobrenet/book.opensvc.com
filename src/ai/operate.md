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

A user deletes their conversations from the webapp, one by one or all
together. The expired ones are deleted when a user lists or creates one.

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
| "Agent busy. Try again later." | More turns at once than `OPENSVC_AI_MAX_CONCURRENT_ASKS`, 4 by default |
| Slow answers | The model: the `duration_ms` of the requests to it in the audit lines |
| "Your conversation quota is reached" | The user holds `OPENSVC_AI_CONVERSATION_MAX_PER_USER` conversations |
