<!-- llms: How to follow an action submitted to the daemon: its session, execution and orchestration ids, what runs now, how to stop it, and what it logged. -->
# Follow an Action

An action submitted to the daemon returns before it is done. What comes back
is a pair of identifiers, and the daemon remembers what became of them, so a
client that asked for something can ask how it went.

> The **API** tabs assume the `$TOKEN` and the listener endpoint set up in
> [Cluster API](configure.api.md). The daemon answers for what it ran, so
> an exec listing is per node and a client wanting the whole of a session
> asks every node and folds the answers, which is what the cli commands do.
> An orchestration needs no such union: any node answers for it.

## Three commands, three scales

| command | one row is | ask it when |
| :--- | :--- | :--- |
| `om daemon session list` | one submitted command, whole | "how did what I asked for go?" |
| `om daemon exec list` | one run of one object on one node | "which part of it failed, and why?" |
| `om daemon ps` | one run that is still running | "what is running now, and what is its pid?" |

`om daemon ps` is `om daemon exec list --state running` under a shorter name
and with the pid in front. What is running and what has run are the same
records at different ages, so they are one listing.

## The identifiers you are given

An action addressed to a node returns the **session** id and the **exec** id.
The session is the whole of what you submitted; the exec is the one run:

```bash
$ om 'pod[36]' instance stop --node '*'
OBJECT  NODE    SESSION_ID                            EXEC_ID
pod6    dev2n1  e9440381-9507-42b3-bef3-2c815aceb169  d29abc32-2c0b-45ff-b639-508d5c19fbee
pod3    dev2n1  e9440381-9507-42b3-bef3-2c815aceb169  9178f4f8-cd37-4ab5-874f-6d72b1d825f5
pod6    dev2n2  e9440381-9507-42b3-bef3-2c815aceb169  f40da200-7b6f-41aa-b6aa-dc2568b8cde2
…
```

An action addressed to the object returns an **orchestration** id instead. The
cluster decides which nodes act, and one orchestration runs execs on each of
them:

```bash
$ om pod3 switch
OBJECT  ORCHESTRATION_ID                      STATUS
pod3    934a42f9-b7eb-4d7e-a3ac-18347522f9f9  accepted
```

[Session, Execution and Orchestration Ids](internals.ids.md) says how the
three relate.

## Asking after a session

One row, whatever it took:

```bash
$ om daemon session list e9440381-9507-42b3-bef3-2c815aceb169
SESSION_ID  STATE      EXECS  FAILED  NODES  OBJECTS  ORIGIN  STARTED_AT  DURATION  COMMAND
e9440381…   succeeded  6      0       3      2        api     …         11s       om pod3 instance stop (+5)
```

`STATE` is the state of the whole: running while any of its execs runs, failed
if any of them failed, and succeeded only when every one of them did. That is
the question you came with, and the reason not to count rows yourself.

`DURATION` is how long you waited, not the sum of the parts: the execs run at
the same time.

Every node is asked. A session spans the nodes it reached, and the count of
part of one is not the session's count, so this command does not default to
the local node the way the others do.

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om daemon session list                       # every session this cluster remembers
om daemon session list --state failed        # sessions with a failed exec in them
om daemon session list --origin scheduler
```

</div>
<div class="tab" data-title="API">

```bash
# the execs, to fold into sessions yourself, on each node in turn
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/daemon/exec"
curl -s -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'state=failed' \
  "https://<node>:1215/api/node/name/<node>/daemon/exec"
curl -s -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'origin=scheduler' \
  "https://<node>:1215/api/node/name/<node>/daemon/exec"
