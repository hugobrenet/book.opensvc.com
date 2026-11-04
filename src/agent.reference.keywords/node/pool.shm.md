# Driver `pool.shm`

**Minimal configlet:**

	[pool#1]
	type = shm

**Minimal setup command:**

	om node set --kw="type=shm"

**Supported keywords:**

- comment
- mkblk_opt
- mkfs_opt
- mnt_opt
- mode
- status_schedule
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


## Keyword `mode`

	required:    false
	scopable:    false
	since:       v3.0.0-rc42
	convert:     filemode

**Default:**

`700`, unless mnt_opt names a mode: the volumes are for the objects using them, and the root of a tmpfs is everyone's to write in otherwise.

**Example:**

	mode=750

**Description:**

The permissions of the root of the volumes the pool makes, in octal, as `700`
or `1777`.

A volume is written with it as the mode keyword of its tmpfs, where it stays
when the pool is changed afterwards.


## Keyword `status_schedule`

	required:    false
	scopable:    false

**Description:**

The value to set to the `status_schedule` keyword of the `vol` objects
allocated from the pool.

See `usr/share/doc/schedule` for the schedule syntax.


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


