# AI Assistant

The AI assistant answers questions about the clusters and the collector, and
acts on them, from a chat: "why is this service down?", "which drivers can I
use on this node?", "freeze the node before its maintenance", "which services
failed to start last night?". It reads the state through the same APIs as the
interfaces and the `om` command, with the rights of the user who asks, and
runs no action without the user confirming it.

Users reach it from two interfaces:

* **the webapp of a cluster**, for the questions on that cluster, answered
  through the daemons;
* **the interface of the collector**, for the questions across the clusters,
  answered through the collector, which relays the chat to the agent.

One deployment serves a whole site: the clusters it is configured for, and
the collector. It runs as one OpenSVC service on one cluster, such as the
cluster of the collector, and is made of three components:

* **The agent** serves the chat to the interfaces. It runs the conversation with a
  language model, offers it the tools of the MCP servers, asks the user to
  confirm an action, and stores the conversations.
* **om3-mcp** gives the model the tools of the cluster: the status of the
  objects, instances and nodes, their configuration, logs and capabilities,
  and, when enabled, the actions, such as start, stop, freeze or switch. Each
  tool is one call of the daemon API.
* **oc3-mcp**, optional, gives the model the tools of the collector: the
  inventory of the nodes and services of every cluster, their alerts, the
  actions the agents reported, the orchestrations, the forms. It serves the
  questions that span clusters.

```text
   webapps of the clusters        collector interface
              │                            │
              │                          HTTPS
              │                            ▼
              │                collector /api/assistant
              │                            │
            HTTPS                        HTTPS
              ▼                            ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │       /v1/om3        agent         /v1/oc3                       │
   └──────────────────────────────────────────────────────────────────┘
              │                            │                  │
         unix socket                  unix socket           HTTPS
              ▼                            ▼                  ▼
           om3-mcp                      oc3-mcp      language model API
              │                            │
            HTTPS                        HTTPS
              ▼                            ▼
   daemons of the clusters           collector API
```

The agent serves two backends: `/v1/om3` for the webapps, the cluster of each
request named by its `X-OpenSVC-Cluster-ID` header, and `/v1/oc3` for the
collector.

## Whose rights

The assistant has no rights of its own. The webapp signs the user in with the
OpenID provider the daemons of the cluster trust, and the collector interface
with the provider of the collector; each sends the access token of the user
with each message. The agent passes that token, unchanged, to the
MCP, which verifies it against the provider it is configured with for the
cluster, or the collector, then calls the daemon, or the collector, with it:
they check the token again and enforce the grants of the user, as for any
other client. A user who may not
stop a service cannot have the assistant stop it.

The token is never stored, logged, or given to the model.

## Confirmation of the actions

A tool that changes the cluster is marked as such by the MCP. Before it runs,
the agent stops the turn and shows the user the exact call: the tool, the
object and the node. The action runs only once the user approves it; a
rejection is told to the model, which goes on without it. The user may edit
the arguments of the call before approving it.

The confirmation is the guard of the actions: the daemon, and the collector
for oc3-mcp, remain the authority on what a user may do.

## What is stored

The agent keeps, in a SQLite database on the volume of its service:

* the conversations of each user, their messages and the calls of their
  tools, for the lifetime of the conversation, 7 days by default from its last
  turn;
* the feedback the users give on the answers, 180 days by default.

The model sees the questions and the results of the tools of the turn. The
email addresses the collector holds are masked before they reach it.

## Next

* [Install](install.md) the service.
* [Configure](configure.md) the language model, the clusters, the collector
  and the interfaces.
* [Operate](operate.md) it: upgrade, failover, logs.
* [Design](design.md) explains the choices behind it.
