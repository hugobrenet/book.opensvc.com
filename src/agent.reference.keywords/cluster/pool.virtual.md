# Driver `pool.virtual`

**Minimal configlet:**

	[pool#1]
	type = virtual
	template = templates/vol/mpool-over-loop

**Minimal setup command:**

	om test/ccfg/foo set \
		--kw="type=virtual" \
		--kw="template=templates/vol/mpool-over-loop"

**Supported keywords:**

- capabilities
- comment
- mkblk_opt
- mkfs_opt
- mnt_opt
- optional_volume_env
- status_schedule
- template
- type
- volume_env

## Keyword `capabilities`

	required:    false
	scopable:    false
	default:     file roo rwo rox rwx
	convert:     list
	rbac:        This driver group requires the root grant.

**Description:**

The capabilities exposed by the virtual pool.

Supported capabilities:

* `blk`
  The pool can satisfy the `format=false` requirement.

* `file`
  The pool can satisfy the `format=true` requirement.

* `move`
  The pool volumes can host data for resources proposing live migration (e.g. container.kvm).

* `roo`
  Read-Only from One node.
  The pool can satisfy the `access=roo` requirement.

* `rox`
  Read-Only from Many nodes.
  The pool can satisfy the `access=rox` requirement.

* `rwo`
  Read-Write from One node.
  The pool can satisfy the `access=rwo` requirement.

* `rwx`
  Read-Write from Many nodes.
  The pool can satisfy the `access=rwx` requirement.

* `shared`
  The same technical object is used on all nodes.

* `snap`
  The volume can be snapshotted.

* `volatile`
  The pool can satisfy the `volatile=true` requirement.



## Keyword `comment`

	required:    false
	scopable:    false
	rbac:        This driver group requires the root grant.

**Description:**

A free form text describing the role of the object, of the node, or of the
section it is set in.

The keyword is accepted in any section, so the DEFAULT section can document a
configuration as a whole, and a resource, pool, heartbeat, array or network
section can document itself.

The agent does not interpret the value.


## Keyword `mkblk_opt`

	required:    false
	scopable:    false
	rbac:        This driver group requires the root grant.

**Example:**

	mkblk_opt=-b 16k

**Description:**

The zvol, lv, and other block device creation command options to use to
prepare the pool volumes devices.


## Keyword `mkfs_opt`

	required:    false
	scopable:    false
	rbac:        This driver group requires the root grant.

**Example:**

	mkfs_opt=-O largefile

**Description:**

The mkfs command options to use to format the pool devices.


## Keyword `mnt_opt`

	required:    false
	scopable:    true
	rbac:        This driver group requires the root grant.

**Description:**

The mount options of the fs created over the pool devices.


## Keyword `optional_volume_env`

	required:    false
	scopable:    false
	convert:     list
	rbac:        This driver group requires the root grant.

**Example:**

	optional_volume_env=container#1.name:container_name env.foo:foo

**Description:**

The list of the `vol` consumer service config keywords which values are mapped
as env keys in the allocated volume service.

If the keyword is not set at the source, the default value in the template env
section applies.


## Keyword `status_schedule`

	required:    false
	scopable:    false
	rbac:        This driver group requires the root grant.

**Description:**

The value to set to the `status_schedule` keyword of the `vol` objects
allocated from the pool.

See `usr/share/doc/schedule` for the schedule syntax.


## Keyword `template`

	required:    true
	scopable:    false
	rbac:        This driver group requires the root grant.

**Example:**

	template=templates/vol/mpool-over-loop

**Description:**

The path of a `vol` to use as a template for new volumes.


## Keyword `type`

	required:    false
	scopable:    false
	candidates:  directory, loop, vg, zpool, freenas, share, shm, symmetrix, truenas, virtual, dorado, hoc, drbd, pure, rados
	default:     loop
	rbac:        This driver group requires the root grant.

**Description:**

The pool type.

`loop` by default: the pool serves each volume a file holding a filesystem of its
size, which bounds what the volume holds. `directory` needs its `quota` keyword to
do so, and a namespace can not claim a pool that does not.


## Keyword `volume_env`

	required:    false
	scopable:    false
	convert:     list
	rbac:        This driver group requires the root grant.

**Example:**

	volume_env=container#1.name:container_name env.foo:foo

**Description:**

The list of the `vol` consumer service config keywords which values are mapped
as env keys in the allocated volume service.

If the keyword is not set at the source, an error is raised.


