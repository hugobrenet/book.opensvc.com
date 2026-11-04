# Driver `container.docker`

**Minimal configlet:**

	[container#1]
	type = docker

**Minimal setup command:**

	om test/svc/foo set --kw="type=docker"

**Supported keywords:**

- blocking_post_provision
- blocking_post_start
- blocking_post_stop
- blocking_post_unprovision
- blocking_pre_provision
- blocking_pre_start
- blocking_pre_stop
- blocking_pre_unprovision
- command
- comment
- configs_environment
- cwd
- detach
- devices
- disable
- dns
- dns_search
- encap
- entrypoint
- environment
- guest_os
- hostname
- image
- image_pull_policy
- init
- interactive
- ipcns
- log_outputs
- monitor
- name
- netns
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
- pidns
- post_provision
- post_start
- post_stop
- post_unprovision
- pre_provision
- pre_start
- pre_stop
- pre_unprovision
- privileged
- prkey
- provision
- provision_requires
- pull_timeout
- quiesce
- quiesce_input
- quiesce_ready
- quiesce_timeout
- read_only
- registry_creds
- restart
- restart_delay
- resume_input
- rm
- run_args
- scsireserv
- secrets_environment
- shared
- standby
- start_requires
- start_timeout
- stat_timeout
- stop_requires
- stop_timeout
- subset
- sysctl
- tags
- tty
- type
- unprovision
- unprovision_requires
- user
- userns
- utsns
- uxgrant
- volume_mounts

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


## Keyword `command`

	required:    false
	scopable:    true
	aliases:     run_command
	convert:     shlex

**Example:**

	command=/opt/tomcat/bin/catalina.sh

**Description:**

The command to execute in the docker container on run.


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


## Keyword `configs_environment`

	required:    false
	scopable:    true
	deprecated:  since v3.0.0-rc57, replaced by environment
	convert:     shlex

**Example:**

	configs_environment=PORT=http/port webapp/app1* {name}/* {name}-debug/settings

**Description:**

A whitespace-separated list of `<var>=<cfg name>/<key path>` or
`<cfg name>/<key matcher>`.

If the `cfg` or config key doesn't exist then `start` and `stop` actions on
the resource will fail with a non 0 exit code.

A shell expression splitter is applied, so double quotes can be around
`<cfg name>/<key path>` only or whole `<var>=<cfg name>/<key path>`.

Example with,

* `<ns>/cfg/nginx` a config having a `user` key with value `user1`.

* `<ns>/cfg/cfg1` a config having a `key1` key with value `val1`.

`configs_environment = NGINX_USER=nginx/user cfg1/*` creates the following
variables in the container command execution environment:

	NGINX_USER=user1
	key1=val1



## Keyword `cwd`

	required:    false
	scopable:    true

**Example:**

	cwd=/opt/foo

**Description:**

The current working directory set for the executed command.


## Keyword `detach`

	required:    false
	scopable:    true
	default:     true
	convert:     bool

**Description:**

Run container in background.

Set to `false` only for init containers, alongside `start_timeout` and the `nostatus` tag.


## Keyword `devices`

	required:    false
	scopable:    true
	convert:     shlex
	rbac:        Host devices in container require the root grant.

**Example:**

	devices=myvol1:/dev/xvda myvol2:/dev/xvdb

**Description:**

The whitespace-separated list of `<host devpath>:<containerized devpath>`
exposing host devices as container devices.


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


## Keyword `dns`

	required:    false
	scopable:    true
	convert:     list
	rbac:        Requires the root grant.

**Example:**

	dns=1.1.1.1 8.8.8.8

**Description:**

The whitespace-separated list of nameservers to add to the resolver of the
container, after the nameservers of the cluster.

om writes the `/etc/resolv.conf` of the container itself and mounts it, so the
`--dns` argument of the container engine is not used and one set in `run_args`
is dropped.

A resolver reads the first three nameservers of a file and ignores the rest, so
a cluster already naming three leaves no room here, and the ones dropped are
named in a warning at start.


## Keyword `dns_search`

	required:    false
	scopable:    true
	convert:     list
	rbac:        Requires the root grant.

**Example:**

	dns_search=opensvc.com

**Description:**

The whitespace-separated list of DNS domains to search for shortname lookups.

If empty or not set, the list is the domain of the object and each of the
parents of that domain: `<namespace>.<kind>.<clustername>
<kind>.<clustername> <clustername>`. A shortname is therefore looked up in
the namespace of the object first, then in its kind, then in the cluster.

The fqdn of the object is not in that list. The hostname of a container is
published in the cluster zone as `<hostname>.<objectfqdn>`, so reaching a
container of the same object by its hostname alone takes naming that fqdn
here. Containers of an instance are expected to share a netns, which is the
layout the ip drivers are written for, and to reach each other over
127.0.0.1, which needs no name at all.


## Keyword `encap`

	required:    false
	scopable:    false
	convert:     bool

**Description:**

Set to `true` to ignore this resource in the nodes context and consider it in the encapnodes context. The resource is thus handled by agents deployed in the service containers.


## Keyword `entrypoint`

	required:    false
	scopable:    true
	convert:     shlex

**Example:**

	entrypoint=/bin/sh

**Description:**

The script or binary executed in the container.

The entrypoint args must be set in `command`.


## Keyword `environment`

	required:    false
	scopable:    true
	convert:     shlex

**Example:**

	environment=KEY=cert1/server.key PASSWORD=db/password

**Description:**

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

	environment = SLIP=slob
	    OC3_DB_PASSWORD from ./sec/oc3 key db_password
	    OC3_FOO from ./cfg/oc3 key bar

A datastore or a key not existing is logged, and the variable not set.


## Keyword `guest_os`

	required:    false
	scopable:    true
	aliases:     guestos
	candidates:  unix, windows
	default:     unix

**Example:**

	guest_os=unix

**Description:**

The name of the operating system in the virtual machine.


## Keyword `hostname`

	required:    false
	scopable:    true

**Example:**

	hostname=nginx1

**Description:**

Set the container hostname. If not set, a unique id is used.


## Keyword `image`

	required:    false
	scopable:    true
	aliases:     run_image
	default:     ghcr.io/opensvc/pause
	rbac:        An image starting with a '-' requires the root grant.

**Description:**

The docker image pull, and run the container with.


## Keyword `image_pull_policy`

	required:    false
	scopable:    true
	candidates:  once, always

**Example:**

	image_pull_policy=once

**Description:**

The docker image pull policy.

* `always`

  Pull upon each container start.

* `once`

  Pull if not already pulled (default).


## Keyword `init`

	required:    false
	scopable:    true
	default:     true
	convert:     bool

**Description:**

Run an init inside the container that forwards signals and reaps processes.


## Keyword `interactive`

	required:    false
	scopable:    true
	convert:     bool

**Description:**

Keep stdin open even if not attached.

To use if the container entrypoint is a shell.


## Keyword `ipcns`

	required:    false
	scopable:    true

**Example:**

	ipcns=container#0

**Description:**

* empty

  The docker daemon's default value is used.

*  `none`

  Do not mount /dev/shm.

* `private`

  Create a ipcns other containers can not share.


* `shareable`

   Create a ipcns other containers can share.

* `container#<i>`

   Share the `container#<i>` ipcns.


## Keyword `log_outputs`

	required:    false
	scopable:    true
	default:     false
	convert:     bool

**Description:**

Log the container run commands stdout and stderr

Set to `true` to enable logging of container run commands.


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

	required:    false
	scopable:    true
	stop first:  a change is refused while the resource is up
	rbac:        A container name of the user's choosing requires the root grant: the default name is the object's own.

**Default:**

Autogenerated using a `<namespace>..<object name>.container.<resource index>`
template.

**Example:**

	name=osvcprd..rundeck.container.db

**Description:**

The name to assign to the container on `docker run`.

If not set, a `<namespace>..<name>.container.<rid idx>` name is automatically
assigned.


## Keyword `netns`

	required:    false
	scopable:    true
	aliases:     net
	rbac:        The host network namespace requires the root grant.

**Example:**

	netns=container#0

**Description:**

* empty or `none`

  The container has a private netns other `container`, `ip.netns` or
  `ip.cni` resources can share.

* `<rid>`

  The id of the resource that has the network namespace this container joins.

  For example, a container with `netns=container#0` will share the
  `container#0` netns.

* `host`

  Share the host network namespace.


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


## Keyword `pidns`

	required:    false
	scopable:    true

**Example:**

	pidns=container#0

**Description:**

* empty

  The container has a private pidns other containers can share.
  Usually a pidns sharer will run a `pause` image to reap zombies.

* `container#<i>`

  Share  `container#<i>` pidns.

* `host`

  Share the host's pidns.


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


## Keyword `privileged`

	required:    false
	scopable:    true
	convert:     bool
	rbac:        A privileged container requires the root grant.

**Description:**

Give extended privileges to the container.


## Keyword `prkey`

	required:    false
	scopable:    true
	default:     {node.node.prkey}

**Description:**

A specific scsi3 persistent reservation key for the resource.

It overrides the object-level `prkey` and the node-level `prkey`.


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


## Keyword `pull_timeout`

	required:    false
	scopable:    true
	default:     2m
	convert:     duration

**Example:**

	pull_timeout=2m

**Description:**

Wait for `<duration>` before declaring the container action a failure.


## Keyword `quiesce`

	required:    false
	scopable:    true

**Example:**

	quiesce=pause

**Description:**

How the writes of the container are suspended during a run of a sync resource
of the object, for the data it saves to be consistent: the processes of the
container frozen with `pause`, using the engine's pause and unpause, or a
command run in the container with `sh -c`. Nothing by default.

A command ends before the run, as a flush, unless `quiesce_ready` is set: it is
then a session held open during the run, as a database client holding a lock,
and ended at the resume. A command that fails, or a session not ready within
`quiesce_timeout`, aborts the run, and what was quiesced is resumed.

It runs in the container, so a namespace admin sets it.


## Keyword `quiesce_input`

	required:    false
	scopable:    true

**Example:**

	quiesce_input=FLUSH TABLES WITH READ LOCK; SELECT 'quiesced';

**Description:**

What the quiesce command reads on its stdin when it starts, as the statements
a database client runs. Variables expand in the container, so a password read
from its environment never shows in the configuration or a process list.


## Keyword `quiesce_ready`

	required:    false
	scopable:    true

**Example:**

	quiesce_ready=quiesced

**Description:**

A text the quiesce command prints on its stdout once the writes are
suspended: the quiesce is then a session held open until the resume, as a
database lock lasts only while the client holding it is connected. The run
starts once a line holds it, within `quiesce_timeout`.

If om ends before the resume, the session's stdin closes, the command exits,
and a lock it held drops by itself.


## Keyword `quiesce_timeout`

	required:    false
	scopable:    true
	default:     30s
	convert:     duration

**Example:**

	quiesce_timeout=1m

**Description:**

How long a quiesce command may take to end, or a session to say it is ready
and to end at the resume.


## Keyword `read_only`

	required:    false
	scopable:    true
	convert:     tristate

**Description:**

Mount the container's root filesystem as read only.


## Keyword `registry_creds`

	required:    false
	scopable:    true

**Example:**

	registry_creds=creds-registry-opensvc-com

**Description:**

The name of a secret in the same namespace having a `config.json` key which
value is used to login to the container image registry.

If not specified, the node-level registry credential store is used.


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


## Keyword `resume_input`

	required:    false
	scopable:    true

**Example:**

	resume_input=UNLOCK TABLES;

**Description:**

What the quiesce session reads on its stdin at the resume, before its stdin is
closed and it is waited for, as the statement releasing a lock.


## Keyword `rm`

	required:    false
	scopable:    true
	convert:     bool

**Example:**

	rm=false

**Description:**

If rm=true, the container instance is removed when the resource is stopped.
If detach=false, the driver automatically behaves as if rm=true.

## Keyword `run_args`

	required:    false
	scopable:    true
	convert:     shlex
	rbac:        Requires the root grant.

**Example:**

	run_args=-v /opt/docker.opensvc.com/vol1:/vol1:rw -p 37.59.71.25:8080:8080

**Description:**

Extra arguments to pass to the docker run command, like volume and port
mappings.


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


## Keyword `secrets_environment`

	required:    false
	scopable:    true
	deprecated:  since v3.0.0-rc57, replaced by environment
	convert:     shlex

**Example:**

	secrets_environment=CRT=cert1/server.pem sec1/*

**Description:**

A whitespace-separated list of `<var>=<sec name>/<key path>` or
`<sec name>/<key matcher>`.

If the `sec` or secret key doesn't exist then `start` and `stop` actions on
the resource will fail with a non 0 exit code.

A shell expression splitter is applied, so double quotes can be around
`<sec name>/<key path>` only or whole `<var>=<sec name>/<key path>`.

Example with,

* `<ns>/sec/cert1` a secret having a `server.pem` key with value `mycrt`.

* `<ns>/sec/sec1` a secret having a `key1` key with value `val1`.

`secrets_environment = CRT=cert1/server.pem sec1/*` creates the following
variables in the container command execution environment:

	CRT=mycrt
	key1=val1



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
	default:     5s
	convert:     duration

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
	default:     10s
	convert:     duration

**Example:**

	stop_timeout=2m

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


## Keyword `sysctl`

	required:    false
	scopable:    true
	convert:     shlex

**Example:**

	sysctl=kernel.shm_rmid_forced=1 net.ipv4.tcp_syncookies=1

**Description:**

Set namespaced kernel tunables exposed via sysctl.


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


## Keyword `tty`

	required:    false
	scopable:    true
	convert:     bool

**Description:**

Allocate a pseudo-tty.


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


## Keyword `user`

	required:    false
	scopable:    true

**Example:**

	user=guest

**Description:**

The user that will run the command inside the container.

Also support the `<user>:<group>` syntax.


## Keyword `userns`

	required:    false
	scopable:    true

**Example:**

	userns=container#0

**Description:**

If not set, the container will have a private userns other containers can
share.

A container with `userns=host` will share the host's userns.


## Keyword `utsns`

	required:    false
	scopable:    true
	candidates:  , host

**Example:**

	utsns=container#0

**Description:**

* empty

  The container has a private utsns.

* `host`

  The container shares the host's hostname.


## Keyword `uxgrant`

	required:    false
	scopable:    true
	convert:     listlowercase
	rbac:        Requires the root grant.

**Example:**

	uxgrant=operator:ns1

**Description:**

The grants of the processes of the container connected to the user socket
of the node, `/run/opensvc-ux/http.sock`, bind mounted into the container:
the same grants as the `grant` keyword of a `usr` object.

The daemon tells a process of the container by its cgroup, which the
container runtime places under the process group of the resource, and a
process of the container can not leave: neither its uid nor a token is
looked at. A sidecar can so act on the cluster with the grants given here,
with no credential to hand it.

Setting it requires the root grant.


## Keyword `volume_mounts`

	required:    false
	scopable:    true
	convert:     shlex
	rbac:        Host path mounts in container require the root grant.

**Example:**

	volume_mounts=myvol1:/vol1 myvol2:/vol2:rw /localdir:/data:ro

**Description:**

The whitespace-separated list of `<source>:<containerized mount path>:<mount options>`.

The source is one of:

* `/srv/data`, a directory of the node.
* `volume#1:/etc/nginx`, a directory or a file in the resource `volume#1` of
  the service, a volume or a filesystem, under its mount point.
* `web-cfg/etc/nginx`, a directory or a file in the vol `web-cfg` of the
  namespace, under its mount point.
* `tmpfs`, a memory filesystem of the container's own, which the engine
  mounts at the start and discards at the stop: `tmpfs:/var/lib/app` or
  `tmpfs:/var/lib/app:size=16m,mode=0750`. The `<mount options>` are the ones
  of a tmpfs. The memory it holds counts in the one of the container, which
  its memory limit bounds.

When the source is a directory of the node, the default `<mount option>` is `rw`.

When the source is in a volume, the default `<mount option>` is taken from the
volume access.

A source in a volume is handed to the engine as a bind mount of its own,
private by default: a mount made in the volume after the container started
does not reach it. The `<mount options>` of the entry ask for the mounts to
cross, within the volume:

* `rshared` lets a mount made in the container reach the volume, and the
  other containers using it, as a sidecar mounting a FUSE filesystem, an S3
  bucket for example, does. Making a mount needs a `privileged` container.
* `rslave` lets the mounts made in the volume reach the container, and none
  go back, as a container using what a sidecar mounts there needs when it
  starts before the mount is made.

The engine refuses either on a volume whose own mount is private.

Only the container making the mount asks `rshared`: when a container stops,
its staging mount goes, and with a shared one the mounts made on it go from
the volume and from every container using it. Those of a sidecar die with
it anyway. A container using them asks `rslave`, and leaves them to the
others when it stops.


