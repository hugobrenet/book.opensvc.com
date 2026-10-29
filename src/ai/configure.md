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
    base_url: https://ai.system.svc.cluster1:8090
    path: /v1/oc3
    # the CA of the cluster of the agent, which signs its certificate
    ca_file: /etc/oc3/agent-ca.pem
```

Without it, the interface offers no assistant. A user signed in with a
password, or impersonating another, is refused: the agent takes the tokens of
the single sign-on only.

## External MCP clients

The MCPs also serve MCP clients other than the agent, such as Claude Desktop,
over HTTPS on their ports. This is optional. A client signs in with OAuth at
a public client of the identity provider, and calls the MCP with the token it
gets. The MCP never passes that token on: for each call, it exchanges it, with
OAuth 2.0 Token Exchange (RFC 8693), for a token of the daemon of the cluster,
or of the collector, through a confidential client of the provider, the
exchange client. The daemon or the collector then applies the grants of the
user, as for the assistant.

The provider must support Authorization Code with PKCE and the token exchange.
Its setup, the public client, the exchange client and the claims the exchanged
tokens carry, is described in
[om3-mcp token exchange](https://github.com/opensvc/om3-mcp/blob/main/docs/token-exchange.md#sso-requirements)
and [oc3-mcp configuration](https://github.com/opensvc/oc3-mcp/blob/main/docs/configuration.md#token-exchange).
The MCPs need the settings below.

### The listener

Each MCP listens on HTTPS when its certificate is set, with these variables
in its container environment:

| Variable | Value |
| --- | --- |
| `OPENSVC_MCP_LISTEN_ADDR` | `[::]:8443` for om3-mcp, `[::]:8444` for oc3-mcp |
| `OPENSVC_MCP_TLS_CERT_FILE`, `OPENSVC_MCP_TLS_KEY_FILE` | the certificate of the service, in the configuration directory of the MCP |
| `OPENSVC_MCP_OAUTH_RESOURCE_URL` | the public URL of the MCP, ending in `/mcp`, such as `https://ai.example.com:8443/mcp`: the audience of the tokens the clients present |
| `OPENSVC_MCP_OAUTH_ISSUER` | the issuer of the public client the clients sign in with |
| `OPENSVC_MCP_AUTH_CONFIG_FILE` | the exchange profiles, `auth.yaml` |

### The exchange profiles: auth.yaml

`auth.yaml` describes the exchange client the MCP authenticates as, never its
secret, which stays in a file of its own:

```yaml
version: 1
profiles:
  site-sso:
    issuer: https://sso.example.com/application/o/om3-mcp-exchange/
    client_id: om3-mcp-exchange
    client_secret_file: /etc/opensvc-om3-mcp/secrets/om3-mcp-exchange
    token_endpoint_auth_method: client_secret_basic
    scopes: [opensvc-mcp]
    request_timeout: 10s
```

| Key | Meaning |
| --- | --- |
| `profiles` | 1 to 64 profiles, each named: the clusters, or the collector, name the one they are exchanged with |
| `issuer` | the HTTPS issuer of the exchange client: its discovery document gives the token endpoint |
| `client_id` | the confidential exchange client |
| `client_secret_file` | the absolute path of its secret: a regular file of one line, at most 16 KiB, mode `0600` or `0400`, owned by the account of the MCP, `994` |
| `token_endpoint_auth_method` | `client_secret_basic`, the default, or `client_secret_post`, as the provider expects |
| `scopes` | up to 32 scopes requested with each exchange, those for which the provider puts the claims of the user in the exchanged token |
| `request_timeout` | 1 second to 1 minute, 10 seconds by default |
| `tls.ca_file` | optional: the CA of the provider when it is not public; the TLS of the provider cannot be disabled |

The MCP reads the secret at start: restart it after a rotation. In the
service, `auth.yaml` comes from the cfg of the MCP and the secret from its
sec, both installed in the configuration directory of the MCP in
`volume#ai`:

```ini
	/om3conf/auth.yaml from ./cfg/om3-mcp key auth.yaml required
	/om3conf/secrets/
	/om3conf/secrets/om3-mcp-exchange from ./sec/om3-mcp key exchange mode 0400 user 994 required
```

### om3-mcp: the clusters

Each cluster the external clients reach names, in the catalogue, the profile
it is exchanged with and the audience of the tokens of its daemons, the
client id the daemons trust, `listener.openid_client_id`:

```yaml
clusters:
  cluster1:
    # … as for the assistant, and:
    auth:
      profile: site-sso
      audience: om3-cluster1
```

A cluster without `auth` is served to the assistant only: the external
clients do not see it.

### oc3-mcp: the collector

oc3-mcp exchanges with one profile, for the collector:

| Variable | Value |
| --- | --- |
| `OPENSVC_MCP_COLLECTOR_AUTH_PROFILE` | the profile of `auth.yaml` |
| `OPENSVC_MCP_COLLECTOR_AUDIENCE` | the client id the collector trusts, the audience of the exchanged tokens |

The scopes of its profile are those of the collector provider, for which the
exchanged token carries the claims the rules of the collector test. The two
variables and `OPENSVC_MCP_AUTH_CONFIG_FILE` go together: without them, the
external clients list the tools, and their calls are refused.

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
VITE_AI_AGENT_URL=https://ai.system.svc.cluster1:8090 npm run build
```

The browser then calls the agent at that origin: the service needs an
address the browsers reach, on a `lan` network, and a certificate they trust.
The agent must allow the origin of each webapp, the daemon listeners the
users open, comma separated:

```bash
om system/svc/ai config update --set "container#agent.environment+=OPENSVC_AI_CORS_ALLOWED_ORIGINS=https://cluster1.example.com:1215,https://cluster2.example.com:1215"
```

See the [browser client guide](https://github.com/opensvc/ai-agent/blob/main/docs/webapp.md).
