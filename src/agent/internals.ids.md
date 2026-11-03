<!-- llms: The three ids naming what the agent does, session, execution and orchestration: which one to ask with, and where they are recorded. -->
# Session, Execution and Orchestration Ids

Three identifiers name what the agent is doing, at three different scales.
They appear in the logs, in what an action returns to its submitter, and as
the keys of the two stores the daemon answers questions about past work from.

Each is spelled the same way wherever it appears: `session_id`, `exec_id` and
`orchestration_id` in the API and in the logs, `SessionID`, `ExecID` and
`OrchestrationID` in the code, `OSVC_SESSION_ID`, `OSVC_EXEC_ID` and
`OSVC_ORCHESTRATION_ID` in the environment. None of the three is abbreviated,
so none of them has to be disambiguated.

## session_id, the session

An `om` or `ox` command takes a session id when it starts, unless its
environment already names one in `OSVC_SESSION_ID`, in which case it takes
that. The daemon exports its own into the commands it forks, so a whole chain
of causation shares one session id: the command an operator typed, the
commands the daemon forked because of it, and the commands those forked in
turn.

A session id therefore names **what was asked for**, not what was run. One
command can reach several objects, several nodes, or both, and all of it is
one session.

## exec_id, the execution

Each command the daemon forks takes an execution id of its own, exported as
`OSVC_EXEC_ID`.

An execution is **one run of one object on one node**. It is the scale at
which there is a single outcome, a single duration and a single object, which
is why it, and not the session, is what the daemon records:

```bash
$ om 'pod[36]' instance stop --node '*'
OBJECT  NODE    SESSION_ID                            EXEC_ID
pod6    dev2n1  e9440381-9507-42b3-bef3-2c815aceb169  d29abc32-2c0b-45ff-b639-508d5c19fbee
pod3    dev2n1  e9440381-9507-42b3-bef3-2c815aceb169  9178f4f8-cd37-4ab5-874f-6d72b1d825f5
pod6    dev2n2  e9440381-9507-42b3-bef3-2c815aceb169  f40da200-7b6f-41aa-b6aa-dc2568b8cde2
pod3    dev2n2  e9440381-9507-42b3-bef3-2c815aceb169  83956396-5e06-4660-82d1-6a45d7e32a90
pod3    dev2n3  e9440381-9507-42b3-bef3-2c815aceb169  330d06d0-6691-42d6-baeb-80579462f621
pod6    dev2n3  e9440381-9507-42b3-bef3-2c815aceb169  d71c1b5f-61ab-480c-a06a-454bdd51de24
```

One session, six executions, each with its own outcome. Two of them ran on
each node, so a node holds several executions of one session, and the exec id
is what tells them apart:

```bash
$ om daemon exec list --session-id e9440381-9507-42b3-bef3-2c815aceb169 --node '*'
NODE    STATE      EXEC_ID    SESSION_ID  PATH  ORIGIN  STARTED_AT  DURATION  COMMAND
dev2n1  succeeded  9178f4f8…  e9440381…   pod3  api     …         218ms     om pod3 instance stop
dev2n1  succeeded  d29abc32…  e9440381…   pod6  api     …         11s       om pod6 instance stop
dev2n2  succeeded  f40da200…  e9440381…   pod6  api     …         283ms     om pod6 instance stop
…
```

Folding those back into the one thing that was submitted is what
`om daemon session list` is for:

```bash
$ om daemon session list e9440381-9507-42b3-bef3-2c815aceb169
SESSION_ID  STATE      EXECS  FAILED  NODES  OBJECTS  ORIGIN  STARTED_AT  DURATION  COMMAND
e9440381…   succeeded  6      0       3      2        api     …         11s       om pod3 instance stop (+5)
```

## orchestration_id, the orchestration

When a command asks for a target state that the daemons must cooperate to
reach, rather than for a command to be run somewhere, the object is assigned
an orchestration id, exported as `OSVC_ORCHESTRATION_ID`.

```bash
$ om pod3 switch
OBJECT  ORCHESTRATION_ID                      STATUS
pod3    934a42f9-b7eb-4d7e-a3ac-18347522f9f9  accepted
```

An orchestration is not a command: the cluster decides which nodes act and
what they run. A switch stops the object on one node and starts it on
another, which is two executions, on two nodes, under the one orchestration
id. Every node of the object knows the orchestration under that id, the
daemons replicating the instance monitors it is carried in.

The executions an orchestration causes carry its id, and the ones it did not
cause carry none: an execution that is a step of nothing is given no
`OSVC_ORCHESTRATION_ID` at all, rather than one that matches nothing. A status
evaluation is a step of nothing, and says so by its silence.

## Which one to ask with

An accepted action returns the session id **and** the execution id of the run
it accepted, so the submitter can ask after either scale:

```bash
om daemon session list <session_id>              # how the whole of what I submitted went
om daemon exec list --session-id <session_id>    # each of its runs, one by one
om daemon exec list <exec_id>                    # the one run I am waiting on
om daemon orchestration list <orchestration_id>  # the target state, from any node
```

## Where they are recorded

| id | log key | store | asked through |
| :--- | :--- | :--- | :--- |
| `session_id` | `SESSION_ID` | — | a filter over the exec store, folded by the client |
| `exec_id` | `EXEC_ID` | execs | `GET /api/node/name/<node>/daemon/exec` |
| `orchestration_id` | `ORCHESTRATION_ID` | orchestrations | `GET /api/node/name/<node>/daemon/orchestration` |

The exec store is keyed by exec id, and a session is a filter over it. There
is no session store, and no session endpoint, because a session spans the
nodes it reached and each daemon holds only the execs it ran: a per-node
session would be a partial one. The client asks every node and folds what they
answer.

The exec store also answers what is running now. A running exec carries the
pid of its process, joined from the process table on the exec id, which is why
`om daemon ps` is that listing with the running state preselected rather than
a second command over a second store.

Both stores are bounded, so an identifier the daemon no longer holds is
reported as forgotten rather than as unknown.

The same three keys are set on the log entries, so what a store no longer
holds can still be found for as long as the logs keep it:

```bash
journalctl SESSION_ID=a78a69fc-…
journalctl EXEC_ID=1149992d-…
journalctl ORCHESTRATION_ID=934a42f9-…
```

## In an app, task or trigger

A resource the agent runs a command for is given the session id in its
environment twice, under two names with two audiences:

* `OSVC_SESSION_ID` is the agent's own variable, the one a forked `om`
  inherits so it joins the session rather than starting one.
* `OPENSVC_SESSION_ID` belongs to the `OPENSVC_*` family the agent exports for
  the script to read, beside `OPENSVC_SVCNAME`, `OPENSVC_ACTION` and
  `OPENSVC_LEADER`.

## A node orchestration

A node has a monitor of its own, carrying an orchestration id the same way an
instance monitor does, so a target state asked of the nodes rather than of an
object is an orchestration too.

> **Note:** these are not currently reported by
> `om daemon orchestration list`. The node orchestration id has not been
> observed reaching the replicated node monitors the listing is built from,
> where the object one does.

> ➡️ See Also
> * [Follow an Action](apps.operate.sessions.md)
> * [Events](internals.daemon.events.md)
