<!-- llms: Reference of the pool drivers, such as directory and drbd: the capabilities of each, the layout of its volumes and its keywords. -->
# Pool Drivers

Reference of the pool drivers, their capabilities and their keywords. To
choose between them, see [Cluster Storage Pools](configure.pool.md).

## directory

### Capabilities

rox, rwx, roo, rwo

### Layout

A volume object from this type of pool contains:

* a fs.directory resource, with {{#include ../inc/kw}}`path=<pool head>/<volume fqdn>`.

### Keywords

- [Reference](/agent.reference.keywords/node/pool.directory.md)

## drbd

### Capabilities

rox, rwx, shared, blk, roo, rwo

### Layout

A volume object from this type of pool contains:

If a vg is defined in the pool configuration,

* a fs resource, with {{#include ../inc/kw}}`dev=<drbd devpath>`
* a drbd resource, layered over a logical volume of the pool vg
* a lv resource

If a zpool is defined in the pool configuration,

* a fs resource, with {{#include ../inc/kw}}`dev=<drbd devpath>`
* a drbd resource, layered over a zvol of the pool zpool
* a zvol resource

If the pool configuration has neither vg nor zpool set,

* a fs resource, with {{#include ../inc/kw}}`dev=<drbd devpath>`
* a drbd resource, layered over a logical volume
* a lv resource
* a vg resource
* a loop resource, with image file hosted in the pool defined {{#include ../inc/kw}}`path` or in `<PATHVAR>/pool/<poolname>/`

### Keywords

- [Reference](/agent.reference.keywords/node/pool.drbd.md)

## freenas

### Capabilities

roo, rwo, shared, blk, iscsi

### Layout

A volume object from this type of pool contains:

* a disk.disk resource named, with {{#include ../inc/kw}}`name=<volume fqdn>`

If the consumer has {{#include ../inc/kw}}`format=true` (default), the volume object also contains:

* a `fs.<pool fs_type>` resource, with {{#include ../inc/kw}}`mnt=/srv/<volume fqdn>`

### Keywords

- [Reference](/agent.reference.keywords/node/pool.freenas.md)

## loop

### Capabilities

rox, rwx, roo, rwo, blk

### Layout

A volume object from this type of pool contains:

* a disk.loop resource, with {{#include ../inc/kw}}`file=<pool head>/<volume fqdn>.img`

If the consumer has {{#include ../inc/kw}}`format=true` (default), the volume object also contains:

* a `fs.<pool fs_type>` resource, with {{#include ../inc/kw}}`mnt=/srv/<volume fqdn>`

### Keywords

- [Reference](/agent.reference.keywords/node/pool.loop.md)

## symmetrix

### Capabilities

roo, rwo, shared, blk, fc

### Layout

A volume object from this type of pool contains:

* a disk.disk resource named, with {{#include ../inc/kw}}`name=<volume fqdn>`

If the consumer has {{#include ../inc/kw}}`format=true` (default), the volume object also contains:

* a `fs.<pool fs_type>` resource, with {{#include ../inc/kw}}`mnt=/srv/<volume fqdn>`

### Keywords

- [Reference](/agent.reference.keywords/node/pool.symmetrix.md)

## vg

### Capabilities

rox, rwx, roo, rwo, blk, snap

### Layout

A volume object from this type of pool contains:

* a disk.lv resource, with {{#include ../inc/kw}}`name=<volume fqdn>`

If the consumer has {{#include ../inc/kw}}`format=true` (default), the volume object also contains:

* a `fs.<pool fs_type>` resource, with {{#include ../inc/kw}}`mnt=/srv/<volume fqdn>`

### Keywords

- [Reference](/agent.reference.keywords/node/pool.vg.md)

## share

### Capabilities

rox, rwx, roo, rwo, shared

### Layout

A volume object from this type of pool contains:

* a fs.directory resource, with {{#include ../inc/kw}}`path=<pool head>/<volume fqdn>`.

### Keywords

- [Reference](/agent.reference.keywords/node/pool.share.md)

## zpool

### Capabilities

rox, rwx, roo, rwo, blk, snap

### Layout

A volume object from this type of pool contains:

* a fs.zfs resource, with {{#include ../inc/kw}}`name=<pool>/<volume fqdn>` and {{#include ../inc/kw}}`mnt=/srv/<volume fqdn>`.

### Keywords

- [Reference](/agent.reference.keywords/node/pool.zpool.md)

## Virtual Pool Driver

A virtual pool allow administrators to create complex layouts based on volumes from other pools.

A typical use-case in a virtual pool allocating volumes mirrored over two other volumes allocated from arrays on two different sites.

A virtual pool volume is created from a template volume object the administrator can design at wish to meet its specific needs.

### The template

The `template` keyword names a volume object, and every volume the pool serves
is a copy of its configuration.

```ini
[pool#v1]
type = virtual
template = system/vol/v1
capabilities = roo rwo rox rwx blk
```

```ini
# system/vol/v1, a mirror over two volumes from the default pool

[DEFAULT]
size = 100mi
devices_from = disk#1

[disk#1]
type = md
level = raid1
devs = {volume#1.exposed_devs} {volume#2.exposed_devs}

[volume#1]
pool = default
size = {DEFAULT.size}

[volume#2]
pool = default
size = {DEFAULT.size}
```

The template is designed, not provisioned. It describes a layout; the volumes
the pool serves are the things that exist. A consumer asking this pool for
105Mi gets a copy whose `DEFAULT.size` is 105Mi, whose two sub-volumes are
allocated from the `default` pool, and whose array is created over them.

Write the template with references rather than names wherever a name would be
the template's own. `{volume#1.exposed_devs}` above resolves in each copy to
that copy's devices, where a device path written out would be the template's.

### What a copy does not inherit

A copy is another volume, so what the template recorded of itself does not
come with it. Those keywords are marked in the keyword reference:

	recorded:    written when what it names is made, and reset when the object is cloned

The object id is one. The uuid of an md array is another: it is written when
the array is created, and is what assembles that array again afterwards. A
copy keeping it would assemble the template's array under its own name instead
of creating one of its own.

They are reset in the copy, and written again for it when the copy makes what
they name. The same reset is what `om <path> create --config <source>` does,
and what its `--restore` flag turns off.

### A provisioned template

Provisioning the template object makes the very things its copies are supposed
to make. The array it then holds writes its uuid into the template
configuration, where it is visible:

```bash
$ om system/vol/v1 config show
[disk#1]
type = md
level = raid1
uuid@dev2n1 = 37a0a0a5:a10342a6:6f4fddb8:7de5d01d
```

That uuid is an administrator's to remove. The copies do not carry it, so it
breaks nothing for them, but a template holding an array is a template that is
also a volume, and the layout it is meant to describe is harder to read for it.

### Capabilities

Capabilities are user defined. Nothing derives them from the template, so they
are what the administrator declares the copies to be good for.

### Keywords

- [Reference](/agent.reference.keywords/node/pool.virtual.md)
