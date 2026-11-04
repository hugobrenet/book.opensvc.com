# Driver `pool.vg`

**Minimal configlet:**

	[pool#1]
	type = vg
	name = 

**Minimal setup command:**

	om node set \
		--kw="type=vg" \
		--kw="name="

**Supported keywords:**

- comment
- fs_type
- mkblk_opt
- mkfs_opt
- mnt_opt
- name
- status_schedule
- thin_pool
- type

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


## Keyword `fs_type`

	required:    false
	scopable:    false
	default:     xfs

**Description:**

The filesystem to format the pool devices with.


## Keyword `mkblk_opt`

	required:    false
	scopable:    false

**Example:**

	mkblk_opt=-b 16k

**Description:**

The zvol, lv, and other block device creation command options to use to
prepare the pool volumes devices.


## Keyword `mkfs_opt`

	required:    false
	scopable:    false

**Example:**

	mkfs_opt=-O largefile

**Description:**

The mkfs command options to use to format the pool devices.


## Keyword `mnt_opt`

	required:    false
	scopable:    true

**Description:**

The mount options of the fs created over the pool devices.


## Keyword `name`

	required:    true
	scopable:    false

**Description:**

The name of the volume group to allocate the pool volumes logical volumes into.


## Keyword `status_schedule`

	required:    false
	scopable:    false

**Description:**

The value to set to the `status_schedule` keyword of the `vol` objects
allocated from the pool.

See `usr/share/doc/schedule` for the schedule syntax.


## Keyword `thin_pool`

	required:    false
	scopable:    false
	since:       v3.0.0-rc54

**Example:**

	thin_pool=pool1

**Description:**

The name of a thin pool, a logical volume of the volume group `name`, to
allocate the pool volumes in as thin volumes. The pool then has the `snap`
capability: a thin volume is snapshotted in its pool, with no size of its own,
which a `sync.store` resource copies from. Its usage is the one of the thin
pool, and the volumes may add up to more than it holds.

The thin pool is made by the sysadmin, as the volume group is:
`lvcreate --type thin-pool -L <size> -n <thin pool> <name>`.


## Keyword `type`

	required:    false
	scopable:    false
	candidates:  directory, loop, vg, zpool, freenas, share, shm, symmetrix, truenas, virtual, dorado, hoc, drbd, pure, rados
	default:     loop

**Description:**

The pool type.

`loop` by default: the pool serves each volume a file holding a filesystem of its
size, which bounds what the volume holds. `directory` needs its `quota` keyword to
do so, and a namespace can not claim a pool that does not.


