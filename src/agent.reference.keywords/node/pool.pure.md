# Driver `pool.pure`

**Minimal configlet:**

	[pool#1]
	type = pure
	array = 
	diskgroup = 

**Minimal setup command:**

	om node set \
		--kw="type=pure" \
		--kw="array=" \
		--kw="diskgroup="

**Supported keywords:**

- array
- comment
- delete_now
- diskgroup
- fs_type
- label_prefix
- mkblk_opt
- mkfs_opt
- mnt_opt
- pod
- status_schedule
- type
- volumegroup

## Keyword `array`

	required:    true
	scopable:    true

**Description:**

The name of the array, known as `array#<name>` in the node or cluster
configuration.


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


## Keyword `delete_now`

	required:    false
	scopable:    false
	default:     true
	convert:     bool

**Description:**

If set to false the pure volumes are not immediately deleted on unprovision, so a following provision action could fail.


## Keyword `diskgroup`

	required:    true
	scopable:    false

**Description:**

The name of the array disk group to allocate volumes from.


## Keyword `fs_type`

	required:    false
	scopable:    false
	default:     xfs

**Description:**

The filesystem to format the pool devices with.


## Keyword `label_prefix`

	required:    false
	scopable:    false

**Description:**

The prefix to add to the label assigned to the created disks.


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


## Keyword `pod`

	required:    false
	scopable:    false

**Description:**

The pod to create volume into.


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


## Keyword `volumegroup`

	required:    false
	scopable:    false

**Description:**

The volumegroup to create volume disks into.


