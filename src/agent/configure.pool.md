<!-- llms: Cluster storage pools: how volumes get their disks and filesystems from a pool, access modes, pool selection, the pool commands, and examples. -->
# Cluster Storage Pools

Services can use `volume` resources to:

* Abstract the disks and filesystems layout, which are hosting specificities, from the service deployment. A development cluster can for example define pools on a ceph cluster, while a production cluster can define pools on fc arrays.

* Enable service redeployment while retaining the data.

In this case the translation from volumes to disks and filesystems is delegated to the storage pool drivers.

Pools are defined in the node configuration. Each pool is identified by its name (the section suffix). For example, a `pool#tank` section defines a pool named `tank`.

The `default` pool always exist, even if not defined in the node configuration. If not explicitly changed, the `default` pool driver is `directory`.

## Volumes

* A volume resource drives a volume object, automatically created upon service provisioning if not already existing.

* The volume is hosted in the same namespace than its users.

* If not explicitly set, the volume object name is `<consumer name>-vol-<volume resource index>`. For example, a {{#include ../inc/svc}}`svc1` service with a `volume#1` resource will create a {{#include ../inc/svc}}`svc1-vol-1` volume object.

* A volume object can be referenced by multiple services in the same namespace.

* On provision, a service adds itself as a child of the volume objects mapped via volume resources. Due to this parent/child relation, stopping a volume object is delayed until all its consumers are stopped.

* On unprovision, a service removes itself from the children list of the volume objects mapped via volume resources.

* A consumer service instance stop also stops its node-affine volume object instances if the consumer service is the only child of the volume service. 

* A consumer service instance start always tries to start its node-affine volume object instances.

## Volume Resources Keywords

- [Reference](/agent.reference.keywords/svc/volume.md)

### Access Modes

* `roo` Read Only Once

* `rwo` Read Write Once (default)

* `rox` Read Only from multiple instances

* `rwx` Read Write from multiple instances

### Access Mode to Volume Topology

* `..x` access modes imply the volume is configured in a flex topology (active on all service nodes).

* `..o` access modes imply the volume is configured in a failover topology (active on only one service node).

### Volume Resource Parameter Requirements

* `..x + shared=true format=false` requires a shared block storage (SAN array, a rados blockdev gateway, ...)

* `..x + shared=true format=true` requires either a shared block storage (SAN array, a rados blockdev gateway, ...) plus a cluster filesystem (gfs2, ocfs, ...), or a distributed cluster filesystem (CephFS, GlusterFS, NAS, ...)

## Pool Selector

A volume resource requires a size and capabilities from the pool, via its {{#include ../inc/kw}}`size`, {{#include ../inc/kw}}`access`, {{#include ../inc/kw}}`shared` and {{#include ../inc/kw}}`format` keywords.

If {{#include ../inc/kw}}`pool` is not set explicitly to a pool name, the pool selector will return the available pool matching those criteria with the most free space.

## Pool Drivers

Each pool is backed by a driver, which decides what a volume is made of: a
directory, a logical volume, a zfs dataset, a lun on an array. The driver
also decides which access modes the pool can serve, and so which volumes the
selector may place on it.

The drivers, their capabilities and their keywords are listed in
[Pool Drivers](configure.pool.drivers.md).

## Pool Commands

> The **API** tabs assume the `$TOKEN` and the listener endpoint set up in
> [Cluster API](configure.api.md).

### Pool list

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om pool ls
```

    NAME     TYPE       CAPABILITIES              HEAD                             VOLUME_COUNT  BIN_SIZE  BIN_USED  BIN_FREE
    default  directory  rox,rwx,roo,rwo           /opt/opensvc/var/pool/directory  0             29.0g     3.57g     24.0g
    freenas  freenas    roo,rwo,shared,blk,iscsi  array://freenas/osvcdata         6             195g      9.37g     185g
    mpool    virtual    roo,rox,rwo,rwx,shared    templates/mpool                  1             -         -         -

</div>
<div class="tab" data-title="API">

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/pool"
```

Each item carries the `name`, `type`, `capabilities`, `head`, `volume_count`,
`size`, `used` and `free` the columns render, the cli only formatting the byte
counts. The `name` and `node` query parameters narrow the answer, as `--name`
and `--node` narrow the listing.

</div>
</div>

The sizes are what the pool can still hand out to volumes, which is the size a
volume is asked for and the size a claim rations. A pool whose nodes each hold
a copy of every volume hands out what the node with the least room can take,
not the sum of what its nodes hold. `--physical` shows the storage behind the
pool instead, and `--node` shows one line per node.

### Pool volumes

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om pool volume ls
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/pool/volume"
```

</div>
</div>

This lists the volumes each pool holds, and takes the same `--name` to narrow
on one pool.

## Examples

> A pool is a cluster keyword, so every `om cluster config update` below is
> a `PATCH /api/cluster/config` carrying the same `set` operations, with the
> `$TOKEN` and the listener endpoint set up in
> [Cluster API](configure.api.md). The first example shows both forms; the
> others show the cli form only, the api one being the same substitution.

### loop pool

Pool configuration

<div class="tabs">
<div class="tab" data-title="CLI">

```
om cluster config update \
	--set pool#loop.type=loop \
	--set pool#loop.path=/bigfs \
	--set pool#loop.mkfs_opt="-n ftype=1" \
	--set pool#loop.fs_type=xfs
```

</div>
<div class="tab" data-title="API">

```
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'set=pool#loop.type=loop' \
  --data-urlencode 'set=pool#loop.path=/bigfs' \
  --data-urlencode 'set=pool#loop.mkfs_opt=-n ftype=1' \
  --data-urlencode 'set=pool#loop.fs_type=xfs' \
  "https://<node>:1215/api/cluster/config"
```

</div>
</div>

```ini
[pool#loop]
type = loop
path = /bigfs
mkfs_opt = -n ftype=1
fs_type = xfs
```

The volume resource in the service

```ini
[volume#1]
size = 100m
pool = loop
```

Resulting configuration of the volume object

```ini
[disk#1]
size = 104857600
type = loop
file = /bigfs/<fqdn>.img

[fs#1]
type = xfs
dev = {disk#1.exposed_devs[0]}
mnt = /srv/<fqdn>
mkfs_opt = -n ftype=1
```

### zfs pool

Pool configuration

```
om cluster config update \
	--set pool#tank.type=zpool \
	--set pool#tank.name=tank \
	--set pool#tank.mkfs_opt="-o mountpoint=legacy -o dedup=on -o compression=on"
```

```ini
[pool#tank]
type = zpool
name = tank
mkfs_opt = -o mountpoint=legacy -o dedup=on -o compression=on
```

The volume resource in the service


```ini
[volume#1]
size = 100m
pool = tank
```

Resulting configuration of the volume object

```ini
[fs#1]
type = zfs
dev = tank/<fqdn>
mnt = /srv/<fqdn>
mkfs_opt = -o mountpoint=legacy -o dedup=on -o compression=on
```

### virtual pool, mirrored zpool over 2 SAN disks

Pools configuration

```
om cluster config update \
	--set pool#freenas1.type=array \
	--set pool#freenas1.array=freenas1 \
	--set pool#freenas1.sparse=true \
	--set pool#freenas1.diskgroup=cluster1 \
	--set pool#freenas2.type=array \
	--set pool#freenas2.array=freenas2 \
	--set pool#freenas2.sparse=true \
	--set pool#freenas2.diskgroup=cluster1 \
	--set pool#mpool.type=virtual \
	--set pool#mpool.template=templates/mpool \
	--set pool#mpool.capabilities="rox rwx roo rwo shared"
```

```ini
[pool#freenas1]
type = array
array = freenas1
diskgroup = cluster1
sparse = true

[pool#freenas2]
type = array
array = freenas2
diskgroup = cluster1
sparse = true

[pool#mpool]
type = virtual
template = templates/mpool
capabilities = rox rwx roo rwo shared
```

The volume object template referenced by the vpool


```ini
[DEFAULT]
kind = vol
nodes = *
disable = true

[disk#1]
name = {namespace}-{svcname}
type = zpool
vdev = mirror {volume#1.exposed_devs[0]} {volume#2.exposed_devs[0]}
shared = true

[fs#1]
dev = {disk#1.name}
mnt = /srv/{namespace}/{svcname}
type = zfs
shared = true

[fs#2]
dev = {disk#1.name}/data
mnt = {fs#1.mnt}/data
type = zfs
shared = true

[fs#3]
dev = {disk#1.name}/log
mnt = {fs#1.mnt}/log
type = zfs
shared = true

[volume#1]
format = false
name = {svcname}-1
pool = freenas1
size = {env.size}
shared = true

[volume#2]
format = false
name = {svcname}-2
pool = freenas2
size = {env.size}
shared = true
```

### virtual pool, mirrored lv over 2 SAN disks

Pools configuration

```
om cluster config update \
	--set pool#freenas1.type=array \
	--set pool#freenas1.array=freenas1 \
	--set pool#freenas1.sparse=true \
	--set pool#freenas1.diskgroup=cluster1 \
	--set pool#freenas2.type=array \
	--set pool#freenas2.array=freenas2 \
	--set pool#freenas2.sparse=true \
	--set pool#freenas2.diskgroup=cluster1 \
	--set pool#mvg.type=virtual \
	--set pool#mvg.template=templates/mvg \
	--set pool#mvg.capabilities="rox rwx roo rwo shared"
```

```ini
[pool#freenas1]
type = array
array = freenas1
diskgroup = cluster1
sparse = true

[pool#freenas2]
type = array
array = freenas2
diskgroup = cluster1
sparse = true

[pool#mvg]
type = virtual
template = templates/mvg
capabilities = rox rwx roo rwo shared
```

The volume object template referenced by the vpool

```ini
[DEFAULT]
kind = vol
nodes = *
disable = true

[volume#1]
shared = true
size = {env.size}
name = {svcname}-1
pool = freenas
format = false

[volume#2]
shared = true
size = {env.size}
name = {svcname}-2
pool = freenas
format = false

[disk#1]
shared = true
type = vg
name = {namespace}-{svcname}
pvs = {volume#1.exposed_devs[0]} {volume#2.exposed_devs[0]}

[disk#2]
shared = true
type = lv
name = root
vg = {disk#1.name}
size = 10m
create_options = -m 1

[fs#1]
shared = true
mnt = /srv/{namespace}/{svcname}
dev = {disk#2.exposed_devs[0]}
type = ext4

[disk#3]
shared = true
type = lv
name = data
vg = {disk#1.name}
size = $(60% * {disk#1.free})
create_options = -m 1

[fs#2]
shared = true
mnt = {fs#1.mnt}/data
dev = {disk#3.exposed_devs[0]}
type = ext4

[disk#4]
shared = true
type = lv
name = log
vg = {disk#1.name}
size = $(40% * {disk#1.free})
create_options = -m 1

[fs#3]
shared = true
mnt = {fs#1.mnt}/log
dev = {disk#4.exposed_devs[0]}
type = ext4
```

A logical volume is a resource of its own: om knows how big it is, can grow
it, and can count it against the claim its namespace holds on the pool. Each
size is read when that volume is made, so the shares are of what is left at
that point: data takes 60% of the free space the root volume left, and log 40%
of what data left.

### virtual pool, mirrored md over 2 SAN disks

Pools configuration

```
om cluster config update \
	--set pool#freenas1.type=array \
	--set pool#freenas1.array=freenas1 \
	--set pool#freenas1.sparse=true \
	--set pool#freenas1.diskgroup=cluster1 \
	--set pool#freenas2.type=array \
	--set pool#freenas2.array=freenas2 \
	--set pool#freenas2.sparse=true \
	--set pool#freenas2.diskgroup=cluster1 \
	--set pool#md.type=virtual \
	--set pool#md.template=templates/md \
	--set pool#md.capabilities="rox rwx roo rwo shared"
```

```ini
[pool#freenas1]
type = array
array = freenas1
diskgroup = cluster1
sparse = true

[pool#freenas2]
type = array
array = freenas2
diskgroup = cluster1
sparse = true

[pool#md]
type = virtual
template = templates/md
capabilities = rox rwx roo rwo shared
```

The volume object template referenced by the vpool

```ini
[DEFAULT]
kind = vol
disable = true
nodes = *

[disk#1]
shared = true
devs = {volume#1.exposed_devs[0]} {volume#2.exposed_devs[0]}
type = md
level = raid1

[disk#2]
shared = true
pvs = {disk#1.exposed_devs[0]}
type = vg
name = {namespace}-{svcname}

[disk#3]
shared = true
type = lv
name = root
vg = {disk#2.name}
size = 10m

[fs#1]
mnt = /srv/{namespace}/{svcname}
dev = {disk#3.exposed_devs[0]}
shared = true
type = ext4

[disk#4]
shared = true
type = lv
name = data
vg = {disk#2.name}
size = $(60% * {disk#2.free})

[fs#2]
mnt = {fs#1.mnt}/data
dev = {disk#4.exposed_devs[0]}
shared = true
type = ext4

[disk#5]
shared = true
type = lv
name = log
vg = {disk#2.name}
size = $(40% * {disk#2.free})

[fs#3]
mnt = {fs#1.mnt}/log
dev = {disk#5.exposed_devs[0]}
shared = true
type = ext4

[volume#2]
shared = true
size = {env.size}
name = {svcname}-2
pool = freenas
format = false

[volume#1]
shared = true
size = {env.size}
name = {svcname}-1
pool = freenas
format = false
```

### drbd pool

Pool configuration

```
om cluster config update \
  --set pool#drbdloop.type=drbd

om cluster config update \
  --set pool#drbdvg.type=drbd \
  --set pool#drbdvg.vg=centos
```

```ini
[pool#drbdloop]
type = drbd

[pool#drbdvg]
type = drbd
vg = centos
```


Example postgres service using a volume from a pool.

```ini
[DEFAULT]
nodes = *
orchestrate = ha

[volume#1]
shared = true
size = 200m
name = {name}

[container#1]
type = oci
image = postgres
volume_mounts = {name}/data:/var/lib/postgresql/data
secrets_environment = POSTGRES_PASSWORD=pg/password
rm = true
shared = true
```