```

</div>
</div>

## Asking after one run

When a session failed, the exec listing says which part did:

```bash
$ om daemon exec list --session-id 1ed811b1-088d-4531-bd32-c4be35efe29e --node '*'
NODE    STATE   EXEC_ID    SESSION_ID  PATH  ORIGIN  STARTED_AT  DURATION  COMMAND
dev2n1  failed  ff0c2d2e…  1ed811b1…   pod3  api     …         35ms      om pod3 instance start --rid nosuch
```

and `-o json` carries the exit code and the error:

```bash
$ om daemon exec list ff0c2d2e-e6a5-47ef-800b-304610179fc6 -o json
[
    {
        "node": "dev2n1",
        "state": "failed",
        "exec_id": "ff0c2d2e-e6a5-47ef-800b-304610179fc6",
        "session_id": "1ed811b1-088d-4531-bd32-c4be35efe29e",
        "path": "pod3",
        "origin": "api",
        "started_at": "2026-09-11T12:31:23+02:00",
        "ended_at": "2026-09-11T12:31:23+02:00",
        "duration": "35ms",
        "exit_code": 1,
        "command": "/usr/bin/om pod3 instance start --rid nosuch",
        "error": "/usr/bin/om exit code 1 not in success codes: [0]"
    }
]
```

The api carries the two ends and not the length. `duration` is derived where
it is shown, the same way for an exec, a session and an orchestration, so the
three numbers cannot drift apart: an exec's end is its start plus what the
daemon measured while the process ran, never the instant the news reached the
store. A span that has not ended is measured against the clock of whoever is
reading.

`exit_code` is what the shell would report: the process status, or 128 plus
the signal number when a signal ended it (`143` for SIGTERM, `137` for
SIGKILL). It is `-1` only when the process never ran at all. A running exec
has no exit code, which is what tells it apart from one that exited zero.

## What is running now

```bash
$ om daemon ps
PID      NODE    EXEC_ID                               PATH      RID  ORIGIN  DURATION  COMMAND
3871250  dev2n1  1a4a5266-49d8-4983-8613-073b1d40744c  test1          imon    18ms      om test1 instance status -r
3871248  dev2n1  be384858-f3d8-4fab-9fd4-f147427cb6d2  svc111         imon    20ms      om svc111 instance status -r
```

Only the processes listed here can be signaled.

`ORIGIN` says what submitted the run: `api` for a command a client sent,
`imon` and `nmon` for one the monitors decided on, `scheduler` for one that
came due. `RID` is set on the scheduler's runs, naming the resource whose
schedule fired.

## Stopping what is running

`om daemon kill` signals the execs a filter selects, and the filter is the one
`om daemon exec list` takes, so what you listed is what you signal:

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om daemon kill --session-id 723906bb-…  --node '*'   # stop what I submitted, everywhere
om daemon kill --orchestration-id 934a42f9-…         # stop an orchestration's runs
om daemon kill 823c9944-…                            # one exec
om daemon kill -s 'pod*' --signal=term               # everything running on these objects
```

</div>
<div class="tab" data-title="API">

```bash
# each call signals the execs of one node
curl -s -X DELETE -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'session_id=723906bb-…' \
  "https://<node>:1215/api/node/name/<node>/daemon/exec"
curl -s -X DELETE -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'orchestration_id=934a42f9-…' \
  "https://<node>:1215/api/node/name/<node>/daemon/exec"
curl -s -X DELETE -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'exec_id=823c9944-…' \
  "https://<node>:1215/api/node/name/<node>/daemon/exec"
curl -s -X DELETE -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'selector=pod*' --data-urlencode 'signal=TERM' \
  "https://<node>:1215/api/node/name/<node>/daemon/exec"
```

</div>
</div>

There is no pid option, on purpose. Naming the exec rather than the pid is
what makes signaling the wrong process impossible: a pid you read from a
listing may have exited and been recycled by the time you send the signal,
where an exec id is resolved to its pid by the daemon at the moment it
signals, under the lock that keeps the two in step. The pid is reported all
the same, and killing a pid is what the system's own `kill` is for.

Something must narrow the selection. Signaling every exec of a node is not
something you do by leaving the options out, and an empty filter is refused
rather than obeyed. `--dry-run` reports what would be signaled and signals
nothing:

```bash
$ om daemon kill --session-id 723906bb-… --node '*' --dry-run
PID      NODE    EXEC_ID                               PATH  RID  ORIGIN  DURATION  COMMAND
3955881  dev2n1  0131c61e-3a8a-412d-8ea1-8bcecc0ea9f5  pod1       api     1s        om pod1 instance start
```

The answer is the execs signaled, in the same shape the listing uses, so a
kill that matched nothing says so by answering nothing. An exec that has
already ended selects nothing, which is the outcome you asked for.

## Asking after an orchestration

```bash
$ om daemon orchestration list 934a42f9-b7eb-4d7e-a3ac-18347522f9f9
STATE      ORCHESTRATION_ID  PATH  GLOBAL_EXPECT  ACCEPTED_BY  STARTED_AT                 DURATION
succeeded  934a42f9          pod3  placed@        dev2n1       2026-09-10T20:34:27+02:00  4s
```

