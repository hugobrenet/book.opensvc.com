# Driver `ip.netns`

**Minimal configlet:**

	[ip#1]
	type = netns
	mode = bridge
	name = 1.2.3.4
	netmask = 24
	netns = container#0

**Minimal setup command:**

	om test/svc/foo set \
		--kw="type=netns" \
		--kw="mode=bridge" \
		--kw="name=1.2.3.4" \
		--kw="netmask=24" \
		--kw="netns=container#0"

**Supported keywords:**

- addr
- alias
- blocking_post_provision
- blocking_post_start
- blocking_post_stop
- blocking_post_unprovision
- blocking_pre_provision
- blocking_pre_start
- blocking_pre_stop
- blocking_pre_unprovision
- check_carrier
- comment
- del_net_route
- dev
- disable
- dns_name_suffix
- encap
- expose
- gateway
- macaddr
- mode
- monitor
- name
- netmask
- netns
- network
- nsdev
- optional
- pg_blkio_weight
- pg_cpu_burst
- pg_cpu_quota
- pg_cpu_shares
- pg_cpus
- pg_mem_high
- pg_mem_limit
- pg_mem_oom_control
- pg_mem_swappiness
- pg_mems
- pg_pids_max
- pg_vmem_limit
- post_provision
- post_start
- post_stop
- post_unprovision
- pre_provision
- pre_start
- pre_stop
- pre_unprovision
- provision
- provision_requires
- publish
- restart
- restart_delay
- shared
- standby
- start_requires
- stat_timeout
- stop_requires
- subset
- tags
- type
- unprovision
- unprovision_requires
- vlan_mode
- vlan_tag
- wait_dns

## Keyword `addr`

	required:    false
	scopable:    true
	group:       addressing
	recorded:    written when what it names is made, and reset when the object is cloned
	stop first:  a change is refused while the resource is up
	rbac:        An address of the user's choosing requires the root grant: om writes the address it draws from the network.

**Example:**

	addr=fd01:2345:6789:2902::5:e8

**Description:**

The address drawn from the lan network the `network` keyword names, which om
writes here when the resource first starts, and removes when it is
unprovisioned.

On a lan network the resource keeps its address from a start to the next,
until it is unprovisioned, as an ip.host resource does: the hosts of the
segment know the service by its address. Every node holds the
configuration, so every node uses this address for the resource, whichever
node drew it and whatever became of that node. Set it to keep an address
drawn before, or unset it to have the next start draw another one, and
remove the one it replaces from the namespace.

On the other networks the address is drawn at each start and released at
each stop, and the clients reach the service by its DNS record, which
follows the address: this keyword is not used.

A configuration copied to create another object leaves it behind, so the
copy draws an address of its own rather than bring this one up twice.

A resource not shared of a flex object draws an address per instance, as
its instances run at once. The address of an instance is not written here:
the node keeps it in its reservation store, from a start to the next, until
the instance is unprovisioned. Set addr@<nodename> to choose the address of
an instance; an addr without a node is not taken as one.


## Keyword `alias`

	required:    false
	scopable:    true
	group:       interface
	deprecated:  since v3.0.0-rc62
	default:     true
	convert:     bool
	rbac:        Requires the root grant.

**Description:**

Use network interface stacking.

Modern ip stack support multiple ip addresses per interface, so `alias`
should be set to `false` when possible.


## Keyword `blocking_post_provision`

	required:    false
	scopable:    true
	group:       triggers
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute after the resource `provision` action.

Errors interrupt the action.

This trigger is only executed on leaders.


## Keyword `blocking_post_start`

	required:    false
	scopable:    true
	group:       triggers
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute after the resource `start` action.

Errors interrupt the action.


## Keyword `blocking_post_stop`

	required:    false
	scopable:    true
	group:       triggers
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute after the resource `stop` action.

Errors interrupt the action.


## Keyword `blocking_post_unprovision`

	required:    false
	scopable:    true
	group:       triggers
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute after the resource `unprovision` action.

Errors interrupt the action.

This trigger is only executed on leaders.


## Keyword `blocking_pre_provision`

	required:    false
	scopable:    true
	group:       triggers
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute before the resource `provision` action.

Errors interrupt the action.


## Keyword `blocking_pre_start`

	required:    false
	scopable:    true
	group:       triggers
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute before the resource `start` action.

Errors interrupt the action.


## Keyword `blocking_pre_stop`

	required:    false
	scopable:    true
	group:       triggers
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute before the resource `stop` action.

Errors interrupt the action.


## Keyword `blocking_pre_unprovision`

	required:    false
	scopable:    true
	group:       triggers
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute before the resource `unprovision` action.

Errors interrupt the action.


## Keyword `check_carrier`

	required:    false
	scopable:    true
	group:       interface
	default:     true
	convert:     bool
	rbac:        Requires the root grant.

**Description:**

Activate the link carrier check.

Set to `false` if `dev` is a backend bridge or switch.


## Keyword `comment`

	required:    false
	scopable:    false
	group:       identity

**Description:**

A free form text describing the role of the object, of the node, or of the
section it is set in.

The keyword is accepted in any section, so the DEFAULT section can document a
configuration as a whole, and a resource, pool, heartbeat, array or network
section can document itself.

The agent does not interpret the value.


## Keyword `del_net_route`

	required:    false
	scopable:    true
	group:       routing
	default:     false
	convert:     bool
	rbac:        Requires the root grant.

**Description:**

Some docker ip configurations require dropping the network route
autoconfigured when installing the ip address.

In this case set `del_net_route=true` and `network=<cidr>`.


## Keyword `dev`

	required:    false
	scopable:    true
	group:       interface
	aliases:     ipdev
	stop first:  a change is refused while the resource is up
	rbac:        Requires the root grant.

**Example:**

	dev=br-prd

**Description:**

The interface name to setup the ip address on.

This interface can be different from one node to the other, in which case the
`dev@<nodename>` scoping syntax can be used.

If the value is expressed as `<intf>:<n>`, the stacked interface index is
forced to `<n>` instead of the lowest free index.

If the value is expressed as `<name>@<intf>`, a macvtap interface named
`<name>` is created and attached to `<intf>`.


## Keyword `disable`

	required:    false
	scopable:    true
	group:       availability
	convert:     bool

**Description:**

A disabled resource will be ignored on `start`, `stop`, `provision` and
`unprovision` actions.

A disabled resource status is `n/a`.

If set in the `DEFAULT` section of an object, the object is disabled and
ignores `start`, `stop`, `shutdown`, `provision` and `unprovision` actions.

These actions do nothing, and exit 7, a code telling the action was not
done because the instance is disabled, which the daemon takes as the end of
a stop and of an unprovision: a disabled object is purged. An `unprovision`
of a disabled instance whose resources are provisioned fails: the object
would be deleted with its storage left on the node. Enable it to
unprovision it.

`om <path> disable` sets `DEFAULT.disable=true`.

`om <path> enable` sets `DEFAULT.disable=false`.

> **Note**: The `enable` and `disable` actions preserve the individual
  resource `disable` state.


## Keyword `dns_name_suffix`

	required:    false
	scopable:    true
	group:       dns

**Example:**

	dns_name_suffix=-backup

**Description:**

Add the value as a suffix to the DNS record name. The record created is thus formatted as:

* `<name>-<dns_name_suffix>.<app>.<managed zone>` in the collector managed zone
* `<name>-<dns_name_suffix>.<namespace>.<kind>.<clustername>` in the cluster dns zone.


## Keyword `encap`

	required:    false
	scopable:    false
	group:       encap
	convert:     bool

**Description:**

Set to `true` to ignore this resource in the nodes context and consider it in the encapnodes context. The resource is thus handled by agents deployed in the service containers.


## Keyword `expose`

	required:    false
	scopable:    true
	group:       dns
	convert:     list

**Example:**

	expose=8443:443/tcp 53/udp

**Description:**

A whitespace-separated list of socket services the cluster DNS serves a SRV
record of, each written as a `publish` declaration is,
`[<frontend port>:]<port>[/<proto>]`:

* `<port>` is the port the address serves.
* `<frontend port>` is the port the record is named after,
  `_<frontend port>._<proto>.<object fqdn>`, the port itself when not set. A
  service name, as `http`, is accepted.
* `<proto>` is `tcp`, the default, `tcp4`, `tcp6`, `udp`, `udp4` or `udp6`.

The former form, `<port>/<proto>[:<frontend port>]`, as `443/tcp:8443`, is
still read, and makes the same record as `8443:443/tcp`.

It makes the records only, and forwards no port: the `publish` keyword
forwards the ports of the node to the address.

Unset, the ports `publish` forwards are exposed, each as
`<host port>:<port>/<proto>`. Set, it replaces them, and `none` exposes
nothing.


## Keyword `gateway`

	required:    false
	scopable:    true
	group:       routing
	provision:   used only by the provision of the resource
	rbac:        Requires the root grant.

**Description:**

The gateway the default route of the network namespace goes through.

When not set, it is the gateway of the network the address is drawn from:
the address of the bridge of a bridge or routed_bridge network, the gateway
keyword of a lan network. With no gateway at all, the default route goes
through the interface of the resource.

Several ip resources may share a namespace, and a namespace has one default
route. The resource setting it is the one whose gateway is set here, rather
than taken from its network, rather than none; the lowest resource id among
equals, whatever the order the resources start in. The others leave the route
alone, and a gateway set here that is not used is reported in the status.

The default route is set only when the namespace has none: one another
resource of the container set, as an ip.cni one, is kept.


## Keyword `macaddr`

	required:    false
	scopable:    true
	group:       interface
	rbac:        Requires the root grant.

**Example:**

	macaddr=ce:32:cc:ca:41:33

**Description:**

The hardware address to set on the interface in the network namespace.


## Keyword `mode`

	required:    false
	scopable:    true
	group:       interface
	stop first:  a change is refused while the resource is up
	candidates:  bridge, dedicated, macvlan, ipvlan-l2, ipvlan-l3, ipvlan-l3s, ovs
	rbac:        Requires the root grant.

**Default:**

The first of the `modes` of the network the address is drawn from, else `bridge`.

**Example:**

	mode=bridge

**Description:**

The ip link mode.

- `bridge`

  Proven, simple and versatile default mode.

- `dedicated`

  Used when a container or namespace gets exclusive ownership of a physical NIC. Ideal for performance-sensitive workloads that need direct hardware access without virtualization overhead.

- `macvlan`

  Used when each container needs its own MAC address and appears as a distinct device on the physical network (L2 presence). Common in environments where containers must be directly reachable on the LAN, like VMs would be. This mode is not appropiate on VMWare with Vswitch default policies.

- `ipvlan-l2`

  Similar to macvlan but all sub-interfaces share the parent's MAC address. Used when the upstream switch limits the number of MAC addresses per port (e.g., cloud environments or strict switch policies).

- `ipvlan-l3`

  Used when you want the host to act as a router between namespaces and the external network. No L2 broadcast/multicast is propagated; each namespace is isolated at Layer 2. Suited for high-density, routed environments.

- `ipvlan-l3s`

  A variant of ipvlan-l3 that keeps traffic in the kernel's netfilter/iptables path (s = symmetric routing). Used when you still need NAT, firewalling, or policy routing rules to apply to ipvlan traffic, unlike pure l3 mode. As in every ipvlan mode, the host and the container do not reach each other through the parent interface.

- `ovs` (Open vSwitch)

  Used in SDN (Software-Defined Networking) and multi-host environments. Chosen when you need advanced L2/L3 features like VLANs, tunneling (VXLAN, GRE), flow-based forwarding, or centralized network control.


**Communication scope:**

| Mode       | Host → Container | Container → Host | Container → Container |
|------------|------------------|------------------|-----------------------|
| bridge     | ok               | ok               | ok                    |
| dedicated  |                  |                  |                       |
| macvlan    |                  |                  | ok                    |
| ipvlan-l2  |                  |                  | ok                    |
| ipvlan-l3  |                  |                  | ok                    |
| ipvlan-l3s |                  |                  | ok                    |
| ovs        | ok               | ok               | ok                    |


## Keyword `monitor`

	required:    false
	scopable:    true
	group:       monitoring
	convert:     bool

**Description:**

A resource with `monitor=true` will trigger the `monitor_action`
(crash or reboot the node, freezestop or switch the service) if:

* The resource is `down`.

* The instance has `local_expect=started` in its daemon monitor data, which
  means the daemon considers this instance is and should remain started.

* All restart tentatives failed.


## Keyword `name`

	required:    false
	scopable:    true
	group:       addressing
	aliases:     ipname
	stop first:  a change is refused while the resource is up
	rbac:        Requires the root grant.

**Example:**

	name=1.2.3.4

**Description:**

The DNS name or IP address of the ip resource.

Scoping
-------

Can be different from one node to the other, in which case the
`name@<nodename>` scoping syntax can be used.

This is most useful to specify a different ip when the service starts in DRP
mode, where subnets are likely to be different than those of the production
datacenter.

DNS name caching
----------------

If the value is a DNS name, a lookup is done for every resource status
evaluation.

* If the lookup succeeds, the addr is store in a cache file.

* If the lookup fails, the address is fetched from the cache file.

  * If the cache is not expired (refreshed in the past 19 minutes) the
    address is trusted:

    * The resource status is degraded to from `up` to `warn`.

    * The resource restarts begin if `restarts > 0`.
      The restart is a no-op but the resource status is re-evaluated.
      If the lookup succeeds, the resource status to `up`.

    * The monitor action is triggered if all restarts failed and
      `monitor_action` is set.
      For example, a `freezestop` can still succeed using the cached
      ip address.

  * If the cache is expired (older than 19 minutes):

    * The resource status is `warn`, weither the actual untrusted ip
      address is plumbed or not.

    * The `stop` and `start` actions no longer work. An admin action
      is necessary to repair the configuration or dns lookups.



## Keyword `netmask`

	required:    false
	scopable:    true
	group:       addressing
	rbac:        Requires the root grant.

**Example:**

	netmask=24

**Description:**

The netmask to configure with the address resolved from `name`.

If an ip is already plumbed on the root interface, the netmask default is the
netmask of this existing ip.

`netmask` is mandatory for interfaces dedicated to the object. Dummy interfaces
are likely to be in this case.

The format is:

* dotted or octal for IPv4, ex: `255.255.252.0` or `22`.

* octal only for IPv6, ex: `64`.


## Keyword `netns`

	required:    true
	scopable:    true
	group:       interface
	aliases:     container_rid
	stop first:  a change is refused while the resource is up
	references:  container rid
	rbac:        A namespace other than none or a container#<n> of the object requires the root grant.

**Example:**

	netns=container#0

**Description:**

The resource id of the container to plumb the ip into.


## Keyword `network`

	required:    false
	scopable:    true
	group:       addressing
	stop first:  a change is refused while the resource is up
	rbac:        A network named by a path requires the root grant.

**Example:**

	network=default

**Description:**

The name of the om network the address is drawn from.

The `default` network exists on every node of a fresh installation, so an
object needs nothing more than `network=default` to receive an address.

Naming a network is enough: the `dev`, `netmask` and `gateway` of the resource
are the network's to know, and are taken from it when the configuration does
not set them. Leaving `name` empty has the address allocated from the network
too.

On a bridge or routed_bridge network, the address is drawn at each start and
released at each stop, and the clients reach the service by its DNS record,
which follows the address.

On a lan network, the address is kept from a start to the next until the
resource is unprovisioned, and recorded in `addr`. The `dev` is the interface
of the node on the segment, and the `netmask` the prefix length of the
segment. The `gateway` is the one of the network, the router of the segment,
and none when the network names none. The `macvlan` and
`ipvlan-l2` modes put the address on the segment. The `bridge` mode needs
`dev` to be a linux bridge on the segment, and the `ovs` mode needs `dev` set
to an openvswitch bridge on the segment. The `ipvlan-l3` and `ipvlan-l3s`
modes are refused, as the hosts of the segment would not reach the address,
and the `dedicated` mode needs a `dev` of its own, not the interface of the
node on the segment.

This keyword used to hold the address of the network, in dotted notation, to
set the destination of the route removed by `del_net_route`. That destination
is derived from the address and the netmask now. A value in that form is
reported as obsolete and ignored.


## Keyword `nsdev`

	required:    false
	scopable:    true
	group:       interface

**Example:**

	nsdev=front

**Description:**

The first `eth<n>` available in the network namespace.


## Keyword `optional`

	required:    false
	scopable:    true
	group:       availability
	convert:     bool

**Description:**

Action errors on optional resources are logged but do not interrupt the action sequence.

The status of optional resources is not included in the instance availability status but is considered in the overall status.

The status of task and sync resources is always included in the overall status, regardless of whether they are marked as optional.

Resources tagged as `noaction` are considered optional by default.

Dump filesystems are a typical use case for optional=true.


## Keyword `pg_blkio_weight`

	required:    false
	scopable:    true
	group:       pg

**Example:**

	pg_blkio_weight=50

**Description:**

Block IO relative weight. Value: between `10` and `1000`.

The kernel default is `100`.

Setting this keyword to `default` puts the capping back where a node that
never capped anything leaves it. Removing the keyword does not: what was
written stays written, whether om wrote it or something else did.


## Keyword `pg_cpu_burst`

	required:    false
	scopable:    true
	group:       pg

**Example:**

	pg_cpu_burst=20%

**Description:**

The cpu time the group banks under its quota, and spends above it.

It is the time the processes of the group may bank while under their
`pg_cpu_quota`, and spend above it in a short spike, in the notation of
`pg_cpu_quota`: `20%` lets the group run a fifth of a cpu above its quota
during a period, out of what it left unused before.

It serves a latency-sensitive service capped tightly: a request arriving
after an idle spell is served at the speed of the burst, rather than
throttled for the rest of the period. Over a longer time the group still
uses no more than its quota.

It needs `pg_cpu_quota`, and cannot exceed it: the kernel refuses a burst
larger than the quota. Only the unified cgroup hierarchy has it.

Setting this keyword to `default` puts the capping back where a node that
never capped anything leaves it. Removing the keyword does not: what was
written stays written, whether om wrote it or something else did.


## Keyword `pg_cpu_quota`

	required:    false
	scopable:    true
	group:       pg

**Example:**

	pg_cpu_quota=50%@all

**Description:**

The percentage of cpu time the processes of the group may use.

Accepted expressions:

* `50%`
  Half of one cpu.

* `50%@all`
  Half of every cpu the node has.

* `10%@2`
  A tenth of two cpus.

Unlike `pg_cpu_shares`, which only arbitrates when the node is cpu-bound, a
quota caps the group whether or not the node is busy.

Setting this keyword to `default` puts the capping back where a node that
never capped anything leaves it. Removing the keyword does not: what was
written stays written, whether om wrote it or something else did.


## Keyword `pg_cpu_shares`

	required:    false
	scopable:    true
	group:       pg
	convert:     size

**Example:**

	pg_cpu_shares=512

**Description:**

The share of cpu the group gets when the node is cpu-bound.

The share is relative to the other groups.

The actual percentile depends on the shares allowed to the other services.
Unset, the kernel default is used, which usually is 1024 shares.

Setting this keyword to `default` puts the capping back where a node that
never capped anything leaves it. Removing the keyword does not: what was
written stays written, whether om wrote it or something else did.


## Keyword `pg_cpus`

	required:    false
	scopable:    true
	group:       pg
	depends:     create_pg=true

**Example:**

	pg_cpus=0-2

**Description:**

The cpus the processes of the group may run on.

Cpus are specified as list or range : `0,1,2` or `0-2`.

Setting this keyword to `default` puts the capping back where a node that
never capped anything leaves it. Removing the keyword does not: what was
written stays written, whether om wrote it or something else did.


## Keyword `pg_mem_high`

	required:    false
	scopable:    true
	group:       pg
	convert:     size

**Example:**

	pg_mem_high=384m

**Description:**

The memory past which the kernel throttles the group, in bytes.

Past it, the kernel slows the processes of the group down, reclaiming their
memory and throttling their allocations.

Unlike `pg_mem_limit`, reaching it does not wake the Out-Of-Memory killer: a
group above it keeps running, slower, while the kernel reclaims. Set below
`pg_mem_limit`, it gives a process growing too much the time to be noticed,
or to shrink, before it is killed.

It is a soft limit, so it is not what a memory claim counts: the claim counts
`pg_mem_limit`. Only the unified cgroup hierarchy has it.

Setting this keyword to `default` puts the capping back where a node that
never capped anything leaves it. Removing the keyword does not: what was
written stays written, whether om wrote it or something else did.


## Keyword `pg_mem_limit`

	required:    false
	scopable:    true
	group:       pg
	convert:     size

**Example:**

	pg_mem_limit=512m

**Description:**

The memory the processes of the group may use, in bytes.

The Out-Of-Memory killer is triggered in case of tresspassing.

Setting this keyword to `default` puts the capping back where a node that
never capped anything leaves it. Removing the keyword does not: what was
written stays written, whether om wrote it or something else did.

On a node holding the v1 cgroup hierarchy, `default` lifts the memory+swap
limit too: a group with no memory limit cannot keep one below it.


## Keyword `pg_mem_oom_control`

	required:    false
	scopable:    true
	group:       pg

**Example:**

	pg_mem_oom_control=1

**Description:**

Whether the Out of Memory killer runs for the group: 0 enables it.

It is a flag (0 or 1) enabling or disabling the Out of Memory killer for the
processes of the group.

* If enabled (0), tasks that attempt to consume more memory than they are
  allowed are immediately killed by the OOM killer.
* If disabled (1), tasks are allowed to continue to try allocating memory,
  stressing the system.

The OOM killer is enabled by default in every cgroup using the memory
controller.

This keyword caps nothing on a node holding the unified cgroup hierarchy,
which has no `memory.oom_control`: that file is of the v1 hierarchy. Setting
it there is warned about, and ignored.


## Keyword `pg_mem_swappiness`

	required:    false
	scopable:    true
	group:       pg

**Example:**

	pg_mem_swappiness=40

**Description:**

Set a swappiness percentile value for the process group.

This keyword caps nothing on a node holding the unified cgroup hierarchy,
which has no `memory.swappiness`: that file is of the v1 hierarchy. Setting
it there is warned about, and ignored.


## Keyword `pg_mems`

	required:    false
	scopable:    true
	group:       pg

**Example:**

	pg_mems=0-2

**Description:**

The memory nodes the processes of the group may allocate from.

Memory nodes are specified as list or range : `0,1,2` or `0-2`.

Setting this keyword to `default` puts the capping back where a node that
never capped anything leaves it. Removing the keyword does not: what was
written stays written, whether om wrote it or something else did.


## Keyword `pg_pids_max`

	required:    false
	scopable:    true
	group:       pg

**Example:**

	pg_pids_max=512

**Description:**

The most processes and threads the group may run at once.

A fork beyond it fails in the process that asked for it, and nothing else
of the node is touched: it is what keeps a runaway fork loop from exhausting
the process table of the node.

Setting this keyword to `default` puts the capping back where a node that
never capped anything leaves it. Removing the keyword does not: what was
written stays written, whether om wrote it or something else did.


## Keyword `pg_vmem_limit`

	required:    false
	scopable:    true
	group:       pg
	convert:     size

**Example:**

	pg_vmem_limit=1g

**Description:**

The memory plus swap the processes of the group may use, in bytes.

The Out-Of-Memory killer is triggered in case of tresspassing.
The specified value must be greater than `pg_mem_limit`.

Setting this keyword to `default` puts the capping back where a node that
never capped anything leaves it. Removing the keyword does not: what was
written stays written, whether om wrote it or something else did.


## Keyword `post_provision`

	required:    false
	scopable:    true
	group:       triggers
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute after the resource `provision` action.

Errors do not interrupt the action.

This trigger is only executed on leaders.


## Keyword `post_start`

	required:    false
	scopable:    true
	group:       triggers
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute after the resource `start` action.

Errors do not interrupt the action.


## Keyword `post_stop`

	required:    false
	scopable:    true
	group:       triggers
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute after the resource `stop` action.

Errors do not interrupt the action.


## Keyword `post_unprovision`

	required:    false
	scopable:    true
	group:       triggers
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute after the resource `unprovision` action.

Errors do not interrupt the action.

This trigger is only executed on leaders.


## Keyword `pre_provision`

	required:    false
	scopable:    true
	group:       triggers
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute before the resource `provision` action.

Errors do not interrupt the action.


## Keyword `pre_start`

	required:    false
	scopable:    true
	group:       triggers
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute before the resource `start` action.

Errors do not interrupt the action.


## Keyword `pre_stop`

	required:    false
	scopable:    true
	group:       triggers
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute before the resource `stop` action.

Errors do not interrupt the action.


## Keyword `pre_unprovision`

	required:    false
	scopable:    true
	group:       triggers
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute before the resource `unprovision` action.

Errors do not interrupt the action.


## Keyword `provision`

	required:    false
	scopable:    false
	group:       provisioning
	default:     true
	convert:     bool

**Description:**

Set to `false` to ignore the `provision` and `unprovision` actions on the
resource.

> **Warning**: `provision` and `unprovision` use data-destructive operations
  like formatting.

It is recommended to set `provision=false` on long-lived critical objects,
to force administrators to remove this setting when they really want to
destroy data.


## Keyword `provision_requires`

	required:    false
	scopable:    false
	group:       requirements
	references:  requires

**Example:**

	provision_requires=ip#0 fs#0(down,stdby down)

**Description:**

A whitespace-separated list of conditions to meet to accept a 'provision'
action.

A condition is expressed as `<rid>(<state>,...)`.

If states are omitted, `up,stdby up` is used as the default expected states.


## Keyword `publish`

	required:    false
	scopable:    true
	group:       publish
	stop first:  a change is refused while the resource is up
	convert:     list
	rbac:        A publish naming a port or an address of the node requires the root grant.

**Example:**

	publish=25489:80/tcp 192.168.1.10:8443:443/tcp

**Description:**

A whitespace-separated list of ports of the node forwarded to ports of the
address, each written `[<host addr>:][<host port>:]<port>[/<proto>]`:

* `<host port>` is the port of the node the clients connect to. Without it,
  a free port of the node is drawn when the resource starts: `80/tcp`, or
  `10.0.0.5::80` on one address of the node.
* `<port>` is the port of the address the connections are forwarded to.
* `<proto>` is `tcp`, the default, or `udp`.
* `<host addr>` restricts the forwarding to the connections made to that
  address of the node, an ipv6 one written in brackets, as
  `[fd00::5]:8443:443`. Without it, the port is forwarded on every address
  of the node.

For example, `publish = 25489:80/tcp` forwards the port 25489 of the node to
the port 80 of the address, where a nginx of the namespace listens. A port
not listed, as the 3000 of a backend the nginx proxies to, is not forwarded:
it is reached from the namespace, and from the hosts routing to the address.

A drawn port is kept while the resource runs, a start of the resource
already up included, and released when it stops: the next start, as the
one of a failover, may draw another. The status of the resource reports the
publishes with the ports drawn, and the cluster DNS serves them.

Every published port is exposed: the cluster DNS serves its SRV record as
the `expose` keyword would for `<host port>:<port>/<proto>`, as
`_25489._tcp.<object fqdn>` for `25489:80/tcp`. An `expose` keyword set
replaces the published ports, and `expose = none` exposes nothing.

The forwarding is done by the node, with the nftables rules of the
`osvc-publish` table, against the address the resource plumbed. No option of
a container engine is involved, so it works the same whatever runs in the
namespace: docker, podman, lxc, a containerd or runc container joining the
namespace of an `ip.cni` resource, or a process of an `app` resource.

The rules are added when the resource starts and removed when it stops. A
change or a removal of the keyword is refused while the resource is up: it
is stopped first. A
start is refused when:

* the node does not forward the packets of the family of the address:
  `net.ipv4.ip_forward`, or `net.ipv6.conf.all.forwarding`, is to be set to
  `1` by the administrator, om never sets it: `sysctl -w
  net.ipv4.ip_forward=1`, and a file of `/etc/sysctl.d` to keep it at boot.
* another resource of the node already publishes the port of the node.
* the mode is one the node can not reach the address in, on a network
  other than `lan`: `macvlan`, `ipvlan-l2`, `ipvlan-l3`, `ipvlan-l3s` and
  `dedicated`.

On a `lan` network, the publishes are ignored, whatever the mode: the
address is on the segment of its clients, which reach it directly. The
resource starts all the same, and its status says so in an info line.

The status warns when the rules of the resource are expected and not
loaded, a rule per publish, or when the node no longer forwards.

Nothing keeps a process of the node from binding a published port later, a
drawn one included: the forwarding then takes the connections that process
waits for, except on its loopback addresses. The status warns of a port of
the node a socket of the node also holds, of the family of the address: the
ipv6 wildcard, dual stack by default, counts for both families.

The port is forwarded for the clients connecting to an address of the node
other than a loopback one: `127.0.0.1:<host port>` is not forwarded.

A declaration naming a port or an address of the node requires the root
grant, the ports and the addresses of the node being the node
administrator's to hand out. One naming neither, as `80/tcp`, its port of
the node drawn free, is open to the namespace administrators.

The nodes of a service setting this keyword are all to run an agent knowing
it: an older one ignores it, and starts the service with no port forwarded.


## Keyword `restart`

	required:    false
	scopable:    true
	group:       monitoring
	default:     0
	convert:     int

**Description:**

The daemon will try to restart a resource if:

* The resource is `down`, `stdby down` or `warn`.

* The instance has `local_expect=started` in its daemon monitor data, which
  means the daemon considers this instance is and should remain started.

* The node is not frozen

* The instance is not frozen

In this case, the daemon try `restart=<n>` times before falling back to the
monitor action.

The `restart_delay` keyword sets the interval after a failed restart before
the next tentative.

Resources with `standby=true` have `restart` forced to a minimum of 2, to
increase chances of a restart success.


## Keyword `restart_delay`

	required:    false
	scopable:    true
	group:       monitoring
	default:     500ms
	convert:     duration

**Description:**

The minimum delay between two restart tentatives on the resource.


## Keyword `shared`

	required:    false
	scopable:    true
	group:       provisioning
	convert:     bool

**Description:**

If `true`, the resource will be considered shared during provision and
unprovision actions.

A shared resource driver can implement a different behaviour depending
on weither it is run from the leader instance, or not:

* When `--leader` is set, the driver creates and configures the system
  objects. For example the disk.disk driver allocates a SAN disk and
  discover its block devices.

* When `--leader` is not set, the driver does not redo the actions
  already done by the leader, but may do some. For example, the
  disk.disk driver skips the SAN disk allocation, but discovers the
  block devices.

The daemon takes care of setting the `--leader` flags on the commands
it submits during deploy, purge, provision and unprovision
orchestrations.

> **Warning**: If admins want to submit `--local` provision or unprovision
  commands themselves, they have to set the `--leader` flag correctly.

Flex objects usually don't use shared resources. But if they do, only
the flex primary gets `--leader` commands.

> **Warning**: All resources depending on a shared resource must also be
  flagged as shared.


## Keyword `standby`

	required:    false
	scopable:    true
	group:       availability
	convert:     bool

**Description:**

If `true`, always start the resource, even on non-started instances.

The daemon is responsible for starting standby resources.

A resource can be set standby on a subset of nodes using keyword scoping.

A typical use-case is a synchronized filesystem on non-shared disks. The
remote filesystem must be mounted to not overflow the underlying filesystem.

> **Warning**: In most situation, don't set shared resources standby, a
  non-clustered fs on shared disks for example.


## Keyword `start_requires`

	required:    false
	scopable:    false
	group:       requirements
	references:  requires

**Example:**

	start_requires=ip#0 fs#0(down,stdby down)

**Description:**

A whitespace-separated list of conditions to meet to accept a 'start'
action.

A condition is expressed as `<rid>(<state>,...)`.

If states are omitted, `up,stdby up` is used as the default expected states.


## Keyword `stat_timeout`

	required:    false
	scopable:    true
	group:       timeouts
	convert:     duration

**Description:**

The fs resources status evaluation includes a stat syscall test.
This keyword defines the maximum wait time for those stat calls to respond.

When expired, the resource status is degraded is to warn, which can trigger
a monitor action (reboot or crash the node) if the resource is monitored.


## Keyword `stop_requires`

	required:    false
	scopable:    false
	group:       requirements
	references:  requires

**Example:**

	stop_requires=ip#0 fs#0(down,stdby down)

**Description:**

A whitespace-separated list of conditions to meet to accept a 'stop'
action.

A condition is expressed as `<rid>(<state>,...)`.

If states are omitted, `up,stdby up` is used as the default expected states.


## Keyword `subset`

	required:    false
	scopable:    true
	group:       selection

**Description:**

The name of the subset this resource is assigned to.

Resources of a same driver group and a same subset are ordered and acted upon
together, and are configured as a whole in a `[subset#<group>:<name>]` section,
or in a less precise `[subset#<name>]` one.

That section accepts `parallel`, to act on the members concurrently rather than
one after the other, and the `pg_*` keywords, to place the members in their own
process group.


## Keyword `tags`

	required:    false
	scopable:    true
	group:       selection
	convert:     set

**Description:**

A whitespace-separated list of tags.

Tags can be used for resource selection by tag.

Some tags can influence the driver behaviour:

* `noaction`

  Skip any state changing action on the resource and imply `optional=true`.

* `nostatus`

  Force the status `n/a`.


## Keyword `type`

	required:    false
	scopable:    false
	group:       identity
	rbac:        Requires the root grant, except for a cni address, for a netns address om draws from a cluster network, and for a host address om draws from a lan network, on the interface and with the netmask the network says.

**Description:**

The resource driver name.


## Keyword `unprovision`

	required:    false
	scopable:    false
	group:       provisioning
	default:     true
	convert:     bool

**Description:**

Set to `false` to ignore the `unprovision` action on the resource.

> **Warning**: `unprovision` use data-destructive operations like
  formatting.

It is recommended to set `provision=false` on long-lived critical objects,
to force administrators to remove this setting when they really want to
destroy data.


## Keyword `unprovision_requires`

	required:    false
	scopable:    false
	group:       requirements
	references:  requires

**Example:**

	unprovision_requires=ip#0 fs#0(down,stdby down)

**Description:**

A whitespace-separated list of conditions to meet to accept a 'unprovision'
action.

A condition is expressed as `<rid>(<state>,...)`.

If states are omitted, `up,stdby up` is used as the default expected states.


## Keyword `vlan_mode`

	required:    false
	scopable:    true
	group:       interface
	candidates:  access, native-tagged, native-untagged
	depends:     .mode=ovs
	rbac:        Requires the root grant.

**Default:**

The `vlan_mode` of the network the address is drawn from, else `native-untagged`.

**Example:**

	vlan_mode=access

**Description:**

The VLAN port mode.


## Keyword `vlan_tag`

	required:    false
	scopable:    true
	group:       interface
	depends:     .mode=ovs
	rbac:        Requires the root grant.

**Example:**

	vlan_tag=44

**Description:**

The VLAN tag the switch port will relay, the `tag` of the port the `ovs` mode
adds to the openvswitch bridge. Unset, the `vlan_tag` of the network the
address is drawn from, if any.


## Keyword `wait_dns`

	required:    false
	scopable:    true
	group:       dns
	default:     0
	convert:     duration

**Example:**

	wait_dns=10s

**Description:**

Wait for the cluster DNS records associated to the resource to appear after
a resource start and before the next resource can be started.

This can be set when apps or containers require the ip or ip name to be
resolvable to provision or start properly.


