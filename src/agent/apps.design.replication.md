<!-- llms: Data replication of a failover service on local disks: choosing the peers, reading the status of a sync, the recovery point objective, and ZFS replication. -->
# Data Replication

A failover service whose data lives on local disks needs a copy of that data on
the nodes it may fail over to. The `sync` resources make that copy. They send
the data from the node running the service to its peers, on a schedule.

The two drivers most setups use:

| Driver | Copies | Unit of transfer |
| :--- | :--- | :--- |
| `sync.rsync` | a directory tree | the files that changed |
| `sync.zfs` | a zfs dataset, and its children when `recursive` is set | the blocks changed since the last snapshot the peer received |

## Choosing the peers

The `target` keyword names the peers a resource replicates to: `nodes`, the
other nodes of the service, `drpnodes`, its disaster recovery nodes, or both.

```ini
[sync#1]
type = zfs
src = tank/{fqdn}
dst = tank/{fqdn}
target = nodes drpnodes
schedule = @60m
```

`schedule` runs an update every hour here. An update run by hand, or a full
copy, can be narrowed to some of those peers with `--target`. It takes `nodes`,
`drpnodes`, `local`, or a node selector expression such as a node name, a glob
like `n*`, or a label like `site=paris`. Only the peers the resource's `target`
keyword reaches are selected: a `--target` that selects none of them is refused.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om test/svc/db instance update --rid sync#1 --target drpnodes
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/instance/path/test/svc/db/action/update?rid=sync%231&target=drpnodes"
```

</div>
</div>

A sync runs on the node the service runs on, which is the node the api request
names. That node is told by the reference resources of the service, the ones
it holds its data on or is reached by: every resource but the app, sync and
task ones. They must be up there, and a sync asked on a node where they are not
is refused, as it would overwrite the running copy with a stale one. A service
with no reference resource, only apps and syncs, gives no way to tell, and is
not synced: give it one, a `fs.flag` if nothing else fits. `--force` sends from
a node whose reference resources are warn.

## Stopping or switching while a sync runs

Stopped under a sync, a service would hand its peers a copy the sync was
writing. A stop or a switch waits for the syncs running on the instance to end,
in the `wait syncs` state:

    09:37:17 n1 wait syncs/up run=sync#2 | n2 stopped/down
    09:37:36 n1 idle/down               | n2 starting/down
    09:37:39 n1 idle/down               | n2 idle/up

It waits `wait_syncs_timeout` at most, 10 minutes by default, set to what the
largest syncs of the service take. Past it, the stop fails, and the service
keeps running where it was, its monitoring on:

    syncs sync#2 still running after 10m0s: the instance is not stopped

To stop or switch without waiting, ask to end the syncs instead. The rsync and
ssh processes they started end with them, and a zfs copy the peer was receiving
is discarded whole:

<div class="tabs">
<div class="tab" data-title="CLI">

```
om test/svc/db switch --to n2 --interrupt-syncs
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"destination": ["n2"], "live": false, "interrupt_syncs": true}' \
  "https://<node>:1215/api/object/path/test/svc/db/action/switch"
