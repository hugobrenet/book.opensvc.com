<!-- llms: Cluster quorum: enabling it, how nodes and arbitrators vote on a split-brain, configuring and testing arbitrators, and best practices. -->
# Cluster Quorum

When a peer is flagged as stale by all heartbeats, the daemon assumes the cluster is in a split-brain situation, as it cannot determine whether the stale peer has failed or is isolated.

OpenSVC minimizes the likelihood of a split-brain scenario by leveraging multiple independent heartbeats.

## Enabling Quorum Enforcement

> The **API** tabs assume the `$TOKEN` and the listener endpoint set up in
> [Cluster API](configure.api.md). `cluster.quorum` is a cluster keyword, so
> it is written on any node with `PATCH /api/cluster/config`, which takes the
> same `set` and `unset` operations as `om cluster config update`.

Users who prefer to have a cluster segment shut down in such situations can enable quorum by setting `cluster.quorum` to `true`:

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om cluster config update --set cluster.quorum=true
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'set=cluster.quorum=true' \
  "https://<node>:1215/api/cluster/config"
```

</div>
</div>

By default, the system allows split nodes to take over services, which may result in services running on multiple isolated segments. To revert to the default behavior, use:

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om cluster config update --unset cluster.quorum
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'unset=cluster.quorum' \
  "https://<node>:1215/api/cluster/config"
```

</div>
</div>

To check the current quorum configuration:

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om cluster config get --kw cluster.quorum
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/cluster/config?kw=cluster.quorum"
```

</div>
</div>

## Quorum Behavior

If the cluster is configured for quorum and a split-brain situation occurs, a node will shut down if the number of reachable nodes (including itself) plus arbitrators is less than half of the total cluster and arbitrator nodes.

Frozen nodes do no evaluate quorum. They will not shut down on split-brain.

Frozen nodes still vote for peer nodes quorum evaluation.

### Example Arbitrator Requirements

To survive an interconnect outage:

- In a 2-node cluster, a single node requires 1 arbitrator vote to survive the split.
- In a 3-node cluster, a single node requires 2 arbitrator votes.
- In a 4-node cluster, a single node requires 3 arbitrator votes.
- In a 5-node cluster, a single node requires 3 arbitrator votes.

To survive an interconnect outage, plus all peers outage in the same availability zone:

- In a 2-node cluster, a single node requires 1 arbitrator vote to survive the split.
- In a 3-node cluster, a single node requires 2 arbitrator votes.
- In a 4-node cluster, a single node requires 3 arbitrator votes.
- In a 5-node cluster, a single node requires 4 arbitrator votes.

## Configuring Arbitrators

Any OpenSVC agent can act as an arbitrator, and multiple arbitrators can be configured. For example, to configure an arbitrator:

### Use an https server as an arbitrator

    [arbitrator#a1]
    uri = https://dev2n1:1215/metrics
    #insecure = true

### Use a tcp server as an arbitrator

    [arbitrator#a2]
    # 22, the ssh port of dev2n2: with no port, listener.port is implied
    uri = dev2n2:22

The vote of a tcp arbitrator is a TCP connect to its uri. The port of the
uri is optional: with none, the port of the cluster listener is implied,
`listener.port`, 1215 by default. An arbitrator still listening on the 1214
port of a v2 agent must name it in the uri.

## Testing Arbitrators

Every node votes on its own, so an arbitrator is alive from the point of view
of a node, not of the cluster. The monitor shows that grid:

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om mon
```

    ...
    Arbitrators                       n1   n2
     a1                warn         | X    X          
     a2                warn         | X    X          
     a3                             | O    O          
    ...

</div>
<div class="tab" data-title="API">

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/cluster/status" |
  jq '.cluster.node | map_values(.status.arbitrators)'
```

Each node status carries an `arbitrators` object, keyed by arbitrator name,
which is what the grid renders one column per node.

</div>
</div>

## Best Practices

* Configure `<number of nodes>` minus 1 arbitrators
* Host all arbitrators on the same 3rd site
* Use one of the arbitrators as a relay for the relay heartbeat driver
* Disable quorum or freeze all nodes when doing a relayout of the cluster

> ➡️ See Also
> * [Example 1: Odd-nodes cluster](internals.daemon.quorum.example1.md)
> * [Example 2: Even-nodes cluster](internals.daemon.quorum.example2.md)

