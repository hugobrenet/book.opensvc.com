# Driver `pool.directory`

**Minimal configlet:**

	[pool#1]
	type = directory

**Minimal setup command:**

	om node set --kw="type=directory"

**Supported keywords:**

- comment
- mkblk_opt
- mkfs_opt
- mnt_opt
- path
- quota
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


## Keyword `path`

	required:    false
	scopable:    false
	default:     {var}/pool/directory

**Description:**

The fullpath of the directory hosting the pool volumes directories or loop files.


## Keyword `quota`

	required:    false
	scopable:    false
	default:     false
	convert:     bool

**Description:**

Bound each volume this pool serves to the size it was asked for, with a
project quota on the filesystem holding the pool.

A directory has no size of its own, so without this a volume served by a
directory pool is given the whole filesystem and the size asked of the pool is
recorded but not enforced.

The pool path has to be on an xfs filesystem mounted with the prjquota option.
A volume provision refuses rather than set a limit that would silently do
nothing.


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


