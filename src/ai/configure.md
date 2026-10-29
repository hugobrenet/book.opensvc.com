# Configure

The components read their settings at start: restart the container after a
change, `om system/svc/ai restart --rid container#agent`.

## The language model

The keys of `system/cfg/ai`, and the token in `system/sec/ai`:

| Key | Values |
| --- | --- |
| `OPENSVC_AI_LLM_PROTOCOL` | `responses` (OpenAI Responses), `chat_completions`, or `messages` (Anthropic) |
| `OPENSVC_AI_LLM_BASE_URL` | the API base, such as `https://api.openai.com/v1` |
| `OPENSVC_AI_LLM_MODEL` | the model name |
| `OPENSVC_AI_LLM_AUTH_MODE` | `bearer`, `api_key` (Anthropic), or `none` |
| `OPENSVC_AI_LLM_API_TOKEN` | the token, in `system/sec/ai` |
| `OPENSVC_AI_LLM_REASONING_EFFORT` | optional: `none` to `xhigh`, as the model accepts |
| `OPENSVC_AI_LLM_TIMEOUT` | optional, `2m` by default |
| `OPENSVC_AI_AGENT_MAX_ITERATIONS` | optional: model requests per turn, `8` by default |

A self-hosted model, such as one served by vLLM, is reached with
`chat_completions`. The agent requires HTTPS with a certificate it trusts,
or plain HTTP to a loopback address, such as an SSH tunnel to the server of
the model.

The complete list is in the
[agent README](https://github.com/opensvc/ai-agent#optional-environment-variables).

## The cluster catalogue

om3-mcp calls the daemons of the clusters its catalogue names, one entry per
cluster the assistant serves:

```yaml
clusters:
  cluster1:
    name: cluster1
    cluster_id: 00000000-0000-4000-8000-000000000001
    endpoint: https://cluster1.example.com:1215
    delegation:
      issuer: https://sso.example.com/application/o/cluster1/
      audience: om3-cluster1
    request_timeout: 20s
  cluster2:
    name: cluster2
    cluster_id: 00000000-0000-4000-8000-000000000002
    endpoint: https://cluster2.example.com:1215
    delegation:
      issuer: https://sso.example.com/application/o/cluster2/
      audience: om3-cluster2
    request_timeout: 20s
```

* `cluster_id` is the id of the cluster, `om cluster config get --kw cluster.id`.
  The webapp sends it with each message, and the agent passes it to the MCP,
  which routes the calls by it.
* `endpoint` is the address of the cluster VIP, the API listener.
* `delegation` is the OpenID provider of the daemons: the issuer and the
  client id the public `GET /api/auth/info` of the daemon gives, as
  `openid.issuer` and `openid.client_id`. The MCP verifies the token of each
  request for them before it reaches the daemon, which verifies it again.

The catalogue is described in
[om3-mcp configuration](https://github.com/opensvc/om3-mcp/blob/main/docs/configuration.md#cluster-catalogue-and-exchange-profiles).

## The collector

The collector needs two settings: oc3-mcp, for the model to read the
collector, and the relay of the collector, for its interface to reach the
agent.

### oc3-mcp

`container#oc3mcp` of the [service](install.md#create-the-service) reaches
the collector API with the token of the user too, verified against the
OpenID client of the collector:

| Variable | Value |
| --- | --- |
| `OPENSVC_MCP_COLLECTOR_URL` | the collector API, such as `https://collector.example.com/api` |
| `OPENSVC_MCP_DELEGATED_ISSUER` | the issuer of the OpenID provider of the collector, as its `/api/auth/info` gives it |
| `OPENSVC_MCP_DELEGATED_AUDIENCE` | the client id of the collector, the audience of its tokens |
| `OPENSVC_MCP_COLLECTOR_CA_FILE` | optional, when the certificate of the collector is not signed by a public authority |

The agent serves the collector backend, `/v1/oc3`, once
`OPENSVC_AI_OC3_MCP_SOCKET` names the socket of oc3-mcp. See
[oc3-mcp configuration](https://github.com/opensvc/oc3-mcp/blob/main/docs/configuration.md).

### The collector interface

The interface of the collector calls its own server, `/api/assistant`, which
relays the chat to the agent with the access token of the user, and nothing
else of the browser's request: no cross-origin request, no CORS. Set the
agent in the configuration of the collector server:

```yaml
server:
  assistant:
    base_url: https://ai.example.com:8090
    path: /v1/oc3
    # when the certificate of the agent is not signed by a public authority:
    # ca_file: /etc/oc3/agent-ca.pem
```

Without it, the interface offers no assistant. A user signed in with a
password, or impersonating another, is refused: the agent takes the tokens of
the single sign-on only.

## External MCP clients

The MCPs also serve MCP clients other than the agent, such as Claude Desktop,
over HTTPS on their ports: a client signs in with OAuth, and the MCP exchanges
its token for one of the daemon, or of the collector, through a confidential
client of the OpenID provider (`auth.yaml`, its secret in a sec). This is
optional: each MCP then installs its exchange profile and its secret in its
configuration directory, `fs#om3conf` or `fs#oc3conf`, and sets its HTTPS
listener, with the certificate the directory holds. It is set up in
[om3-mcp authentication](https://github.com/opensvc/om3-mcp/blob/main/docs/authentication.md)
and [oc3-mcp configuration](https://github.com/opensvc/oc3-mcp/blob/main/docs/configuration.md#token-exchange).

## Conversations

| Key | Default |
| --- | --- |
| `OPENSVC_AI_CONVERSATION_LIFETIME` | `168h`: a conversation expires 7 days after its last turn |
| `OPENSVC_AI_CONVERSATION_MAX_PER_USER` | `128` conversations per user, every backend together |
| `OPENSVC_AI_CONVERSATION_MAX` | `4096` conversations for the agent |
| `OPENSVC_AI_CONVERSATION_MAX_DATABASE_MIB` | `256` MiB of stored messages |

A user over quota is told to delete conversations, or to wait for them to
expire; the others are not held back. Keep the database limit well below the
size of the volume of the service.

## The webapps

The webapp of each cluster offers the assistant when it is built with the
address of the agent:

```bash
VITE_AI_AGENT_URL=https://ai.example.com:8090 npm run build
```

The browser then calls the agent at that origin, which must allow the origin
of each webapp, the daemon listeners the users open, comma separated:

```bash
om system/svc/ai config update --set "container#agent.environment+=OPENSVC_AI_CORS_ALLOWED_ORIGINS=https://cluster1.example.com:1215,https://cluster2.example.com:1215"
```

See the [browser client guide](https://github.com/opensvc/ai-agent/blob/main/docs/webapp.md).
