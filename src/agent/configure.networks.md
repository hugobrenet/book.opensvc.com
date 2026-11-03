<!-- llms: Cluster networks: their types, bridge, routed bridge and masquerading, how they are declared and applied, how addresses are allocated, and their use in objects. -->
# Cluster Networks

A cluster network gives objects private addresses that om hands out, tracks,
and publishes in the cluster DNS. An object names a network, and gets an
address, a device, a netmask and a gateway from it, with nothing to install
and no external store to run: the addresses are allocated by the agent itself.

The resource that takes an address from a network is `ip.netns`. It plumbs the
address into the network namespace of a container of the object.

## Network types

| Type | Scope | Use |
| :--- | :--- | :--- |
| `bridge` | one node | addresses reachable from the node and its containers only |
| `routed_bridge` | the cluster | addresses routed from node to node, each node drawing from a subnet of its own |
| `lo` | one node | the loopback, which om allocates nothing in |

A network named `default`, of the `bridge` type on `10.22.0.0/16`, exists on
every node of a fresh installation, so an object can take an address before any
network is declared.

## Declaring networks

Networks are sections of the cluster configuration, or of the node
configuration for a network that exists on one node only.

### Bridge

A bridge network is node local: its addresses are not routed between nodes, so
every node draws from the whole subnet, and the same address on two nodes never
meets.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om cluster config update --set network#local1.type=bridge \
                         --set network#local1.network=10.10.10.0/24
```

</div>
<div class="tab" data-title="API">

```
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/cluster/config?set=network%23local1.type%3Dbridge&set=network%23local1.network%3D10.10.10.0%2F24"
```

</div>
</div>

Use `om node config update` instead to declare it on the current node only.

### Routed bridge

A routed bridge spans the cluster. Its subnet is split into one segment per
node, each node allocating in its own segment, and om routes each segment to
its node, through a tunnel when the peer is not on the same subnet:

<div class="tabs">
<div class="tab" data-title="CLI">

```
om cluster config update --set network#backend1.type=routed_bridge \
                         --set network#backend1.network=10.11.0.0/16 \
                         --set network#backend1.mask_per_node=22
```

</div>
<div class="tab" data-title="API">

```
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/cluster/config?set=network%23backend1.type%3Drouted_bridge&set=network%23backend1.network%3D10.11.0.0%2F16&set=network%23backend1.mask_per_node%3D22"
```

</div>
</div>

`mask_per_node` is the prefix length of the segment each node gets. Here every
node gets a `/22`, 1024 addresses, and the segments are assigned in the order
of `cluster.nodes`, recorded as `subnet@<node>`:

* node 1: `10.11.0.0/22`
* node 2: `10.11.4.0/22`
* node 3: `10.11.8.0/22`

`ips_per_node`, the former way to size the segments, is still read, but
`mask_per_node` wins when both are set: a count of addresses is unwieldy for an
ipv6 network.

The tunnel endpoints are the addresses the nodenames resolve to. Name others
when the nodes reach each other on another network:

```
om cluster config update --set network#backend1.addr@node1=192.168.1.1 \
                         --set network#backend1.addr@node2=192.168.1.2
