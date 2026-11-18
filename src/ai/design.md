<!-- llms: The design choices of the AI assistant and why: the rights of the user end to end, typed tools, confirmation of destructive actions, skills, storage, and what the model sees. -->
# Design

The choices behind the assistant, and why.

## The rights of the user, end to end

The assistant has no account of its own. A service account would let any
user reach, through the model, what the account may do; the token of the user
keeps each request within the grants of the one who asked, enforced by the
daemon as for the `om` command. The MCP verifies the token before it calls
the daemon, so a token of another provider never reaches it, and the daemon
verifies it again.

## Typed tools, no generic proxy

Each tool of an MCP is a typed use of the daemon or collector API, one call
or a few bounded ones, with its result trimmed to what answers the question:
no generic proxy, no free-form request. The model chooses among tools it can
understand, and the results fit its context.

The model is shown the core tools of the cluster state, and finds the others
with a search of the catalogue by keywords: a catalogue of more than a
hundred tools would fill each request.

## The confirmation as the guard of the destructive actions

A destructive action, one that stops, deletes, overwrites or moves what
runs, waits for the user: the user sees the exact call and approves it, or
not. The MCP marks the destructive tools, and the agent asks for them. The
other actions, such as a start or a freeze, run as the reads do: the model
is told to call them only when the user asked for them, which is an
instruction, not a guard; a site that wants none leaves
`OPENSVC_MCP_ACTIONS` disabled. A refusal of the MCP, when a call would
misfire, names the next step, such as freezing an instance before shutting
it down.

## Procedures as skills, measured first

Some tasks need a procedure, such as preparing a node for a maintenance:
freeze, then shut down, then check. Such procedures are skills, which the
model loads before acting. They are stored in the collector, not in the
MCPs: a site publishes its own, its procedures and conventions, and restricts
each to the groups it concerns, without a new release of the MCPs. The
skills OpenSVC ships were added only where the model was measured failing
without them on a lab, and measured succeeding with them; a site answers for
those it writes. The model reads them as instructions, for every user they
are published to: the right to publish them, `AIManager`, is granted as the
`Manager` one is, not as an editorial role. The behaviour of the model is measured by scenarios
replayed on a lab cluster, before and after each change of a prompt, a tool
description or a model.

## One agent, a SQLite database on a replicated volume

A customer runs one agent, for some tens of users: a few hundred turns a day,
some tens of megabytes. SQLite holds that with room to spare, with one writer,
and a durable write of each turn. The failover comes from the volume, which a
`drbd` pool replicates: a server database would need the same volume to fail
over, and adds a component to run. Quotas per user keep one user from filling
the store of the others.

## What the model sees

The model sees:

* the question, and the context of the page it is asked from: the page, the
  record open, its tab, the rows ticked, the time zone and the time of the
  user, which the webapp sends as data, never as instructions, and the agent
  never keeps in the conversation: a turn waiting for a confirmation holds it
  until it is answered or expires;
* the results of the tools it calls, and those of the earlier turns of the
  conversation, compacted;
* the resources and the skills it reads, as the user may read them;
* when the agent is configured for them, the pages of this book and the
  source code of the daemon it searches.

Nothing else of the cluster reaches it. The email addresses the collector
holds are masked before they reach it, and the phone numbers are never read. Tokens are
never stored, logged, or given to it.
