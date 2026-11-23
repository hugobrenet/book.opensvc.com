# Driver `network.routed_bridge`

**Minimal configlet:**

	[network#1]
	type = routed_bridge

**Minimal setup command:**

	om test/ccfg/foo set --kw="type=routed_bridge"

**Supported keywords:**

- addr
- comment
- dev
- dns
- gateway
- ips_per_node
- mask_per_node
- network
- public
- subnet
- tables
- tunnel
- tunnel_mode
- type

## Keyword `addr`

	required:    false
	scopable:    true
	group:       routing
	rbac:        This driver group requires the root grant.

**Default:**

Detect using a name resolution of `<nodename>`.

Beware, if the nodename resolves to `127.0.1.1` or `127.0.0.1` the ipip
tunnel can not work.

**Description:**

The ip address used as local endpoint for the ipip tunnel configured by the
`network setup` command to access the backend subnet of peer nodes not
reachable on the same subnet.


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


## Keyword `dns`

	required:    false
	scopable:    true
	group:       dns
	convert:     list
	rbac:        This driver group requires the root grant.

**Example:**

	dns=2001:db8::53 192.0.2.53

**Description:**

The nameservers reachable from the network, which the containers whose
network namespace holds an address of it, from an ip.netns or an ip.cni, are
given in place of the nameservers of the cluster: a segment the cluster
nameservers are not reachable from, as a public one, needs its own. The `dns`
keyword of a container adds its own nameservers after them.

Unset, the containers are given the nameservers of the cluster. A container
with addresses on several networks naming nameservers is given the ones of
each, in the order of its ip resources.


## Keyword `gateway`

	required:    false
	scopable:    true
	group:       routing
	rbac:        This driver group requires the root grant.

**Description:**

The address the other nodes reach the node specified as scope at, as
`gateway@n2 = 10.0.0.2`: the gateway of their routes to its subnet, and the
remote endpoint of their tunnels to it. An address, or a name resolved in
the address family of the network, out of the network itself.

Not set, the address of the node: its `addr`, else the address its name
resolves to. Set it when the other nodes reach the node at an address other
than the one it sends from, as through a router or a NAT.


## Keyword `ips_per_node`

	required:    false
	scopable:    false
	group:       addressing
	deprecated:  since 3.0.0, replaced by mask_per_node
	default:     1024
	convert:     int
	rbac:        This driver group requires the root grant.

**Description:**

The number of ips each node must be able to allocate in the  network. This number is translated into the prefix length of the subnets distributed to each node.
For example if the network is a x.x.x.x/16 you can distribute
- x.x.x.x/17 subnets to 2 nodes
- x.x.x.x/18 to 4 nodes
- etc...

If both `mask_per_node` and `ips_per_node` are set, `ips_per_node` is ignored.
If only `ips_per_node` is set, it is honored for backward compatibility.

The `ips_per_node` keyword is deprecated because its value is hard to manage for large ipv6 subnets (e.g a x.x.x.x/48 subnet has 281474976710656 ips).

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

## Keyword `network`

	required:    false
	scopable:    false
	group:       addressing
	rbac:        This driver group requires the root grant.

**Description:**

The cluster backend network.

The routed_bridge driver fragments this network into subnets with a prefix length given by`mask_per_nodes`.


## Keyword `public`

	required:    false
	scopable:    false
	group:       routing
	convert:     bool
	rbac:        This driver group requires the root grant.

**Description:**

Set to true if the network ip range is public and we must not configure masquerading rules.


## Keyword `subnet`

	required:    false
	scopable:    true
	group:       addressing
	rbac:        This driver group requires the root grant.

**Description:**

The cidr subnet handled by this node.

This parameter must be scoped for each node.

Usually, the subnets are allocated automatically upon initial network setup,
each node being attributed a subnet based on its index in the cluster.nodes
list.


## Keyword `tables`

	required:    false
	scopable:    false
	group:       routing
	default:     main
	convert:     list
	rbac:        This driver group requires the root grant.

**Example:**

	tables=main custom1 custom2

**Description:**

The list of routing tables to add the backend network routes to.

The list of available tables is in `/etc/iproute2/rt_tables`.


## Keyword `tunnel`

	required:    false
	scopable:    false
	group:       routing
	candidates:  auto, always, never
	default:     auto
	rbac:        This driver group requires the root grant.

**Description:**

Create and route traffic through tunnels to peer nodes policy.

* `auto`

  Tunnel if the peer is not in the same subnet

* `always`

  Tunnel even if the peer seems to be in the same subnet.
  Some hosting providers require this as traffic goes through routers even
  between adjacent nodes.


## Keyword `tunnel_mode`

	required:    false
	scopable:    false
	group:       routing
	candidates:  gre, ipip, ip6ip6
	default:     ipip
	rbac:        This driver group requires the root grant.

**Description:**

The ip tunnel mode. gre can tunnel mcast ip and ipv6 at the price of a 24B header, ipip can only tunnel ipv4 but with a 20B header. Note, some OVH servers combinations don't support ipip but work with gre.


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