```

Some hosting providers route traffic between servers even on a common subnet.
Force the tunnels there:

```
om cluster config update --set network#backend1.tunnel=always
```

The tunnel mode is `ipip` for an ipv4 network and `ip6ip6` for an ipv6 one.
`gre`, set with `tunnel_mode`, carries both, and works where some providers
refuse `ipip`.

What a node reaches its peers by, the addresses of both ends and the tunnel,
is what a [template](apps.design.datastores.md#templates) reads with the
`network`, `networks` and `tunnels` functions. A program configured from it, as
the strongSwan of the [strongSwan Mesh](../howtos/strongswan.mesh.md) howto
encrypting the tunnels, follows the peers with a task running on
`NetworkPeersUpdated`.

### Masquerading

Traffic leaving a `bridge` or `routed_bridge` network is masqueraded behind the
node address. Set `public=true` on a network whose addresses are routable as
they are, to leave them unmasqueraded.

### Applying a network

`om network setup` creates the bridges, routes, tunnels and nftables rules of
the networks on the node it runs on. The daemon runs it on start and on every
cluster configuration change, so a network declared on a running cluster is set
up on every node without asking. It has no api counterpart: it acts on the
node it runs on.

A setup that changed the peers of a network, a node joining or leaving it, the
address of a node or the tunnel to it, publishes a `NetworkPeersUpdated` event
on the node, which a task can [run on](internals.daemon.scheduler.md#event-triggered-runs).

## How addresses are allocated

Each node allocates for itself, which is what makes the allocation safe without
a lock held across the cluster: a `routed_bridge` node draws from its own
segment only, and a `bridge` address never leaves its node.

* **An address belongs to a resource.** The reservation is named after the
  object and the resource id, so an object holding several `ip.netns`
  resources in one network gets an address for each.
* **The same resource gets the same address.** The search for a free address
  starts from a point derived from the object and the resource id, so a
  resource that stops and starts again gets its address back as long as nobody
  took it meanwhile, and its DNS name keeps pointing to the same place.
* **A stop releases the address**, and so does a start that fails and rolls
  back, so an object that is down holds no address.
* **The reservations are files** under `<var>/ipam/<network>/`, one per
  address, holding the object path and the resource id that took it.

The netmask of the resource is the one of the node's range, and its gateway is
the first address of that range, which the node sets on the bridge.

An earlier agent left the allocation of these networks to the `host-local` CNI
plugin, which allocates the first free address, so an address moved as the
neighbours of an object came and went. The first network setup of an upgraded
node adopts the addresses the running resources hold, so no address is handed
out twice during the transition.

## Using a network in an object

A container of the object, usually a pause container holding the network
namespace, and an `ip.netns` resource naming the network:

```ini
[container#0]
type = podman
image = ghcr.io/opensvc/pause
rm = true

[ip#0]
type = netns
netns = container#0
network = backend1
```

Naming the network is enough. The resource takes from it:

* `name`, the address, allocated as described above when left empty.
* `dev`, the bridge of the network, `obr_<network>` unless the network names
  another with its `dev` keyword.
* `netmask` and `gateway`, from the node's range.

Any of them set in the object configuration wins over the network.

The other containers of the object join the namespace of the pause container
with `netns = container#0`, and reach each other over `127.0.0.1`.

`ip.netns` also plugs an address in modes other than a bridge: `macvlan`,
`ipvlan-l2`, `ipvlan-l3`, `ipvlan-l3s`, `ovs` and `dedicated`, set with
`mode`. See the [`mode`
keyword](../agent.reference.keywords/svc/ip.netns.md#keyword-mode) for what
each one lets the host and the containers reach.

A `disk.drbd` resource sends its replication traffic over a network with its
`network` keyword. The address of each node is then the first of the segment
the node was assigned, so the network is a `routed_bridge`: a network giving
the nodes no segment of their own, as a `lan`, is refused. Name the addresses
with `addr@<node>` on the resource there.

### Names

The address is published in the cluster DNS under the name of the object:

```
$ getent hosts web.test.svc.mycluster
10.11.0.78      web.test.svc.mycluster
```

A second address of the same object is told apart with `dns_name_suffix`,
which is appended to the published name.

`expose` publishes SRV records for the services the address serves, for
example `expose = 443/tcp` publishes `_443._tcp.web.test.svc.mycluster`.

### Namespace claims

A namespace can be capped on the addresses it takes from a network, with a
`claim` section of its configuration. An allocation taking the namespace over
its limit is refused, while an address a resource already holds is never
re-claimed, so an object at the limit still restarts. See [network
claims](apps.design.namespaces.md#network-claims).

## Inspecting networks

The networks, and how full they are:

<div class="tabs">
<div class="tab" data-title="CLI">

```
$ om network ls
NAME      TYPE           NETWORK        SIZE  USED  FREE
backend1  routed_bridge  10.11.0.0/16   64ki  3     64ki
lo        lo             127.0.0.1/32   1     0     1
default   bridge         10.22.0.0/16   64ki  0     64ki
```

</div>
<div class="tab" data-title="API">

```
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/network"
```

</div>
</div>

The addresses allocated, with the object and resource holding each, here in
one network:

<div class="tabs">
<div class="tab" data-title="CLI">

```
$ om network ip ls --name backend1
OBJECT         NODE   RID   IP          NET_NAME  NET_TYPE
test/svc/web   node1  ip#0  10.11.0.78  backend1  routed_bridge
test/svc/db    node2  ip#0  10.11.4.12  backend1  routed_bridge
```

</div>
<div class="tab" data-title="API">

```
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/network/ip?name=backend1"
```

</div>
</div>

## CNI

The `ip.cni` driver plugs an address through CNI plugins instead. It is the one
to use for a network defined by a third-party CNI plugin, or to publish a port
of the address on the node addresses: an `expose` entry with a host port, as
`80:8001/tcp`, is configured by the `portmap` plugin.

`ip.cni` needs the CNI plugins installed, where the `cni.plugins` and
`cni.config` keywords of the node configuration say. Plugged into an om
network, `bridge` or `routed_bridge`, it draws its address from the allocation
described above, like `ip.netns`. Plugged into a network om does not define,
the address is the plugin's to allocate.

> ➡️ See Also
> * [`ip.netns` keywords](../agent.reference.keywords/svc/ip.netns.md)
> * [`ip.cni` keywords](../agent.reference.keywords/svc/ip.cni.md)
> * [`network.routed_bridge` keywords](../agent.reference.keywords/cluster/network.routed_bridge.md)
> * [Namespaces](apps.design.namespaces.md)
