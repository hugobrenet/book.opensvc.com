<!-- llms: Install the AI assistant as the failover service system/svc/ai: requirements, images and accounts, the configurations to create, the service, publishing the skills, and the checks. -->
# Install

The assistant runs as one failover service, `system/svc/ai`, deployed once
for a site, on one of its clusters, such as the cluster of the collector. Its
containers are the agent and the MCP servers. The agent and the MCPs talk
through Unix sockets in a directory of the service; the webapps of the
clusters and the collector reach the agent, and external MCP clients the
MCPs, over HTTPS.

## Requirements

* An OpenSVC v3 cluster to run it, tested with v3.0.0-rc53, with docker on its
  nodes.
* For each cluster it serves, OpenSVC v3.0.0-rc56 or later, which publishes
  `ai.agent_url` in the cluster status, and its webapp v1.0.0-rc9 or later,
  v1.0.0-rc15 for the dock and the context of the page, with an agent 0.7.0
  or later.
* For each cluster it serves, the OpenID provider its daemons trust: the
  webapp signs the users in with it ([Cluster API](../agent/configure.api.md)).
* A language model API: OpenAI Responses or Chat Completions, Anthropic
  Messages, or a self-hosted server speaking one of them.
* A [cluster network](../agent/configure.networks.md) to give the service its
  address, and the [cluster DNS](../agent/configure.dns.md) to name it.
* For failover, a [pool](../agent/configure.pool.md) able to move a volume
  between the nodes with no data lost: `drbd`, a SAN array, or Ceph.
* For the collector interface, a collector, version 3, whose users sign in
  with single sign-on: 0.3.19 or later for the resources and the skills
  (migration `0030_ai_content`), 0.3.20 or later for the events of the
  collector oc3-mcp reads (migration `0034_log_origin`).
