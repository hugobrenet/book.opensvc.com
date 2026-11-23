# Driver `network.l2_bridge`

**Minimal configlet:**

	[network#1]
	type = l2_bridge

**Minimal setup command:**

	om test/ccfg/foo set --kw="type=l2_bridge"

**Supported keywords:**

- ageing_time
- comment
- dev
- hairpin
- mac
- mask_per_node
- mcast_snooping
- mtu
- ports
- stp
- type
- vlan
- vxlan_addr
- vxlan_port
- vxlan_vni

## Keyword `ageing_time`

	required:    false
	scopable:    false
	group:       interface
	convert:     duration
	rbac:        This driver group requires the root grant.

**Example:**

	ageing_time=5m

**Description:**

How long the bridge remembers the port an address was last seen on.


## Keyword `comment`

	required:    false
	scopable:    false
	group:       identity
	rbac:        This driver group requires the root grant.

**Description:**

A free form text describing the role of the object, of the node, or of the
section it is set in.

The keyword is accepted in any section, so the DEFAULT section can document a
configuration as a whole, and a resource, pool, heartbeat, array or network
section can document itself.

The agent does not interpret the value.


## Keyword `dev`

	required:    false
	scopable:    false
	group:       interface
	rbac:        This driver group requires the root grant.

**Description:**

The network bridge device name. If not set the name will be `obr_<network name>`. Use this keyword if you need the network to use an already existing bridge.


## Keyword `hairpin`

	required:    false
	scopable:    false
	group:       interface
	convert:     bool
	rbac:        This driver group requires the root grant.

**Description:**

Set the hairpin mode of the devices om enslaves to the bridge: a frame
received on one may be sent back out of it, as a switch reflecting the
traffic between the guests of a node needs.


## Keyword `mac`

	required:    false
	scopable:    true
	group:       interface
	rbac:        This driver group requires the root grant.

**Example:**

	mac=02:00:00:00:00:01

**Description:**

The address of the bridge, scoped per node, as `mac@n1 = 02:00:00:00:00:01`:
the bridges of a mesh share a segment, where two with the same address
collide. Not set, a bridge om creates gets one derived from the names of
the network and of the node, so it does not change as the taps of the
guests come and go, and a bridge om adopts keeps its own.


## Keyword `mask_per_node`

	required:    false
	scopable:    false
	group:       addressing
	default:     0
	convert:     int
	rbac:        This driver group requires the root grant.

**Description:**

The prefix length of the subnets distributed to each node.
For example if the network is a x.x.x.x/16 you can distribute
- x.x.x.x/17 subnets to 2 nodes
- x.x.x.x/18 to 4 nodes
- etc...

If both `mask_per_node` and `ips_per_node` are set, `ips_per_node` is ignored.
If only `ips_per_node` is set, it is honored for backward compatibility.

The `ips_per_node` keyword is deprecated because its value is hard to manage for large ipv6 subnets (e.g a x.x.x.x/48 subnet has 281474976710656 ips).

## Keyword `mcast_snooping`

	required:    false
	scopable:    false
	group:       interface
	convert:     bool
	rbac:        This driver group requires the root grant.

**Description:**

Snoop the multicast group memberships on the bridge, to send a multicast
frame to the ports with a member only. Not set, the bridge keeps the state
it has, on on a bridge om creates.


## Keyword `mtu`

	required:    false
	scopable:    true
	group:       interface
	convert:     int
	rbac:        This driver group requires the root grant.

**Example:**

	mtu=1450

**Description:**

The mtu of the bridge and of the devices om enslaves to it. Not set, the
mtu of a bridge meshed by a vxlan is the one of the interface sending the
vxlan less the bytes vxlan adds, and the one of another bridge is left as
it is.


## Keyword `ports`

	required:    false
	scopable:    true
	group:       mesh
	convert:     list
	rbac:        This driver group requires the root grant.

**Example:**

	ports=eno2

**Description:**

The devices of the node the bridge enslaves, for the bridges of the nodes
to share the lan they are on: a nic, a bond or a vlan interface, its name
scoped per node where it differs, as `ports@n1 = eno2`. With `vlan`, the
bridge enslaves the vlan interface om creates on each instead.

A device holding an address is refused, as the node's own interface on the
segment would stop answering once enslaved: bridge it in the network
configuration of the node and name that bridge in `dev`. A device enslaved
to another one is refused too. A device missing is enslaved once its link
comes up, and a device no longer listed is released.


## Keyword `stp`

	required:    false
	scopable:    false
	group:       interface
	convert:     bool
	rbac:        This driver group requires the root grant.

**Description:**

Run the spanning tree protocol on the bridge. Not set, the bridge keeps the
state it has, off on a bridge om creates.


## Keyword `type`

	required:    false
	scopable:    false
	group:       identity
	candidates:  bridge, routed_bridge, lan, l2_bridge
	default:     bridge
	rbac:        This driver group requires the root grant.

**Description:**

The type of network.

* `bridge`: a subnet on a bridge of each node, the same on every node, its
  traffic masqueraded out of the node.
* `routed_bridge`: a subnet cut into one range per node, routed between the
  nodes.
* `lan`: ranges of a segment the nodes share, the addresses of which an
  object takes along when it moves to another node, as the floating address
  of a failover service.
* `l2_bridge`: a bridge on each node with no address, for the guests and
  containers of the node to share a segment om neither addresses nor
  routes. Alone on its node, or meshed with the bridges of the other nodes
  through a lan or vlan they share (`ports`), or a vxlan (`vxlan_vni`).

The traffic the nodes forward for the `bridge`, `routed_bridge` and `l2_bridge` networks
is accepted in the om nft table, and, on a node running docker, whose
forward chain drops what docker did not accept, in a chain the docker
`DOCKER-USER` chain jumps to.


## Keyword `vlan`

	required:    false
	scopable:    true
	group:       mesh
	convert:     int
	rbac:        This driver group requires the root grant.

**Example:**

	vlan=100

**Description:**

The vlan om creates on each of the `ports`, as the interface `eno2.100`, to
enslave instead of the port: the bridges of the nodes share that vlan, and
the network configuration of the nodes needs no change. The interfaces om
created are deleted once no longer listed.


## Keyword `vxlan_addr`

	required:    false
	scopable:    true
	group:       mesh
	rbac:        This driver group requires the root grant.

**Example:**

	vxlan_addr=10.0.0.1

**Description:**

The address of the node the vxlan sends from and receives on, or a name
resolving to it, scoped per node, as `vxlan_addr@n1 = 10.0.0.1`. Not set,
the address the name of the node resolves to.


## Keyword `vxlan_port`

	required:    false
	scopable:    false
	group:       mesh
	default:     4789
	convert:     int
	rbac:        This driver group requires the root grant.

**Description:**

The udp port of the vxlan, the same on every node.


## Keyword `vxlan_vni`

	required:    false
	scopable:    false
	group:       mesh
	convert:     int
	rbac:        This driver group requires the root grant.

**Example:**

	vxlan_vni=1001

**Description:**

The vxlan network identifier, from 1 to 16777215, meshing the bridges of
the nodes through a vxlan when they share no lan: each node enslaves a
vxlan device sending to every other node, which needs no multicast of the
network between them. The same on every node, and different from the one
of any other vxlan between them.

The vxlan adds 50 bytes to a frame over ipv4, 70 over ipv6: the mtu of the
bridge is the one of the interface sending the vxlan less those, unless
`mtu` sets it, and the guests are to use it. The vxlan of any host other
than the nodes is dropped, as vxlan is neither authenticated nor
encrypted.


