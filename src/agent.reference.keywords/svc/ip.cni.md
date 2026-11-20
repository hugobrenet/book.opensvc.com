# Driver `ip.cni`

**Minimal configlet:**

	[ip#1]
	type = cni

**Minimal setup command:**

	om test/svc/foo set --kw="type=cni"

**Supported keywords:**

- blocking_post_provision
- blocking_post_start
- blocking_post_stop
- blocking_post_unprovision
- blocking_pre_provision
- blocking_pre_start
- blocking_pre_stop
- blocking_pre_unprovision
- comment
- disable
- dns_name_suffix
- encap
- expose
- monitor
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
- wait_dns

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


## Keyword `netns`

	required:    false
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
	default:     default
	rbac:        A network named by a path requires the root grant.

**Example:**

	network=mynet

**Description:**

The name of the CNI network to plug into.

The `default` network is created using the `host-local` bridge plugin.


## Keyword `nsdev`

	required:    false
	scopable:    true
	group:       interface
	aliases:     ipdev

**Example:**

	nsdev=front

**Description:**

The interface name in the container namespace.


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


