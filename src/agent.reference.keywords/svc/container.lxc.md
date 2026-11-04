# Driver `container.lxc`

**Minimal configlet:**

	[container#1]
	type = lxc
	name = 

**Minimal setup command:**

	om test/svc/foo set \
		--kw="type=lxc" \
		--kw="name="

**Supported keywords:**

- blocking_post_provision
- blocking_post_start
- blocking_post_stop
- blocking_post_unprovision
- blocking_pre_provision
- blocking_pre_start
- blocking_pre_stop
- blocking_pre_unprovision
- cf
- comment
- create_configs_environment
- create_environment
- create_secrets_environment
- data_dir
- disable
- encap
- guest_os
- hostname
- monitor
- name
- no_preempt_abort
- optional
- osvc_root_path
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
- prkey
- promote_rw
- provision
- provision_requires
- rcmd
- restart
- restart_delay
- rootfs
- scsireserv
- shared
- standby
- start_requires
- start_timeout
- stat_timeout
- stop_requires
- stop_timeout
- subset
- tags
- template
- template_options
- type
- unprovision
- unprovision_requires

## Keyword `blocking_post_provision`

	required:    false
	scopable:    true
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute after the resource `provision` action.

Errors interrupt the action.

This trigger is only executed on leaders.


## Keyword `blocking_post_start`

	required:    false
	scopable:    true
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute after the resource `start` action.

Errors interrupt the action.


## Keyword `blocking_post_stop`

	required:    false
	scopable:    true
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute after the resource `stop` action.

Errors interrupt the action.


## Keyword `blocking_post_unprovision`

	required:    false
	scopable:    true
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute after the resource `unprovision` action.

Errors interrupt the action.

This trigger is only executed on leaders.


## Keyword `blocking_pre_provision`

	required:    false
	scopable:    true
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute before the resource `provision` action.

Errors interrupt the action.


## Keyword `blocking_pre_start`

	required:    false
	scopable:    true
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute before the resource `start` action.

Errors interrupt the action.


## Keyword `blocking_pre_stop`

	required:    false
	scopable:    true
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute before the resource `stop` action.

Errors interrupt the action.


## Keyword `blocking_pre_unprovision`

	required:    false
	scopable:    true
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute before the resource `unprovision` action.

Errors interrupt the action.


## Keyword `cf`

	required:    false
	scopable:    false
	provision:   used only by the provision of the resource
	rbac:        A keyword of the lxc driver, which needs the root grant to choose.

**Example:**

	cf=/srv/svc1/config

**Description:**

Defines a lxc configuration file in a non-standard location.

The path is a path of the node, as `/srv/app/run.sh`, or a path in a volume or
a filesystem of the service, as `volume#1:/run.sh` in the resource `volume#1`,
or a path in a vol of the namespace, as `app-data/run.sh`.


## Keyword `comment`

	required:    false
	scopable:    false

**Description:**

A free form text describing the role of the object, of the node, or of the
section it is set in.

The keyword is accepted in any section, so the DEFAULT section can document a
configuration as a whole, and a resource, pool, heartbeat, array or network
section can document itself.

The agent does not interpret the value.


## Keyword `create_configs_environment`

	required:    false
	scopable:    true
	deprecated:  since v3.0.0-rc57, replaced by create_environment
	provision:   used only by the provision of the resource
	convert:     shlex
	rbac:        A keyword of the lxc driver, which needs the root grant to choose.

**Example:**

	create_configs_environment=CRT=cert1/server.crt PEM=cert1/server.pem

**Description:**

Set variables in the `lxc-create` execution environment.

A whitespace separated list of `<var>=<cfg name>/<key path>`.

A shell expression splitter is applied, so double quotes can be around
`<cfg name>/<key path>` only or whole `<var>=<cfg name>/<key path>`.


## Keyword `create_environment`

	required:    false
	scopable:    true
	provision:   used only by the provision of the resource
	convert:     shlex
	rbac:        A keyword of the lxc driver, which needs the root grant to choose.

**Example:**

	create_environment=FOO=bar BAR=baz

**Description:**

Set variables in the `lxc-create` execution environment.

A whitespace-separated list of variables: `<var>=<value>`, or
`<var> from <path> key <key>` to read the value from the key of a sec or a cfg.

A shell expression splitter is applied, so double quotes can be around
`<value>` only or whole `<var>=<value>`.

The path of a datastore is the one of an install line: `./sec/oc3` is the sec
named oc3 in the namespace of the object, `other/cfg/oc3` a cfg of another
namespace, which has to allow it. A variable read from a sec is a secret.

A `*` in `<var>` stands for the key, and a key pattern names a variable per key
matching: `* from ./sec/oc3 key db_*` sets a variable named after each key
starting with db_, and `OC3_* from ./cfg/oc3 key *` one per key, prefixed with
OC3_.

Example:

	create_environment = SLIP=slob
	    OC3_DB_PASSWORD from ./sec/oc3 key db_password
	    OC3_FOO from ./cfg/oc3 key bar

A datastore or a key not existing is logged, and the variable not set.


## Keyword `create_secrets_environment`

	required:    false
	scopable:    true
	deprecated:  since v3.0.0-rc57, replaced by create_environment
	provision:   used only by the provision of the resource
	convert:     shlex
	rbac:        A keyword of the lxc driver, which needs the root grant to choose.

**Example:**

	create_secrets_environment=CRT=cert1/server.crt PEM=cert1/server.pem

**Description:**

Set variables in the `lxc-create` execution environment.

A whitespace separated list of `<var>=<sec name>/<key path>`.

A shell expression splitter is applied, so double quotes can be around
`<sec name>/<key path>` only or whole `<var>=<sec name>/<key path>`.


## Keyword `data_dir`

	required:    false
	scopable:    true
	aliases:     container_data_dir
	stop first:  a change is refused while the resource is up
	rbac:        A keyword of the lxc driver, which needs the root grant to choose.

**Example:**

	data_dir=/srv/svc1/data/containers

**Description:**

If this keyword is set, the service configures a resource-private container
data store.

This setup is required for stateful service relocalization.

The path is a path of the node, as `/srv/app/run.sh`, or a path in a volume or
a filesystem of the service, as `volume#1:/run.sh` in the resource `volume#1`,
or a path in a vol of the namespace, as `app-data/run.sh`.


## Keyword `disable`

	required:    false
	scopable:    true
	convert:     bool

**Description:**

A disabled resource will be ignored on `start`, `stop`, `provision` and
`unprovision` actions.

A disabled resource status is `n/a`.

If set in the `DEFAULT` section of an object, the object is disabled and
ignores `start`, `stop`, `shutdown`, `provision` and `unprovision` actions.

These actions immediately return success.

`om <path> disable` sets `DEFAULT.disable=true`.

`om <path> enable` sets `DEFAULT.disable=false`.

> **Note**: The `enable` and `disable` actions preserve the individual
  resource `disable` state.


## Keyword `encap`

	required:    false
	scopable:    false
	convert:     bool

**Description:**

Set to `true` to ignore this resource in the nodes context and consider it in the encapnodes context. The resource is thus handled by agents deployed in the service containers.


## Keyword `guest_os`

	required:    false
	scopable:    true
	aliases:     guestos
	candidates:  unix, windows
	default:     unix
	rbac:        A keyword of the lxc driver, which needs the root grant to choose.

**Example:**

	guest_os=unix

**Description:**

The name of the operating system in the virtual machine.


## Keyword `hostname`

	required:    false
	scopable:    true
	rbac:        A keyword of the lxc driver, which needs the root grant to choose.

**Example:**

	hostname=nginx1

**Description:**

Set the container hostname. If not set, the container `name` is used.


## Keyword `monitor`

	required:    false
	scopable:    true
	convert:     bool

**Description:**

A resource with `monitor=true` will trigger the `monitor_action`
(crash or reboot the node, freezestop or switch the service) if:

* The resource is `down`.

* The instance has `local_expect=started` in its daemon monitor data, which
  means the daemon considers this instance is and should remain started.

* All restart tentatives failed.


## Keyword `name`

	required:    true
	scopable:    true
	stop first:  a change is refused while the resource is up
	rbac:        A container name of the user's choosing requires the root grant: the default name is the object's own.

**Description:**

The name to assign to the container.


## Keyword `no_preempt_abort`

	required:    false
	scopable:    true
	convert:     bool

**Description:**

If `true`, the agent will preempt the scsi3 persistent reservation with a `preempt`
command instead of a `preempt and and abort`.

Some scsi target implementations do not support `preempt and and abort` (esx).


## Keyword `optional`

	required:    false
	scopable:    true
	convert:     bool

**Description:**

Action errors on optional resources are logged but do not interrupt the action sequence.

The status of optional resources is not included in the instance availability status but is considered in the overall status.

The status of task and sync resources is always included in the overall status, regardless of whether they are marked as optional.

Resources tagged as `noaction` are considered optional by default.

Dump filesystems are a typical use case for optional=true.


## Keyword `osvc_root_path`

	required:    false
	scopable:    true
	rbac:        A keyword of the lxc driver, which needs the root grant to choose.

**Example:**

	osvc_root_path=/opt/opensvc

**Description:**

If the OpenSVC agent is installed via package in the container, this keyword
must not be set.

Else the value can be set to the fullpath hosting the agent installed from
sources.


## Keyword `pg_blkio_weight`

	required:    false
	scopable:    true

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
	convert:     size

**Example:**

	pg_mem_limit=512m

**Description:**

The memory the processes of the group may use, in bytes.

The Out-Of-Memory killer is triggered in case of tresspassing.

Setting this keyword to `default` puts the capping back where a node that
never capped anything leaves it. Removing the keyword does not: what was
written stays written, whether om wrote it or something else did.


## Keyword `pg_mem_oom_control`

	required:    false
	scopable:    true

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
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute after the resource `provision` action.

Errors do not interrupt the action.

This trigger is only executed on leaders.


## Keyword `post_start`

	required:    false
	scopable:    true
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute after the resource `start` action.

Errors do not interrupt the action.


## Keyword `post_stop`

	required:    false
	scopable:    true
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute after the resource `stop` action.

Errors do not interrupt the action.


## Keyword `post_unprovision`

	required:    false
	scopable:    true
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute after the resource `unprovision` action.

Errors do not interrupt the action.

This trigger is only executed on leaders.


## Keyword `pre_provision`

	required:    false
	scopable:    true
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute before the resource `provision` action.

Errors do not interrupt the action.


## Keyword `pre_start`

	required:    false
	scopable:    true
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute before the resource `start` action.

Errors do not interrupt the action.


## Keyword `pre_stop`

	required:    false
	scopable:    true
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute before the resource `stop` action.

Errors do not interrupt the action.


## Keyword `pre_unprovision`

	required:    false
	scopable:    true
	rbac:        Triggers require the root grant.

**Description:**

A command or script to execute before the resource `unprovision` action.

Errors do not interrupt the action.


## Keyword `prkey`

	required:    false
	scopable:    true
	default:     {node.node.prkey}

**Description:**

A specific scsi3 persistent reservation key for the resource.

It overrides the object-level `prkey` and the node-level `prkey`.


## Keyword `promote_rw`

	required:    false
	scopable:    true
	convert:     bool
	rbac:        A keyword of the lxc driver, which needs the root grant to choose.

**Description:**

If `true`, OpenSVC will try to promote the base devices to read-write on
`start` actions.


## Keyword `provision`

	required:    false
	scopable:    false
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

**Example:**

	provision_requires=ip#0 fs#0(down,stdby down)

**Description:**

A whitespace-separated list of conditions to meet to accept a 'provision'
action.

A condition is expressed as `<rid>(<state>,...)`.

If states are omitted, `up,stdby up` is used as the default expected states.


## Keyword `rcmd`

	required:    false
	scopable:    true
	convert:     shlex
	rbac:        A keyword of the lxc driver, which needs the root grant to choose.

**Example:**

	rcmd=lxc-attach -e -n osvtavnprov01 -- 

**Description:**

The command to wrap another command to execute it in the container.


## Keyword `restart`

	required:    false
	scopable:    true
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
	default:     500ms
	convert:     duration

**Description:**

The minimum delay between two restart tentatives on the resource.


## Keyword `rootfs`

	required:    false
	scopable:    false
	provision:   used only by the provision of the resource
	rbac:        A keyword of the lxc driver, which needs the root grant to choose.

**Example:**

	rootfs=/srv/svc1/data/containers

**Description:**

Sets the root fs directory of the container.

The path is a path of the node, as `/srv/app/run.sh`, or a path in a volume or
a filesystem of the service, as `volume#1:/run.sh` in the resource `volume#1`,
or a path in a vol of the namespace, as `app-data/run.sh`.


## Keyword `scsireserv`

	required:    false
	scopable:    false
	convert:     bool

**Description:**

If `true`, try to acquire a type-5 (write exclusive, registrant only) scsi3
persistent reservation on every path to every disk used by this resource.

Existing reservations are preempted to not block service failover.

If the `start` was not legitimate the data are still protected from being
written concurrently from all nodes.


## Keyword `shared`

	required:    false
	scopable:    true
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

**Example:**

	start_requires=ip#0 fs#0(down,stdby down)

**Description:**

A whitespace-separated list of conditions to meet to accept a 'start'
action.

A condition is expressed as `<rid>(<state>,...)`.

If states are omitted, `up,stdby up` is used as the default expected states.


## Keyword `start_timeout`

	required:    false
	scopable:    true
	default:     4m
	convert:     duration
	rbac:        A keyword of the lxc driver, which needs the root grant to choose.

**Example:**

	start_timeout=1m5s

**Description:**

Wait for `<duration>` before declaring the container action a failure.


## Keyword `stat_timeout`

	required:    false
	scopable:    true
	convert:     duration

**Description:**

The fs resources status evaluation includes a stat syscall test.
This keyword defines the maximum wait time for those stat calls to respond.

When expired, the resource status is degraded is to warn, which can trigger
a monitor action (reboot or crash the node) if the resource is monitored.


## Keyword `stop_requires`

	required:    false
	scopable:    false

**Example:**

	stop_requires=ip#0 fs#0(down,stdby down)

**Description:**

A whitespace-separated list of conditions to meet to accept a 'stop'
action.

A condition is expressed as `<rid>(<state>,...)`.

If states are omitted, `up,stdby up` is used as the default expected states.


## Keyword `stop_timeout`

	required:    false
	scopable:    true
	default:     2m
	convert:     duration
	rbac:        A keyword of the lxc driver, which needs the root grant to choose.

**Example:**

	stop_timeout=2m30s

**Description:**

Wait for `<duration>` before declaring the container action a failure.


## Keyword `subset`

	required:    false
	scopable:    true

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
	convert:     set

**Description:**

A whitespace-separated list of tags.

Tags can be used for resource selection by tag.

Some tags can influence the driver behaviour:

* `noaction`

  Skip any state changing action on the resource and imply `optional=true`.

* `nostatus`

  Force the status `n/a`.


## Keyword `template`

	required:    false
	scopable:    false
	provision:   used only by the provision of the resource
	rbac:        A keyword of the lxc driver, which needs the root grant to choose.

**Example:**

	template=ubuntu

**Description:**

Sets the url of the template unpacked into the container root fs or the name
of the template passed to `lxc-create`.


## Keyword `template_options`

	required:    false
	scopable:    false
	provision:   used only by the provision of the resource
	convert:     shlex
	rbac:        A keyword of the lxc driver, which needs the root grant to choose.

**Example:**

	template_options=--release focal

**Description:**

The arguments to pass through `lxc-create` to the per-template script.


## Keyword `type`

	required:    false
	scopable:    false
	rbac:        Requires the root grant, except for the values oci, docker, podman, kvm.

**Description:**

The resource driver name.


## Keyword `unprovision`

	required:    false
	scopable:    false
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

**Example:**

	unprovision_requires=ip#0 fs#0(down,stdby down)

**Description:**

A whitespace-separated list of conditions to meet to accept a 'unprovision'
action.

A condition is expressed as `<rid>(<state>,...)`.

If states are omitted, `up,stdby up` is used as the default expected states.


