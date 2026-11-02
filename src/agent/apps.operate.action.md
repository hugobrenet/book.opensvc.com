<!-- llms: The actions on an object: start, stop, relocation, failure handling, data replication, run, resource filtering and logging, from the CLI and the API. -->
# Action

Every action below is available both from the command line and through the
cluster api. Pick the tab you want: the choice sticks for the whole book.

> The **API** tabs assume the `$TOKEN` and the listener endpoint set up in
> [Cluster API](configure.api.md). An object is addressed by the three
> segments of its path, so `svc1` is `/api/object/path/root/svc/svc1`, and
> `ns1/svc/svc1` is `/api/object/path/ns1/svc/svc1`.

## Base Actions

### Start

**Local Start (Bypasses Orchestrator)**

Start the service instance on the local node directly.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> instance start
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/instance/path/<ns>/<kind>/<name>/action/start"
```

</div>
</div>

> **Resource Start Order:** `ip`, `disk`, `fs`, `share`, `container`, `app`.

The api answers a `session_id` and an `exec_id` naming the run this node
forked. `GET /api/node/name/<node>/daemon/exec/id/<exec_id>?wait=5m` holds
until that run ends, which is the counterpart of the cli waiting for the
command to return.

**Orchestrated Start**

Instruct the orchestrator to start the service on the node(s) selected by the placement policy.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> start [--wait] [--time <duration expr>] [--watch]
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/object/path/<ns>/<kind>/<name>/action/start"
```

</div>
</div>

  * By default, the command returns upon daemon acknowledgment.
  * `--wait` holds the command until the action completes.
  * `--time` sets a maximum wait duration.

The api answers the `orchestration_id` of the queued orchestration. Waiting
for its end is a separate call, which any node of the cluster answers, even
one carrying no instance of the object:

```
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/daemon/orchestration/id/<orchestration_id>?wait=5m"
```

The call answers 200 with the orchestration state, 408 if it is still running
when `wait` expires, and 410 if the id is no longer known.

> **Frozen instances are started, and stay frozen.** Freezing tells the daemon
> not to act by itself. It does not make an object refuse a start you asked
> for, so a frozen instance is started and its freeze is left as you set it.
> The daemon still never starts a frozen instance on its own, and still passes
> over frozen nodes when choosing where to start.
>
> A stop does not freeze. It flags every instance of the object stopped on
> purpose, and the start you ask for clears that flag, so a stop followed by a
> start leaves the object up and under orchestration, with whatever freeze you
> set yourself still exactly where you set it.
>
> Earlier versions, and OpenSVC v2, unfroze the object as part of starting it,
> and froze it as part of stopping it.

### Stop

**Local Stop (Bypasses Orchestrator)**

Stop the service instance on the local node directly.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> instance stop
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/instance/path/<ns>/<kind>/<name>/action/stop"
```

</div>
</div>

> **Resource Stop Order:** `app`, `container`, `share`, `fs`, `disk`, `ip`.

**Orchestrated Stop**

Instruct the orchestrator to stop the service wherever it runs, and to leave it
down.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> stop [--wait] [--time <duration expr>] [--watch]
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/object/path/<ns>/<kind>/<name>/action/stop"
```

</div>
</div>

> The stop flags every instance of the object stopped on purpose, which is what
> keeps the daemon from starting it back: without the flag the next ha decision
> would undo the stop. `om <path> print status` shows the flag as `stopped`,
> and `om mon` as a `=` next to the instance.
>
> The flag is cleared by a start, a restart or a switch you ask for, on every
> instance of the object, and by the instance being seen up again. It survives
> a daemon restart and a reboot, so a node coming back up does not start what
> you asked to be down.
>
> Earlier versions froze the instances to get the same result, which said more
> than it meant: you could no longer tell your own freeze from one a stop had
> left behind, and the object went on running without failover once started
> again.

### Relocation

**Switch**

Stop the service on its current node(s) and start it on the specified target node. The freeze you set on an instance is left as you set it: a switch is a request to place the object, not to thaw it.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> switch --node <nodename> [--wait] [--time <duration expr>] [--watch] [--live]
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"destination": ["<nodename>"], "live": false}' \
  "https://<node>:1215/api/object/path/<ns>/<kind>/<name>/action/switch"
```

</div>
</div>

> The `container.kvm` supports live migration. The VM storage is either read-write from all nodes during the switch, as SAN disks, drbd pass-through, NFS, Ceph or ClusterFS, or held by `fs.zfs` and `disk.zvol` resources, whose datasets the switch copies to the destination and whose disks the migration mirrors there: see [KVM Live Migration on ZFS](../howtos/kvm.live.migration.zfs.md).

**Takeover**

Stop the service instances on peer nodes and start it on the local node. The freeze you set on an instance is left as you set it.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> takeover [--wait] [--time <duration expr>] [--watch]
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"destination": ["<this node>"], "live": false}' \
  "https://<node>:1215/api/object/path/<ns>/<kind>/<name>/action/switch"
```

</div>
</div>

> A takeover is a switch whose destination is the node you run it from, so the
> api has no separate endpoint for it.

**Giveback**

