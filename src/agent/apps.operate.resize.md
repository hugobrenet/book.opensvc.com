<!-- llms: How to grow a volume through the chain of resources it rests on: the commands, the plan, the stages, the limits of a namespace and what is refused. -->
# Grow a Volume

A volume rests on a chain of resources: a filesystem on a replicated device on
a logical volume, a mirror over two volumes from another pool. Growing the
volume means growing every link of that chain, from the bottom up, and a
resize is the one command that does it.

A resize only grows. There is no shrink.

> The **API** tabs assume the `$TOKEN` and the listener endpoint set up in
> [Cluster API](configure.api.md). `POST …/action/resize` takes the size in
> its body and answers the `orchestration_id` of the queued orchestration.
> The per-node commands below have no api counterpart: they drive the local
> instance, which is what the orchestration does for you.

## The two commands

| command | acts on | ask it when |
| :--- | :--- | :--- |
| `om <vol> resize SIZE` | every node holding an instance | the normal case |
| `om <vol> instance resize SIZE` | this node | you are driving the nodes yourself |

The first writes `SIZE` into the volume configuration and asks the cluster to
converge to it. The configured size is what every node reads, and what a
listing like `om pool volume ls` reports, so it is the size the volume is
from then on.

`SIZE` is a size to reach, as `11g`, `11GB` or `12Gi`, or an amount to add, as
`+1g`.

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om vol/data resize 20g
om vol/data resize +5g
ox vol/data resize 20g
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"size": "20g"}' \
  "https://<node>:1215/api/object/path/root/vol/data/action/resize"
```

</div>
</div>

## Seeing the plan first

`--dry-run` reports what a resize would do and changes nothing:

```bash
$ om vol/data instance resize 600mi --dry-run
grow, in this order:
  stage 0, on every node:
    disk#1                         disk.zvol               454mi -> 604mi
  stage 1, once every node has finished stage 0:
    disk#2                         disk.drbd               454mi -> 600mi       asks 604mi of the link below
    fs#1                           fs.xfs                  454mi -> 600mi
```

Read it from the bottom of the chain up. Each link is asked what it needs from
the link below it, which is not always what it was asked for: the drbd above
keeps its metadata out of what it hands up, so it asks 604Mi of the zvol to
offer 600Mi to the filesystem. A raid5 over `n` members asks `to/(n-1)` of
each.

Every link is asked before any of them is changed, so a chain holding one link
that cannot do it is refused whole. Finding out that a filesystem cannot grow
after the device under it already has is the failure this avoids.

`-o json` carries the same plan for a client that would rather read fields.

## Stages

A replicated resource offers what its smallest replica holds, so it cannot be
grown before every node has grown what is under it. That splits the work into
stages, and the plan names them.

Every node runs stage 0. Once every node has finished it, the node holding the
volume up runs stage 1, which grows the replicated link and whatever rests on
it. A chain with two replicated links has three stages; that is the most.

The instance monitor says which stage a node has reached:

| state | meaning |
| :--- | :--- |
| `resizing` | a stage is running here |
| `resized:0` | this node has finished stage 0, and waits for its peers |
| `resized` | this node has nothing left to grow |
| `resize failed` | a stage failed here |

## Asking again is how a resize is finished

A failed resize is final on the instance it failed on. Nothing is retried, on
purpose: a chain left part way is grown by asking for it again.

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om vol/data resize            # no size: converge to the configured size
```

</div>
<div class="tab" data-title="API">

```bash
# no size: converge to the configured size
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{}' \
  "https://<node>:1215/api/object/path/root/vol/data/action/resize"
```

</div>
</div>

The configured size is the target, and every link that already holds it is
skipped, so asking again costs nothing on the nodes that finished and finishes
the ones that did not.

This is why the configuration holds the size asked for rather than the size
reached. The size a link reached is written back to that link's own `size`
keyword, so what a resource holds and what its keyword says agree; only the
target it was growing towards disagrees, which is what says the work is
unfinished.

## What a namespace may take

Growing is claiming more of the pool, so it is rationed the way an allocation
is. A namespace claiming more than its `claim` allows is refused, and the
refusal says by how much:

```bash
$ om vol/data resize 1g
403 vol/data is served by the drbdz pool, and the root namespace may claim
    130mi of it and already claims 100mi, so it cannot claim 924mi more
```

See [Namespaces](apps.design.namespaces.md) for the claim itself.

## What is refused, and why

**A shrink.** Asking for less than the configured size is refused. Asking for
exactly it is not: that is how an unfinished resize is finished.

**A lone replica.** Growing one replica of a replicated object on its own
strands the space until the others catch up. `--force` does it anyway.

**A raid0 or linear array.** It holds what its members give it, with no size
of its own on each, and grows only by taking another member — a reshape, which
a resize is not. The array says so:

	a raid0 array uses no size of its own on each member, so it cannot be
	grown onto members that grew

**A logical volume sized as a share of its volume group.** `size = 100%FREE`
is resolved by lvm2, once, when the volume is created, and om never learns
what it came out as. A resize would have to write a count of bytes over the
share, answering a question nobody asked. Write the size as a size, or as an
expression om computes, and it can be grown:

	size = $(50% * {disk#vg.capacity})

**An array that is not whole.** A degraded array grows without complaint if
asked, and the space that adds has no redundancy and no member to rebuild it
from. An array rebuilding, resyncing or reshaping is busy with the space it
already has. Both are refused until the array is clean.

## A volume that holds less than it is configured to

The instance status warns when a resource holds less than its configured size,
which is what a resize that stopped part way looks like:

```
warn: holds 366907392 bytes of the 367001600 bytes it is configured to hold,
      so a resize has not finished
```

Asking for the resize again is the answer. When the difference is one no
resize can make up, the warning says that instead, and why:

```
warn: holds 96mi of the 100mi it is configured to hold, and cannot grow to it:
      a raid0 array uses no size of its own on each member …
```

That second one is a configuration asking for a size its layout can never
hold, and it is the layout or the configured size that has to change.

## Growing one resource

The resource commands grow one link and everything under it, rather than the
volume's own head:

```bash
om <path> fs resize 20g --rid fs#1
om <path> disk resize 20g --rid disk#1
om <path> volume resize 20g --rid volume#1
```

These act on the local instance. They are for a chain the volume head does not
lead to, and for repairing one link of a chain by hand.

> ➡️ See Also
> * [Cluster Storage](configure.pool.md)
> * [Namespaces](apps.design.namespaces.md)
> * [Follow an Action](apps.operate.sessions.md)
