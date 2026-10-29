# Design

The choices behind the assistant, and why.

## The rights of the user, end to end

The assistant has no account of its own. A service account would let any
user reach, through the model, what the account may do; the token of the user
keeps each request within the grants of the one who asked, enforced by the
daemon as for the `om` command. The MCP verifies the token before it calls
the daemon, so a token of another provider never reaches it, and the daemon
verifies it again.

## One tool, one call of the API

Each tool of an MCP is one bounded call of the daemon or collector API, typed,
with its result trimmed to what answers the question: no generic proxy, no
free-form request. The model chooses among tools it can understand, and the
results fit its context.

The model is shown the core tools of the cluster state, and finds the others
with a search of the catalogue by keywords: a catalogue of more than a
hundred tools would fill each request.

## The confirmation as the guard of the actions

An action changes the cluster: the user sees the exact call and approves it,
or not. The MCP marks the destructive tools, and the agent asks for them. A
refusal of the MCP, when a call would misfire, names the next step, such as
freezing an instance before shutting it down.

## Procedures as skills, measured first

Some tasks need a procedure, such as preparing a node for a maintenance:
freeze, then shut down, then check. The MCP serves such procedures as skills,
which the model loads before acting. A skill is added only where the model
was measured failing without it on a lab, and measured succeeding with it.
The behaviour of the model is measured by scenarios replayed on a lab
cluster, before and after each change of a prompt, a tool description or a
model.

## One agent, a SQLite database on a replicated volume

A customer runs one agent, for some tens of users: a few hundred turns a day,
some tens of megabytes. SQLite holds that with room to spare, with one writer,
and a durable write of each turn. The failover comes from the volume, which a
`drbd` pool replicates: a server database would need the same volume to fail
over, and adds a component to run. Quotas per user keep one user from filling
the store of the others.

## What the model sees

The model sees the question and the results of the tools it calls, nothing
else of the cluster. The email addresses the collector holds are masked
before they reach it. Tokens are never stored, logged, or given to it.