```

</div>
</div>

`om test/svc/db stop --interrupt-syncs` stops the same way, `?interrupt_syncs=true`
on the api.

A stop run on the node, `om test/svc/db instance stop`, waits the same way for
the syncs holding the object lock, and says so:

    wait for the update of the syncs (pid 340343, running for 3s) to end, 10m0s at most: --interrupt-syncs ends them instead

No scheduled sync starts while a stop, a switch or another orchestration is in
progress: the next period syncs, from wherever the service runs then.

A drain does not wait: the shutdown of the instances of a drained node ends the
syncs running first, the rsync and ssh processes they started included, so
none keeps sending to the peer taking over. No scheduled sync starts on a node
being drained.

## Holding the updates

`update_requires` holds the updates and the full copies of a resource until
other resources are in the states it names. A snapshot of a dataset, for one,
is taken only while the filesystem on it is mounted:

```ini
[fs#2]
type = zfs
dev = tank/{fqdn}
mnt = /srv/{fqdn}

[sync#3]
type = zfssnap
dataset = tank/{fqdn}
name = hourly
keep = 3
schedule = @60m
update_requires = fs#2(up)
```

The scheduler does not schedule the update while the requirement is not met,
and schedules it again once it is. An update asked by hand is refused, and says
why:

    ERR test/svc/zfs30: sync#3: sync requires: the resource action requirements are not met: action update on resource sync#3 requires fs#2 in states (up), but is down

A condition is `<rid>(<state>,...)`, and states left out mean `up,stdby up`.
The v2 names `sync_update_requires`, `sync_nodes_requires` and
`sync_drp_requires` are read as `update_requires`.

## Reading the status

A sync resource reports whether the copy is fresh. On the node running the
service, it is up when every peer was synced recently. On a peer, it is up when
that peer received a copy recently. "Recently" is `max_delay` when set.
Otherwise the copy is stale once the sync the `schedule` makes due after the
last one is late by half a schedule period: 45 seconds after the last sync for
`@30s`, 36 hours for a daily sync. Past it, the resource is warn.

A sync resource tells whether the data is replicated, not whether the service
runs, so it does not count in the availability of the instance. In its overall
status, a sync up counts as nothing. A sync warn, or down as the drivers of
array replication may report, counts as a warning:

| Instance | Other resources | `sync#1` | avail | overall |
| :--- | :--- | :--- | :--- | :--- |
| running | up | up | up | up |
| running, a peer's copy stale | up | warn | up | warn |
| standing by, receiving the copy | down | up | down | down |
| standing by, its copy stale | down | warn | down | warn |

So the node standing by for a service reads down, as it should, and only a
stale copy raises a warning.

A copy goes stale with no event to tell, so each resource says when its status
will change, and the daemon evaluates the status again then. A copy found stale
turns fresh again when the next sync lands: the source writes the peer's last
sync record, and the peer evaluates its status on it. The warnings come and go
within seconds of the copies, not at the next scheduled status evaluation.

### The recovery point objective

The `max_delay` of a sync resource, explicit or derived from its schedule, is
its recovery point objective: past it, the node standing by holds data older
than the resource allows to lose. Each resource keeps its own. The logs of a
database may be replicated with a 2 hours delay, and its redo logs with a 10
minutes delay, in the same service.

A node standing by breaches the recovery point objective as soon as one of its
copies is older than its resource allows: were it to take over then, it would
lose more data than that resource's contract. Each instance publishes when that
happens, `rpo_breached_at`, the earliest time among its sync resources, and
each resource publishes its own. The node the data is replicated from publishes
none: its data is current.

`om mon` marks with a red `L` the instances past that time:

     test/svc/db   up!  ha  1/1 | O!^   X    X!L

and the status tree tags them, the warning of the resource naming the contract
breached:

    ├ n3                down  warn rpo-breached idle
    │ warn: n3 last sync is too old, at 2026-09-29 09:17:54 +0200 CEST, more than 45s ago (schedule @30s, half a period after the sync due)

The time is compared to the clock when the status is read, so the mark is right
whenever the instance status was last evaluated. Choosing a node to fail over
to, prefer one with no mark.

## ZFS replication

### Each peer has its own base

Each update takes a snapshot of the source, named after the resource and the
time it was taken, to the microsecond, as `sync.1.20260928T154211.315216Z` for
`sync#1`. It then sends each peer the changes between that snapshot and the newest snapshot the peer
already holds, its base. The snapshots are matched by their guid, so a peer's
base is found whatever either side calls it, after a failover too.

Once a peer has received the new snapshot, its older ones are destroyed. The
source keeps the newest snapshot, and the base of any peer that fell behind:

    dev2n1: sync.1.20260928T154154.161026Z sync.1.20260928T154203.972669Z
    dev2n2: sync.1.20260928T154203.972669Z
    dev2n3: sync.1.20260928T154154.161026Z

Here `dev2n3` missed the last update. The update failed, and said why:

    ERR test/svc/zfssync: sync#1: dev2n3: list snapshots: dial tcp 10.29.0.13:22: connect: connection refused

The next update sends `dev2n3` everything it missed, from the base it holds,
and the three nodes are in step again:

    INF test/svc/zfssync: sync#1: /usr/sbin/zfs send -R -I tank/zfssynctest@sync.1.20260928T154154.161026Z tank/zfssynctest@sync.1.20260928T154211.315216Z | ssh dev2n3 '/usr/sbin/zfs receive -dF tank'

A short outage heals by itself, and a peer out of reach does not hold up the
others.

A peer that holds no snapshot of the resource, a new node or one whose dataset
was destroyed, is sent a full copy automatically.

### Limits on a lagging peer

The base the source keeps for a lagging peer holds on to the blocks changed
since. The longer the outage, the more space it holds, and a pool that fills up
takes the running service down with it. Two keywords bound what a lagging peer
may cost:

| Keyword | Default | Bounds |
| :--- | :--- | :--- |
| `max_lag_age` | `24h` | how long a peer may miss updates, counted from the first one it missed |
| `max_lag_size` | `20%` | the space the snapshots kept for it may hold on the source: a size, or a percentage of the space the pool would have free without them |

Past either limit, the source destroys the peer's base and stops sending to
it. The update says so:

    ERR test/svc/zfssync: sync#1: dev2n3: stranded: lagging for 1m6s, more than max_lag_age 1m0s: run 'om test/svc/zfssync instance full --rid sync#1 --target dev2n3'

The status warns until the peer is synced again:

    └ dev2n1                          n/a   warn idle
      └ resources
        └ sync#1            ...../..  warn  zfs tank/zfssynctest to nodes
                                            warn: dev2n3: not synced since 2026-09-28T17:43:26+02:00: lagging for 1m6s, more than max_lag_age 1m0s: run 'om test/svc/zfssync instance full --rid sync#1 --target dev2n3'

The same happens to a peer that holds snapshots of the resource, none of them
in common with the source, as after both sides ran the service during a split.

### Syncing a peer again

A peer with no base left needs a full copy. The full copy replaces the peer's
dataset, whatever it holds, so the agent does not decide it alone. Once the
peer is back and holds nothing worth keeping, run on the node running the
service the command the warning gives:

<div class="tabs">
<div class="tab" data-title="CLI">

```
om test/svc/zfssync instance full --rid sync#1 --target dev2n3
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/instance/path/test/svc/zfssync/action/full?rid=sync%231&target=dev2n3"
```

</div>
</div>

The peer receives the whole dataset as of a new snapshot, which becomes its
base, and the next updates are incremental again. The other peers are not
touched.

### Upgrading from an older agent

Older agents kept two snapshots per resource, `<rid>.sent` and
`<rid>.tosend`, shared by all the peers. The first update after the upgrade
uses them as the base of the peers holding them, and they are destroyed once
no peer needs them. A peer out of reach during that update keeps them as its
base, and is not sent a full copy when it comes back.
