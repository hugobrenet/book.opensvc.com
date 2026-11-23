# Driver `fs.msdos`

**Minimal configlet:**

	[fs#1]
	type = msdos
	mnt = /srv/{fqdn}

**Minimal setup command:**

	om test/vol/foo set \
		--kw="type=msdos" \
		--kw="mnt=/srv/{fqdn}"

**Supported keywords:**

- blocking_post_provision
- blocking_post_start
- blocking_post_stop
- blocking_post_unprovision
- blocking_pre_provision
- blocking_pre_start
- blocking_pre_stop
- blocking_pre_unprovision
- check_read
- comment
- configs
- dev
- directories
- dirperm
- disable
- encap
- group
- install
- mkfs_opt
- mnt
- mnt_opt
- monitor
- no_preempt_abort
- optional
- perm
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
- restart
- restart_delay
- scsireserv
- secrets
- shared
- signal
- standby
- start_requires
- stat_timeout
- stop_requires
- subset
- tags
- type
- unprovision
- unprovision_requires
- user
- zone

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


## Keyword `check_read`

	required:    false
	scopable:    true
	group:       status
	default:     false
	convert:     bool
	rbac:        A resource of a volume requires the root grant.

**Description:**

Activate file system read check during status evaluation when the
file system is mounted but file system write check is disabled.

This can help detection of nfs stale file systems.
It is ignored when mnt_opt contains 'nointr'.
The file system read check is: 'timeout {stat_timeout} stat -f {mnt}'
The file system write check is disabled when fs_type is a network file system or
when mnt_opt contains 'ro'.


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


## Keyword `configs`

	required:    false
	scopable:    true
	group:       install
	deprecated:  since v3.0.0-rc62, replaced by install
	convert:     shlex
	rbac:        A resource of a volume requires the root grant.

**Example:**

	configs=conf/mycnf:/etc/mysql/my.cnf:ro conf/sysctl:/etc/sysctl.d/01-db.conf

**Description:**

The whitespace-separated list of
`<config name>/<key>:<volume relative path>:<options>`.


## Keyword `dev`

	required:    false
	scopable:    true
	group:       device
	stop first:  a change is refused while the resource is up
	default:     none
	rbac:        A resource of a volume requires the root grant.

**Example:**

	dev=/dev/disk/by-id/nvme-eui.002538ba11b75ec8

**Description:**

The block device file or filesystem image file hosting the filesystem to mount.

The device is written as the other devices of a service are: `/dev/sdb` is a
device of the node, `data` the device a vol of the namespace exposes, and
`disk#1` the device a resource of the service exposes, which must expose one
device.

A different device can be set up on different nodes using the `dev@<nodename>`
scoping syntax.


## Keyword `directories`

	required:    false
	scopable:    true
	group:       install
	deprecated:  since v3.0.0-rc62, replaced by install
	convert:     list
	rbac:        A resource of a volume requires the root grant.

**Example:**

	directories=a/b/c d /e

**Description:**

The whitespace-separated list of directories to create in the `vol` head.


## Keyword `dirperm`

	required:    false
	scopable:    true
	group:       permissions
	convert:     filemode
	rbac:        A resource of a volume requires the root grant.

**Default:**

The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

**Example:**

	dirperm=750

**Description:**

The permissions, in octal notation, of the directories installed in the
volume: the ones of the `directories` keyword, the ones of the `install`
lines ending with a `/`, and the volume root, applied at each install.

The volume root is given this mode, with the owner of the `user` and `group`
keywords, unless an `install` line names it, as `/ mode 0750 user 70`, which
sets the root alone. A container not run as root needs a root its user can
traverse.


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


## Keyword `group`

	required:    false
	scopable:    true
	group:       permissions
	rbac:        A resource of a volume requires the root grant.

**Example:**

	group=1001

**Description:**

The group name or id owning the files and directories installed in the
volume, and the volume root, at each install: with `dirperm` or `perm` set,
along with the mode of the root, and alone otherwise, the mode of the root
then left as it is. An `install` line naming the root, as `/ group 70`, sets
its group instead.


## Keyword `install`

	required:    false
	scopable:    true
	group:       install
	convert:     shlex
	rbac:        A resource of a volume requires the root grant.

**Example:**

	install=
		/etc/ mode 0750 user 1000 group 1000
		/etc/ssl/ mode 0700 user 1000 group 1000
		/etc/ from test/cfg/haproxy key haproxy.cfg mode 0640 user 1000 group 1000 signal HUP:container#haproxy
		/etc/ssl/front.pem from ./sec/d key fullpem mode 0640 user 1000 group 1001 required
		/etc/ssl/front.chain from ./sec/d key certificate_chain required
		/etc/profile.d/ from ./sec/d key etc/profile.d/*
		/etc/ssl/certs/*.pem from ./sec/web-* key fullpem signal HUP:container#haproxy
		/init/nfs from ./cfg/{name} key init/nfs mode 0755 source https://raw.githubusercontent.com/opensvc/opensvc_templates/refs/heads/main/nfs/script
		/init/backup from ./cfg/{name} key init/backup mode 0755 source /tmp/scripts/backup.sh
		/run/secrets/db_password from ./sec/{name} key db_password source random
		/init/config.sh from ./cfg/{name} key init/config.sh mode 0755 source https://example.com/templates/config.sh template
		/web/html/index.html.gz required source https://github.com/opensvc/oc3-frontend/releases/latest/download/index.html.gz
		/data/

**Description:**

A list of files and directories to install in the volume from cfg and sec keys, or fetched from an https url.

	<path> from <obj_path|obj_relpath> [key <key>] [mode <mode>] [user <user>] [group <group>] [signal <sig>:<rid>] [source <uri>] [template] [required]
	<path> source <https_url> [sha256 <hex>] [mode <mode>] [user <user>] [group <group>] [signal <sig>:<rid>] [required]
	<path> [mode <mode>] [user <user>] [group <group>] [signal <sig>:<rid>]

Where:

* `<path>` (e.g. `/init/installed`, `/init/`)
  * must start with a `/`.
  * is relative to the target resource head.
  * is considered a directory if it ends with a `/` or if both `from <obj_path|obj_relpath>` and `source` are omitted.
  * is a file fetched from the url if `source <https_url>` is given and `from <obj_path|obj_relpath>` omitted.
  * content is copied from the value of the key referenced by `from <obj_path|obj_relpath>`.
  * if `key <key>` is not specified, the key name defaults to the `<path>` with the leading `/` stripped.
    e.g. `fs#1.install = /a/b from ./sec/sec1` will install `<fs#1 head>/a/b` from the `./sec/sec1` key named `a/b`.

* `<obj_path>` (e.g. `ns1/sec/d`)
  * is the absolute path of the datastore to install keys from. Note that if the datastore and
    the installing object namespaces are different, the datastore must explicitely share its keys with
    the installing object.

* `<obj_relpath>` (e.g. `./sec/d`)
  * is the path of the datastore to install keys from, relative to the installing object namespace.

* a `*` in the name of `<obj_path|obj_relpath>` (e.g. `./sec/haproxy-*`)
  * installs the keys of each sec or cfg of the namespace whose name matches, the `*` matching one character or
    more. A datastore of another namespace is installed from when it shares its keys with the installing object.
  * the `<path>` holds a `*` too, replaced for each datastore by the part of its name the `*` matched: so the
    files of the datastores are told apart.
    e.g. `/certs/*.pem from ./sec/haproxy-* key fullpem` installs the `fullpem` key of `./sec/haproxy-www.example.com`
    as `<head>/certs/www.example.com.pem`, and `/tenants/*/ from ./cfg/tenant-* key conf/*` installs the `conf/*` keys
    of `./cfg/tenant-a` in `<head>/tenants/a/`.
  * a datastore created is installed from at its first key added, and the files of a datastore deleted are removed.
  * `required` fails the install when no datastore matches.

* `key <key>`
  * `<key>` is the key name or a globbing pattern from `<obj_path|obj_relpath>`.
  * the file a key installed is removed when the key is, at the next install, and so are the files of a line
    taken away from `install`: a file the line did not install, as one written there by hand, stays.
  * if not specified, defaults to the `<path>` with the leading `/` stripped.
    e.g. `fs#1.install = /a/b from ./sec/sec1` will install `<fs#1 head>/a/b` from the `./sec/sec1` key named `a/b`.

* `<mode>`, `<user>`, `<group>` default values are defined by the `perm`, `user` and `group` resource keywords,
  and the `<mode>` of a directory by the `dirperm` resource keyword. Without `perm`, a file from a sec is installed
  with mode `0600`, and a file from a cfg with mode `0644`.

* `<sig>:<rid>` (e.g. `HUP:container#haproxy`)
  * `<sig>` is the signal to send to the target resource `<rid>` processes when the file content is modified,
    or the file removed with its key.

* `required`
  * stop installing items if this item install failed.

* `source <uri>`
  * seed the datastore key with the content of `<uri>`, as it is written: a template is stored as a template.
  * the key is seeded at the provision and the start of the object, and by the install of the resource, at its
    start, its provision or its task run, when the datastore does not hold it. A key already there is never
    written again, whatever the source, and an unprovision leaves it.
  * `source random` generates a password, once, at the provision of the object on its leader node, the datastore
    created in the namespace of the object if needed. The other nodes wait for it to reach them. An install not
    finding it fails, required or not, naming the key and the datastore: no node makes one of its own. An object
    whose resources have nothing to provision, as apps alone, is never provisioned, and its first start fails on
    the key missing: give it a `fs.flag` resource, which the provision provisions.
  * a source seeds a key named: it is refused with a key pattern, as `key conf/*`, which names no key to seed.
    `source random` is refused in the datastores of a pattern, as `from ./sec/haproxy-*`, as a datastore made
    later would never have its key: add the key with each datastore. An `http://`, `https://` or file uri seeds
    the datastores the pattern matches, at each install.
  * an `http://` or `https://` uri is fetched, as the `node.allowed_urls` and SSRF policies allow. Any other uri is
    the path of a regular file of the node, which requires the root grant. `/dev/urandom` is such a path, and
    refused as no regular file: `source random` is the generator.
  * a key two keywords of the object seed from two sources, an install line and an `environment` reference
    included, and a key of a datastore of another namespace, which shares its keys for the object to read them,
    are refused by the validation of the configuration.
  * the write of a key refreshes the services installing from the datastore, on every node it reaches: a refresh
    installs what the datastore holds, and seeds no key.

* `source <https_url>` with no `from <obj_path|obj_relpath>`
  * fetches the file straight into the volume, with no datastore: a file too large for a key, as the web ui of an
    application, e.g. `/web/html/index.html.gz required source https://github.com/opensvc/oc3-frontend/releases/latest/download/index.html.gz`.
  * the url is an `https://` one, whatever the grants of the user: an `http://` url, a path or `random` are refused,
    as they are the sources of a key, which a line names with `from`. The `node.allowed_urls` and SSRF policies apply.
  * `<path>` names the file, and is refused ending with a `/`. `key` and `template` are refused: the file is no key,
    and is installed as it is fetched.
  * the file is fetched at the start, the provision or the install of the resource when it is missing, or when the
    url changed: a start finding the file of the url fetches nothing. A url naming the latest release is not fetched
    again on its own: change it for the url of a version, or delete the file, for the next install to fetch it.
  * the file is written aside and renamed in place once whole, so a fetch failing leaves the file fetched before.
    A fetch over `node.max_install_size`, announced or sent, fails naming the url. `sha256 <hex>` fails a fetch whose
    content is of another sha256.
  * a file kept is checked, at each install, against the `sha256` of the line, else the digest its mark holds,
    else the one the node recorded at its fetch: a file written over since, by a user of the volume or an
    upload a volume keeping no mark let in, is fetched again, with a warning. The file stays root's, readable
    by root alone, until it takes its place, its owner and mode given then.
  * the file is marked installed from the url: an upload does not replace it, and a delete is allowed. A line taken
    away from `install` removes its file, as long as it is the one fetched.
  * a refresh of the datastores, at the write of a key, fetches nothing.
  * `required` fails the install when the fetch fails, naming the url. Else the fetch failing is a warning.
  * `<mode>`, `<user>`, `<group>` default values are the ones of a file of a cfg key.

* `template`
  * the key content is a go template, rendered on each node at each install into the installed file. The key
    keeps the template, so a file says what the node it is installed on knows when it is installed.
  * the data is the [env] section: `{{.foo}}` is replaced by the evaluated value of `env.foo`.
  * the functions are:
    * `ref "<reference>"`: the value of an om reference, written without its braces, evaluated for this node.
      e.g. `{{ref "nodename"}}`, `{{ref "clusternodes"}}`, `{{ref "volume#1.mnt"}}`.
    * `split <string>`: the words of a string, as a list a reference returns.
      e.g. `{{range split (ref "clusternodes")}}{{.}} {{end}}`.
    * `key "<obj_path|obj_relpath>" "<key>"`: the content of a datastore key, the datastore sharing its keys with
      the installing object namespace. The installed file mode is the line's, so a file rendering a sec key
      wants a `mode` as tight as the key's.
    * `network "<name>"`: the network `<name>`, with the fields `name`, `type`, `network`, `peers` and
      `reverse_zones`, named as the api names them. A routed_bridge network lists the other nodes in `peers`, as
      this node reaches them, with the fields `nodename`, `local` and `remote` (the addresses of this node and the
      peer the network joins), `subnet`, `via` (`tunnel` or `route`), and `tunnel` and `tunnel_mode` (the tunnel
      device and its mode, as `ipip`, `ip6ip6` or `gre`, empty when the network is routed to the peer). Other networks list none. `reverse_zones` are the reverse zones of the addresses the network hands
      out, which the cluster nameservers answer for, none when `cluster.dns_reverse` is false: a resolver forwards
      them to the cluster nameservers, e.g. `{{range networks}}{{range .reverse_zones}}{{.}}=10.0.0.1,{{end}}{{end}}`.
    * `networks`: the networks of the node, each as `network` returns it.
    * `tunnels`: the peers the networks of the node reach by a tunnel, each tunnel once, as networks joining the
      same two addresses share one. e.g. `{{range tunnels}}{{.nodename}} {{.local}} {{.remote}}{{end}}`.
  * the file is compared to what the template renders at each install, so the `signal` follows a change of
    what the template reads too, at the next install.
  * a change of a key the `key` function read at the last render installs the file again, on each node, as a
    change of the template key does: a file rendered from a sec follows the sec.

An install writing or removing files, whatever runs it, a start, a provision, a task or a change of a key,
publishes a `FileInstalled` event, and none when it finds them up to date. A task with `on = FileInstalled,rid=<rid>` has
what reads them read them again, e.g. a host task with `container` running `swanctl --load-all`.


## Keyword `mkfs_opt`

	required:    false
	scopable:    true
	group:       creation
	provision:   used only by the provision of the resource
	convert:     shlex
	rbac:        A resource of a volume requires the root grant.

**Description:**

Options to pass to the `mkfs` command called by the `provision` action.


## Keyword `mnt`

	required:    true
	scopable:    true
	group:       mount
	stop first:  a change is refused while the resource is up
	rbac:        A resource of a volume requires the root grant.

**Example:**

	mnt=/srv/{fqdn}

**Description:**

The mount point where to mount the filesystem, an absolute path.

With `zone` set, the path in the container, the filesystem being mounted
under the root directory of that container on the host.


## Keyword `mnt_opt`

	required:    false
	scopable:    true
	group:       mount
	rbac:        A resource of a volume requires the root grant.

**Description:**

The mount options, as they would be defined in the fstab.


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


## Keyword `no_preempt_abort`

	required:    false
	scopable:    true
	group:       reservation
	convert:     bool

**Description:**

If `true`, the agent will preempt the scsi3 persistent reservation with a `preempt`
command instead of a `preempt and and abort`.

Some scsi target implementations do not support `preempt and and abort` (esx).


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


## Keyword `perm`

	required:    false
	scopable:    true
	group:       permissions
	convert:     filemode
	rbac:        A resource of a volume requires the root grant.

**Default:**

If `perm` is not set,
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

**Example:**

	perm=660

**Description:**

The permissions to apply to installed files, in octal notation.

Also used to compute a default value for `dirperm`.

When not set, a file from a sec is installed with mode `0600`, and a file from
a cfg with mode `0644`.


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


## Keyword `prkey`

	required:    false
	scopable:    true
	group:       reservation
	default:     {node.node.prkey}

**Description:**

A specific scsi3 persistent reservation key for the resource.

It overrides the object-level `prkey` and the node-level `prkey`.


## Keyword `promote_rw`

	required:    false
	scopable:    false
	group:       device
	convert:     bool
	rbac:        A resource of a volume requires the root grant.

**Description:**

If `true`, OpenSVC will try to promote the base devices to read-write on
`start` actions.


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


## Keyword `scsireserv`

	required:    false
	scopable:    false
	group:       reservation
	convert:     bool

**Description:**

If `true`, try to acquire a type-5 (write exclusive, registrant only) scsi3
persistent reservation on every path to every disk used by this resource.

Existing reservations are preempted to not block service failover.

If the `start` was not legitimate the data are still protected from being
written concurrently from all nodes.


## Keyword `secrets`

	required:    false
	scopable:    true
	group:       install
	deprecated:  since v3.0.0-rc62, replaced by install
	convert:     shlex
	rbac:        A resource of a volume requires the root grant.

**Example:**

	secrets=cert/pem:server.pem cert/key:server.key

**Description:**

The whitespace-separated list of
`<secret name>/<key>:<volume relative path>:<options>`.


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


## Keyword `signal`

	required:    false
	scopable:    true
	group:       install
	deprecated:  since v3.0.0-rc62, replaced by install
	rbac:        A resource of a volume requires the root grant.

**Example:**

	signal=hup:container#1

**Description:**

A `<signal>:<target>` whitespace-separated list, where `<signal>` is a signal
name or number (ex. `1`, `hup` or `sighup`), and target is the comma-separated
list of resource ids to send the signal to (ex: `container#1,container#2`).

If only the signal is specified, all candidate resources will be signaled.

This keyword is typically used to reload daemons on certificate or configuration
files changes.


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
	group:       status
	default:     5s
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
	rbac:        A resource of a volume requires the root grant.

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


## Keyword `user`

	required:    false
	scopable:    true
	group:       permissions
	rbac:        A resource of a volume requires the root grant.

**Example:**

	user=1001

**Description:**

The user name or id owning the files and directories installed in the
volume, and the volume root, at each install: with `dirperm` or `perm` set,
along with the mode of the root, and alone otherwise, the mode of the root
then left as it is. An `install` line naming the root, as `/ user 70`, sets
its owner instead.


## Keyword `zone`

	required:    false
	scopable:    true
	group:       mount
	rbac:        A resource of a volume requires the root grant.

**Description:**

The name, or the rid, of the container.lxc resource of the object the
filesystem is mounted in.

If set, the `mnt` path is taken in the container: the filesystem is
mounted under the root directory of the container on the host. A zone
naming no such container fails the actions of the resource, rather than
mount the filesystem on the host path.