* For the resources and the skills of om3-mcp, a collector 0.3.19 or later,
  and an exchange client at the single sign-on, which accepts the tokens of
  the provider of each cluster and may issue tokens for the client of the
  collector ([Resources and skills](configure.md#resources-and-skills)).
* Outbound HTTPS from the service to the language model API, the daemons of
  the clusters, the collector API, and the OpenID provider of each cluster
  and of the collector, whose discovery and keys the MCPs read to verify
  each token; for the resources and the skills of om3-mcp, the token
  endpoint of the single sign-on too; to the book and the source archive
  when the [search](configure.md#documentation-and-code-search) of them is
  enabled.

## Images and accounts

| Component | Image | Runs as | Port |
| --- | --- | --- | --- |
| agent | `ghcr.io/opensvc/ai-agent` | `995:983` (opensvc-ai) | 8090 |
| om3-mcp | `ghcr.io/opensvc/om3-mcp` | `994:982` (opensvc-mcp) | 8443, for [external clients](configure.md#external-mcp-clients) only |
| oc3-mcp | `ghcr.io/opensvc/oc3-mcp` | `994:982` (opensvc-mcp) | 8444, for external clients only |

Pin the release of each image you deploy, `ghcr.io/opensvc/<image>:<version>`,
from the releases of
[ai-agent](https://github.com/opensvc/ai-agent/releases),
[om3-mcp](https://github.com/opensvc/om3-mcp/releases) and
[oc3-mcp](https://github.com/opensvc/oc3-mcp/releases): the version without
its `v`, the release `vX.Y.Z` being the image `:X.Y.Z`. [Upgrade](operate.md#upgrade)
one component at a time.

The ids are set in the images: the nodes need no such user. The MCPs create
their sockets in the `sock/` directory of a memory volume of the service,
owned by `994:983` with mode `2750`, so the agent, of the group `983`,
connects to them, and no other user enters.

## Create the configurations

The agent reads its settings from the environment. The service exports the
keys of `system/cfg/ai` and `system/sec/ai` into the container, each key named
after its variable:

```bash
om system/cfg/ai create
om system/cfg/ai key add --name OPENSVC_AI_LLM_PROTOCOL --value responses
om system/cfg/ai key add --name OPENSVC_AI_LLM_BASE_URL --value https://api.openai.com/v1
om system/cfg/ai key add --name OPENSVC_AI_LLM_MODEL --value <model>
om system/cfg/ai key add --name OPENSVC_AI_LLM_AUTH_MODE --value bearer

om system/sec/ai create
om system/sec/ai key add --name OPENSVC_AI_LLM_API_TOKEN --from /path/to/token
```

The agent and the MCPs present a certificate for the name the cluster DNS
gives the service, `ai.system.svc.<cluster name>`, signed by the CA of the
cluster ([Certificates](../agent/apps.design.certificates.md)):

```bash
om system/sec/ai-tls create --kw cn=ai.system.svc.cluster1 --kw ca=ca
om system/sec/ai-tls certificate create
```

om3-mcp reads its [cluster catalogue](configure.md#the-cluster-catalogue),
`clusters.yaml`, and its [exchange profiles](configure.md#the-exchange-profiles-authyaml),
`auth.yaml`, which the resources and the skills of the collector need, as do
external MCP clients. The client secret of the exchange goes in a sec:

```bash
om system/cfg/om3-mcp create
om system/cfg/om3-mcp key add --name clusters.yaml --from clusters.yaml
om system/cfg/om3-mcp key add --name auth.yaml --from auth.yaml

om system/sec/om3-mcp create
om system/sec/om3-mcp key add --name exchange --from /path/to/client-secret
```

## Create the service

```ini
[DEFAULT]
nodes = n1 n2
topology = failover
orchestrate = start

# The accounts of the images, named once.
[env]
mcp_uid = 994
mcp_gid = 982
agent_uid = 995
ai_gid = 983

[container#0]
type = docker
image = ghcr.io/opensvc/pause
rm = true
hostname = {name}

[ip#0]
type = netns
# the cluster network the service takes its address from
network = default
netns = container#0

# The conversations of the agent, moving with the service.
[volume#state]
name = {name}-state
size = 1g
shared = true
install = /state/ mode 0700 user {env.agent_uid} group {env.ai_gid}

# The sockets of the MCPs, and the configuration of each component, in
# memory: nothing on the disk of the nodes, discarded at stop.
[volume#ai]
name = {name}-ai
volatile = true
size = 16m
user = root
group = {env.mcp_gid}
perm = 0640
dirperm = 0750
install = /sock/ mode 2750 user {env.mcp_uid} group {env.ai_gid}
	/om3conf/
	/om3conf/server.crt from ./sec/ai-tls key certificate_chain required
	/om3conf/server.key from ./sec/ai-tls key private_key required
	/om3conf/clusters.yaml from ./cfg/om3-mcp key clusters.yaml required
	/om3conf/auth.yaml from ./cfg/om3-mcp key auth.yaml required
	/om3conf/secrets/
	/om3conf/secrets/om3-mcp-exchange from ./sec/om3-mcp key exchange mode 0400 user {env.mcp_uid} required
	/oc3conf/
	/oc3conf/server.crt from ./sec/ai-tls key certificate_chain required
	/oc3conf/server.key from ./sec/ai-tls key private_key required
	/agentconf/ group {env.ai_gid}
	/agentconf/agent.crt from ./sec/ai-tls key certificate_chain group {env.ai_gid} required
	/agentconf/agent.key from ./sec/ai-tls key private_key group {env.ai_gid} required

[container#om3mcp]
type = docker
image = ghcr.io/opensvc/om3-mcp:<version>
netns = container#0
rm = true
restart = 3
user = {env.mcp_uid}:{env.mcp_gid}
run_args = --log-driver=journald --log-opt tag=opensvc-mcp
volume_mounts = /etc/localtime:/etc/localtime:ro
	volume#ai:/om3conf:/etc/opensvc-om3-mcp:ro
	volume#ai:/sock:/run/opensvc-ai/sock:rw
environment = OPENSVC_MCP_DELEGATED_SOCKET=/run/opensvc-ai/sock/om3-mcp.sock
	OPENSVC_MCP_CLUSTER_CONFIG_FILE=/etc/opensvc-om3-mcp/clusters.yaml
	OPENSVC_MCP_AUTH_CONFIG_FILE=/etc/opensvc-om3-mcp/auth.yaml
	OPENSVC_MCP_COLLECTOR_URL=https://collector.example.com/api
	OPENSVC_MCP_COLLECTOR_AUDIENCE=<client id of the collector>
	OPENSVC_MCP_COLLECTOR_AUTH_PROFILE=collector-sso
	OPENSVC_MCP_ACTIONS=enabled

[container#oc3mcp]
type = docker
image = ghcr.io/opensvc/oc3-mcp:<version>
netns = container#0
rm = true
restart = 3
user = {env.mcp_uid}:{env.mcp_gid}
run_args = --log-driver=journald --log-opt tag=oc3-mcp
volume_mounts = /etc/localtime:/etc/localtime:ro
	volume#ai:/oc3conf:/etc/opensvc-oc3-mcp:ro
	volume#ai:/sock:/run/opensvc-ai/sock:rw
environment = OPENSVC_MCP_DELEGATED_SOCKET=/run/opensvc-ai/sock/oc3-mcp.sock
	OPENSVC_MCP_COLLECTOR_URL=https://collector.example.com/api
	OPENSVC_MCP_DELEGATED_ISSUER=https://sso.example.com/application/o/oc3/
	OPENSVC_MCP_DELEGATED_AUDIENCE=<client id of the collector>
	OPENSVC_MCP_ACTIONS=enabled

[container#agent]
type = docker
image = ghcr.io/opensvc/ai-agent:<version>
netns = container#0
rm = true
restart = 3
user = {env.agent_uid}:{env.ai_gid}
run_args = --log-driver=journald --log-opt tag=opensvc-ai-agent
volume_mounts = /etc/localtime:/etc/localtime:ro
	volume#ai:/agentconf:/etc/opensvc-ai:ro
	volume#ai:/sock:/run/opensvc-ai/sock:ro
	volume#state:/state:/var/lib/opensvc-ai-agent:rw
configs_environment = ai/OPENSVC_AI_*
secrets_environment = ai/OPENSVC_AI_*
environment = OPENSVC_AI_LISTEN_ADDR=[::]:8090
	OPENSVC_AI_TLS_CERT_FILE=/etc/opensvc-ai/agent.crt
	OPENSVC_AI_TLS_KEY_FILE=/etc/opensvc-ai/agent.key
	OPENSVC_AI_CONVERSATION_DB_PATH=/var/lib/opensvc-ai-agent/conversations.db
	OPENSVC_AI_OM3_MCP_SOCKET=/run/opensvc-ai/sock/om3-mcp.sock
	OPENSVC_AI_OC3_MCP_SOCKET=/run/opensvc-ai/sock/oc3-mcp.sock
	OPENSVC_AI_CORS_ALLOWED_ORIGINS=https://cluster1.example.com:1215,https://cluster2.example.com:1215
```

* `[env]` names the accounts of the images once, which the other keywords
  read as `{env.<name>}`.
* `container#0` holds the network namespace every container of the service
  joins, and `ip#0` gives it an address of the cluster network `network`
  names, which follows the service on failover. The agent listens on it, as
  do the MCPs, without taking a port of the node. The cluster DNS names it
  `ai.system.svc.<cluster name>`, the name of the certificate.
* The network decides who reaches the service. A backend network, as a
  `routed_bridge` one, is reached by the nodes of the cluster, so by the
  daemons and a collector running on it. A browser calling the agent
  directly, or an external MCP client, needs a `lan` network, and a
  certificate it trusts.
* `volume#state` holds the conversations. `shared = true` picks a pool whose
  volumes move between the nodes with no data lost, a `drbd` pool, a SAN
  array or Ceph, whichever the cluster has, so the configuration is the same
  on each, and makes the filesystem once, on the node the provision starts
  from.
* `OPENSVC_MCP_ACTIONS=enabled` offers the actions to the model: the
  destructive ones wait for the user to confirm them, the others run as the
  reads do ([Confirmation of the actions](overview.md#confirmation-of-the-actions));
  without it, the assistant only reads.
* `OPENSVC_MCP_COLLECTOR_*` and `OPENSVC_MCP_AUTH_CONFIG_FILE` let om3-mcp
  read the resources and the skills of the collector: the profile
  `collector-sso` of `auth.yaml`, and the client id the collector trusts.
  They go together: a part of them prevents om3-mcp from starting. A site
  without collector, or whose single sign-on has no such exchange client,
  leaves out the three `OPENSVC_MCP_COLLECTOR_*`, and
  om3-mcp then serves no resource and no skill. Unless it serves
  [external MCP clients](configure.md#external-mcp-clients), which need them,
  it leaves out `OPENSVC_MCP_AUTH_CONFIG_FILE` and the `/om3conf/auth.yaml`
  and secret lines of `volume#ai` too.
* `container#oc3mcp` serves the collector, and the agent reaches it through
  `OPENSVC_AI_OC3_MCP_SOCKET`: its values are explained in
  [Configure](configure.md#oc3-mcp). A site without collector leaves both
  out, and the agent then serves the webapps only.
* `volume#ai` holds, in memory, the sockets of the MCPs and the configuration
  of each component, each mounted where it reads it: the catalogue and the
  exchange profiles of om3-mcp, the secret of its exchange client, readable
  by the account of the MCPs only, and the certificate of the service, which
  the agent presents to its clients and the MCPs to
  [external MCP clients](configure.md#external-mcp-clients). The group of the
  MCPs reads their configuration, the group of the agent its own, and the
  sockets admit the agent only.

Deploy it:

```bash
om system/svc/ai create --config ai.conf
om system/svc/ai provision --wait
```

## Publish the skills

The MCPs embed no resource and no skill: the assistant has none until they
are published in the collector. A user with the `AIManager` privilege
publishes those OpenSVC ships, and the site its own
([Resources and skills](configure.md#resources-and-skills)):

* for the `om3` backend, the maintenance of a node, `node-maintenance`, and
  the reference of the configuration of an object, `object-config`, as the
  [om3-mcp content guide](https://github.com/opensvc/om3-mcp/blob/main/docs/content.md#the-objects-opensvc-ships)
  shows;
* for the `oc3` backend, the reference of the YAML of a form,
  `form-definition`, as the
  [oc3-mcp forms guide](https://github.com/opensvc/oc3-mcp/blob/main/docs/tools/forms.md#the-reference-of-the-yaml)
  shows.

## Check

```bash
sudo curl --cacert /var/lib/opensvc/certs/ca_certificates https://ai.system.svc.cluster1:8090/health
```

as root on a node of the cluster, whose agent installs the CA of the cluster there.
The agent answers `200` once it listens; it reaches the MCP sockets at each
request, so it starts before them. Then open the assistant from a webapp,
once [configured](configure.md#the-webapps), and ask "what is the state of the
cluster?": the answer names the nodes and the objects.

The logs of the components go to journald, each tagged by the `run_args` of
its container:

```bash
journalctl -t opensvc-ai-agent -t opensvc-mcp -t oc3-mcp
```