Stop the service on non-leader nodes, and let the orchestrator start instances on the designated leaders. The freeze you set on a node or an instance is left as you set it, and the daemon still passes over what is frozen when it chooses where to start.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> giveback [--wait] [--time <duration expr>] [--watch]
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/object/path/<ns>/<kind>/<name>/action/giveback"
```

</div>
</div>

### Handling Failures

If an action fails, the orchestrator is blocked, and the failure is reported in `om mon` and `om <path> instance status`.

**Clear Failure**

Allows the daemon to **retry** the execution plan. The failure is held by the
instance monitor of each node, so the api clears it one node at a time, where
the cli command clears it on every node of the object.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> clear
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/instance/path/<ns>/<kind>/<name>/clear"
```

</div>
</div>

**Abort Action**

Aborts the currently blocked orchestrated action.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> abort
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/object/path/<ns>/<kind>/<name>/action/abort"
```

</div>
</div>

### Data Replication

> The disk, fs and sync resources support data replication.

**Replicate All**

Run resource replication to all configured targets (e.g., production (`prd`) or disaster recovery (`drp`)).

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> instance update
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/instance/path/<ns>/<kind>/<name>/action/update"
```

</div>
</div>

> This command can run on a schedule.

**Replicate to peer Nodes**

Run resource replication to secondary cluster nodes. No-op if run from a node not running the service.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> instance update --target nodes
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/instance/path/<ns>/<kind>/<name>/action/update?target=nodes"
```

</div>
</div>

**Replicate to DRP Nodes**

Trigger file synchronization to disaster recovery nodes. No-op if run from a node not running the service.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> instance update --target drp
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/instance/path/<ns>/<kind>/<name>/action/update?target=drp"
```

</div>
</div>

### Run

Execute tasks defined within the service configuration.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> instance run [--rid ...]
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/instance/path/<ns>/<kind>/<name>/action/run?rid=task%231"
```

</div>
</div>

> This command can run on a schedule.

## Resource Filtering

Filter actions to be executed only on specific resources using `--rid`, `--tags`, or `--subsets`.

| Option | Syntax | Description |
| :--- | :--- | :--- |
| **`--rid` (ID List)** | `om <path> --rid <rid>[,<rid>,...] <action>` | Execute action on resources specified by resource IDs. |
| **`--rid` (Group List)** | `om <path> --rid <drvgrp>[,<drvgrp>,...] <action>` | Execute action on resources belonging to specified driver groups (`ip`, `disk`, `fs`, `share`, `container`, `app`, `sync`, `task`). |
| **`--tag` (OR)** | `om <path> --tag tag1,tag2 <action>` | Execute action on resources tagged with **either** `tag1` **or** `tag2`. |
| **`--tag` (AND/OR)** | `om <path> --tag tag1+tag2,tag3 <action>` | Execute action on resources tagged with **both** `tag1` **and** `tag2`, **OR** with `tag3`. |
| **`--subset`** | `om <path> --subset s1,s2 <action>` | Execute action on resources belonging to subset `s1` **or** `s2`. |

The instance action endpoints accept the same filters as the `rid`, `tag` and
`subset` query parameters. The `#` of a resource id has to be percent-encoded
as `%23`.

## Logging

All action logs are multiplexed to multiple destinations:

  * **Stdout/Stderr**
  * **Journald** or **Syslog**
  * **Collector Database** (Optional, via asynchronous XML-RPC calls)


## Examples

### Starting a Service (Local)

Shows the ordered execution of resource start-up.

```
# om svc0 instance start
10:51:50.590 INF svc0: >>> do start [om svc0 instance start] (origin user, sid ae60fdd4-6629-40eb-a993-4f1380d66516)
10:51:52.061 INF svc0: fs#1: install flag file /dev/shm/opensvc/svc/svc0/fs#1.flag
10:51:52.062 INF svc0: app#0: applied pg /opensvc.slice/opensvc-svc.svc0.slice
10:51:52.063 INF svc0: app#0: applied pg /opensvc.slice/opensvc-svc.svc0.slice/opensvc-svc.svc0-app.0.slice
10:51:52.090 INF svc0: app#0: run: /usr/bin/om exec --pg /opensvc.slice/opensvc-svc.svc0.slice/opensvc-svc.svc0-app.0.slice -- touch test -f /tmp/svc0.root.svc.reliable-leopard
10:51:52.194 INF svc0: <<< done start [om svc0 instance start] in 1.603582081s, instance status is now up
```

### Stopping a Service (Local)

Shows the ordered execution of resource shut-down.

```
# om svc0 instance stop
10:51:55.282 INF svc0: >>> do stop [om svc0 instance stop] (origin user, sid 807b55a5-8a5e-4a38-920c-94b6956da6a7)
10:51:55.380 INF svc0: app#0: run: /usr/bin/om exec --pg /opensvc.slice/opensvc-svc.svc0.slice/opensvc-svc.svc0-app.0.slice -- rm -f /tmp/svc0.root.svc.reliable-leopard
10:51:55.461 INF svc0: fs#1: uninstall flag file /dev/shm/opensvc/svc/svc0/fs#1.flag
10:51:55.494 INF svc0: <<< done stop [om svc0 instance stop] in 211.596639ms, instance status is now down
```
