# Driver `ip.host`

**Minimal configlet:**

	[ip#1]
	type = host

**Minimal setup command:**

	om test/svc/foo set --kw="type=host"

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
- dev
- disable
- encap
- expose
- gateway
- monitor
- name
- netmask
- network
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

The address drawn from the om network the `network` keyword names, which om
writes here when the resource first starts, and removes when it is
unprovisioned.

Every node holds the configuration, so every node uses this address for the
resource, whichever node drew it and whatever became of that node: a
failover service keeps its address on a node it moves to after the others
crashed. Set it to keep an address drawn before, or unset it to have the
next start draw another one, and remove the one it replaces from the
interface.

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


## Keyword `dev`

	required:    false
	scopable:    true
	group:       interface
	aliases:     ipdev
	stop first:  a change is refused while the resource is up
	rbac:        Requires the root grant.

**Example:**

	dev=eth0

**Description:**

The interface name to setup the ip address on.

When not set, the interface the network the address is drawn from names: the
interface of the node on the segment of a `lan` network.

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

`none` exposes nothing.


## Keyword `gateway`

	required:    false
	scopable:    true
	group:       routing
	deprecated:  since v3.0.0-rc62
	provision:   used only by the provision of the resource
	rbac:        Requires the root grant.

**Description:**

A zone ip provisioning parameter used in the `sysidcfg` formatting


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

When not set, the address is drawn from the om network the `network` keyword
names.

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


## Keyword `network`

	required:    false
	scopable:    true
	group:       addressing
	stop first:  a change is refused while the resource is up
	rbac:        A network named by a path requires the root grant.

**Example:**

	network=san

**Description:**

The name of the om network the address is drawn from, when `name` is not set.

The address is drawn when the resource first starts, and written to the
`addr` keyword: every node then uses it, so the address follows a failover
service to whichever node it moves to, the floating address of the service,
which its clients know it by. It is kept until the resource is unprovisioned,
a stop keeping it.

The `dev` and `netmask` of the resource are the network's to know, and are
taken from it when the configuration does not set them: the interface of the
node on the segment of a `lan` network, and the prefix length of the segment.

This keyword used to hold the address of the network, in dotted notation. A
value that is still an address is obsolete, reported and ignored.


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


