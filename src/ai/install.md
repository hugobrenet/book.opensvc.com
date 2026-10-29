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
* For each cluster it serves, the OpenID provider its daemons trust: the
  webapp signs the users in with it ([Cluster API](../agent/configure.api.md)).
* A language model API: OpenAI Responses or Chat Completions, Anthropic
  Messages, or a self-hosted server speaking one of them.
* A [cluster network](../agent/configure.networks.md) to give the service its
  address, and the [cluster DNS](../agent/configure.dns.md) to name it.
* For failover, a [pool](../agent/configure.pool.md) able to move a volume
  between the nodes, such as a `drbd` pool.
* For the collector interface, a collector, version 3, whose users sign in
  with single sign-on.

## Images and accounts

| Component | Image | Runs as | Port |
| --- | --- | --- | --- |
| agent | `ghcr.io/opensvc/ai-agent` | `995:983` (opensvc-ai) | 8090 |
| om3-mcp | `ghcr.io/opensvc/om3-mcp` | `994:982` (opensvc-mcp) | 8443, for [external clients](configure.md#external-mcp-clients) only |
| oc3-mcp | `ghcr.io/opensvc/oc3-mcp` | `994:982` (opensvc-mcp) | 8444, for external clients only |

The ids are set in the images: the nodes need no such user. The MCPs create
their sockets in `/run/opensvc-ai/sock`, owned by `994:983` with mode `2750`,
so the agent, of the group `983`, connects to them, and no other user enters.

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
`clusters.yaml`, and, for external MCP clients only, its exchange profiles,
`auth.yaml`, whose client secret goes in a sec:

```bash
om system/cfg/om3-mcp create
om system/cfg/om3-mcp key add --name clusters.yaml --from clusters.yaml
```

## Create the service

```ini
[DEFAULT]
nodes = n1 n2
topology = failover
orchestrate = start

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
pool = drbd
size = 1g
shared = true
install = /state/ mode 0700 user 995 group 983

[fs#sock]
type = directory
path = /run/opensvc-ai/sock
user = 994
group = 983
dirperm = 2750

[fs#om3conf]
type = directory
path = /etc/opensvc-om3-mcp
user = root
group = 982
dirperm = 0750
perm = 0640
install = /server.crt from ./sec/ai-tls key certificate_chain mode 0640 user root group 982 required
	/server.key from ./sec/ai-tls key private_key mode 0640 user root group 982 required
	/clusters.yaml from ./cfg/om3-mcp mode 0640 user root group 982 required

[fs#oc3conf]
type = directory
path = /etc/opensvc-oc3-mcp
user = root
group = 982
dirperm = 0750
perm = 0640
install = /server.crt from ./sec/ai-tls key certificate_chain mode 0640 user root group 982 required
	/server.key from ./sec/ai-tls key private_key mode 0640 user root group 982 required

[fs#agentconf]
type = directory
path = /etc/opensvc-ai
user = root
group = 983
dirperm = 0750
perm = 0640
install = /agent.crt from ./sec/ai-tls key certificate_chain mode 0640 user root group 983 required
	/agent.key from ./sec/ai-tls key private_key mode 0640 user root group 983 required

[container#om3mcp]
type = docker
image = ghcr.io/opensvc/om3-mcp:0.2.2
netns = container#0
rm = true
restart = 3
user = 994:982
volume_mounts = /etc/localtime:/etc/localtime:ro
	/etc/opensvc-om3-mcp:/etc/opensvc-om3-mcp:ro
	/run/opensvc-ai/sock:/run/opensvc-ai/sock:rw
environment = OPENSVC_MCP_DELEGATED_SOCKET=/run/opensvc-ai/sock/om3-mcp.sock
	OPENSVC_MCP_CLUSTER_CONFIG_FILE=/etc/opensvc-om3-mcp/clusters.yaml
	OPENSVC_MCP_ACTIONS=enabled

[container#oc3mcp]
type = docker
image = ghcr.io/opensvc/oc3-mcp:0.1.2
netns = container#0
rm = true
restart = 3
user = 994:982
volume_mounts = /etc/localtime:/etc/localtime:ro
	/etc/opensvc-oc3-mcp:/etc/opensvc-oc3-mcp:ro
	/run/opensvc-ai/sock:/run/opensvc-ai/sock:rw
environment = OPENSVC_MCP_DELEGATED_SOCKET=/run/opensvc-ai/sock/oc3-mcp.sock
	OPENSVC_MCP_COLLECTOR_URL=https://collector.example.com/api
	OPENSVC_MCP_DELEGATED_ISSUER=https://sso.example.com/application/o/oc3/
	OPENSVC_MCP_DELEGATED_AUDIENCE=<client id of the collector>
	OPENSVC_MCP_ACTIONS=enabled

[container#agent]
type = docker
image = ghcr.io/opensvc/ai-agent:0.2.1
netns = container#0
rm = true
restart = 3
user = 995:983
volume_mounts = /etc/localtime:/etc/localtime:ro
	/etc/opensvc-ai:/etc/opensvc-ai:ro
	/run/opensvc-ai/sock:/run/opensvc-ai/sock:ro
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
* `volume#state` holds the conversations. On a `drbd` pool, `shared = true`
  is required: the filesystem is made once, on the node the provision starts
  from, the peer receiving it by replication.
* `OPENSVC_MCP_ACTIONS=enabled` offers the actions to the model, each one
  confirmed by the user; without it, the assistant only reads.
* `container#oc3mcp` serves the collector, and the agent reaches it through
  `OPENSVC_AI_OC3_MCP_SOCKET`: its values are explained in
  [Configure](configure.md#oc3-mcp). A site without collector leaves both
  out, and the agent then serves the webapps only.
* `fs#om3conf` and `fs#oc3conf` hold the configuration of each MCP, readable
  by the group of the MCPs only: the catalogue of om3-mcp, and the
  certificate of the service address, which the MCPs present to
  [external MCP clients](configure.md#external-mcp-clients).

Deploy it:

```bash
om system/svc/ai create --config ai.conf
om system/svc/ai provision --wait
```

## Check

```bash
sudo curl --cacert /var/lib/opensvc/certs/ca_certificates https://ai.system.svc.cluster1:8090/health
```

as root on a node of the cluster, whose agent installs the CA of the cluster there.
The agent answers `200` once it listens; it reaches the MCP sockets at each
request, so it starts before them. Then open the assistant from a webapp,
once [configured](configure.md#the-webapps), and ask "what is the state of the
cluster?": the answer names the nodes and the objects.

The logs of the components go to journald, tagged after them:

```bash
journalctl -t opensvc-ai-agent -t opensvc-mcp -t oc3-mcp
```

with `run_args = --log-driver=journald --log-opt tag=opensvc-ai-agent` on the
container of each.
