# Driver `pool.drbd`

**Minimal configlet:**

	[pool#1]
	type = drbd

**Minimal setup command:**

	om node set --kw="type=drbd"

**Supported keywords:**

- addr
- comment
- fs_type
- max_peers
- mkblk_opt
- mkfs_opt
- mnt_opt
- network
- path
- status_schedule
- template
- type
- vg
- zpool

## Keyword `addr`

	required:    false
	scopable:    true

**Default:**

The ipaddr resolved for the nodename.

**Example:**

	addr=1.2.3.4

**Description:**

The addr to use to connect a peer. Use scoping to define each non-default
address.


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


## Keyword `max_peers`

	required:    false
	scopable:    false
	provision:   used only by the provision of the resource
	convert:     int

**Default:**

(nodes_count*2)-1

**Example:**

	max_peers=8

**Description:**

The integer value to use in `create-md --max-peers <n>`.

The driver ensures the value is not lesser than the number of instances.


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


## Keyword `network`

	required:    false
	scopable:    false

**Example:**

	network=backend1

**Description:**

The name of the backend network to use for the drbd traffic of the volumes
the pool creates, set as the `network` keyword of their `disk.drbd`
resource. Set this keyword if some node names are resolved to NATed
addresses.

The address of a node is then the first of the segment the network assigned
it, so the network is a `routed_bridge`: a network giving the nodes no
segment of their own, as a `lan`, is refused. Name the addresses with
`addr@<node>` there.


## Keyword `path`

	required:    false
	scopable:    false

**Description:**

The fullpath of the directory hosting the pool volumes loop files.


## Keyword `status_schedule`

	required:    false
	scopable:    false

**Description:**

The value to set to the `status_schedule` keyword of the `vol` objects
allocated from the pool.

See `usr/share/doc/schedule` for the schedule syntax.


## Keyword `template`

	required:    false
	scopable:    false

**Example:**

	template=live-migration

**Description:**

The value of the template keyword to set in the drbd resource of the created volumes

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


## Keyword `vg`

	required:    false
	scopable:    false

**Description:**

The name of the volume group to allocate the pool volumes logical volumes into.


## Keyword `zpool`

	required:    false
	scopable:    false

**Description:**

The name of the zpool to allocate the pool volumes zvol into.