**Any node answers.** Every node of the object learns of the orchestration
from the instance monitors the daemon replicates, so it does not matter which
one you reach. That is what lets a client behind a floating address follow an
orchestration: the address may move to another node while the orchestration
runs, and a switch is precisely what moves it.

`ACCEPTED_BY` is the node that was asked for the orchestration, and is empty
on a node that only learned of it from the monitors. It is the one detail that
differs between nodes; the state, the object, the target and the start do not.

Through the api, the same id is asked of any node, and the call can be told to
hold until the orchestration ends rather than answer its current state:

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/daemon/orchestration/id/934a42f9-…?wait=5m"
```

It answers 200 with the orchestration once it has ended, 408 if it is still
running when `wait` expires, and 410 if the daemon no longer knows the id. A
client that submitted an action and wants to know how it went has nothing else
to keep: neither a connection held open since the submission, nor a node it
has to come back to.


The execs an orchestration caused are found by its id:

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om daemon exec list --orchestration-id 934a42f9-… --node '*'
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'orchestration_id=934a42f9-…' \
  "https://<node>:1215/api/node/name/<node>/daemon/exec"
```

</div>
</div>

## Reading what an id logged

The listings say how an action went. To read what it said while it went, give
the same id to the matching `logs` command:

```bash
om daemon orchestration logs 934a42f9-b7eb-4d7e-a3ac-18347522f9f9
om daemon session logs e9440381-9507-42b3-bef3-2c815aceb169
om daemon exec logs d29abc32-2c0b-45ff-b639-508d5c19fbee
```

The three ids nest, and so do the three commands. An exec is one run of one
command, on one node, for one object. The session it belongs to has the
entries of its siblings too. The orchestration above that has every node's:

```bash
$ om daemon orchestration logs fcd85a86-152a-4065-953d-eb5a681c929c
… dev2n1: daemon: imon: vol/testdrbd: change global expect none -> resized
… dev2n3: daemon: imon: vol/testdrbd: change global expect none -> resized
… dev2n2: daemon: imon: vol/testdrbd: change global expect none -> resized
… dev2n1: daemon: imon: vol/testdrbd: -> exec [om vol/testdrbd instance resize --stage 0]
…
```

**Every node is asked**, because what an id names is not confined to one. A
session reaches the nodes of the objects it named, an orchestration reaches
every node of the object, and an exec runs on one node that the id does not
tell you. Narrowing to a node you have to name yourself is how following an
action across a cluster is got wrong.

These are the node logs with the filter already written. The ids are log
fields, so the long form works too and is what the short form does:

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om node logs --filter ORCHESTRATION_ID=934a42f9-… --node '*'
```

</div>
<div class="tab" data-title="API">

```bash
curl -sN -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'filter=ORCHESTRATION_ID=934a42f9-…' \
  "https://<node>:1215/api/node/name/<node>/log"
```

</div>
</div>

The options of the node logs are all still there, and narrow within the id
rather than beside it:

```bash
om daemon exec logs d29abc32-… --grep 'exit code'
om daemon orchestration logs 934a42f9-… --follow
om daemon session logs e9440381-… --lines 200
```

An exec that logged nothing answers nothing. A resize stage with no work to do
runs, succeeds and says nothing, and the empty answer is that, not a failure:
the listing is where you learn whether it ran.

## When the daemon has forgotten

What the daemon remembers is bounded, by age and by count, so a node that has
been running for months does not carry every command it ever ran. An
identifier it no longer holds says so:

```bash
$ om daemon exec list ff0c2d2e-e6a5-47ef-800b-304610179fc6
Error: exec ff0c2d2e-… is no longer known on dev2n1: it ended long enough ago
to have been dropped, or never ran there
```

That is deliberately not the same answer as an exec that is still running, and
not the same as one that never existed. A client polling for the end of an
action must be able to tell "not finished" from "I no longer know", which is
why forgetting is admitted rather than reported as absence.

What is running is never forgotten for the count. Only what has ended is
dropped.

> ➡️ See Also
> * [Action](apps.operate.action.md)
> * [Session, Execution and Orchestration Ids](internals.ids.md)
> * [Events](internals.daemon.events.md)
