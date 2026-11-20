# Keyword changes

What each release of the agent added, removed and changed in its keywords. The reference itself documents v3.0.0-rc68.

The 20 most recent releases are listed. The whole timeline is in `history.json`, beside this page.


## v3.0.0-rc68


### Added

- `svc/container.docker.apparmor_profile`
- `svc/container.oci.apparmor_profile`
- `svc/container.podman.apparmor_profile`
- `svc/ip.cni.publish`
- `svc/ip.docker.publish`
- `svc/ip.netns.publish`

### Changed

- `svc/container.docker.netns`
  - description rewritten
- `svc/container.oci.netns`
  - description rewritten
- `svc/container.podman.netns`
  - description rewritten
- `svc/ip.cni.expose`
  - description rewritten
- `svc/ip.docker.expose`
  - description rewritten
- `svc/ip.host.expose`
  - description rewritten
- `svc/ip.netns.expose`
  - description rewritten

## v3.0.0-rc67

No keyword changed.

## v3.0.0-rc66

No keyword changed.

## v3.0.0-rc64


### Added

- `cluster/array.freenas.api`
- `cluster/array.freenas.password`
- `cluster/array.freenas.username`
- `cluster/array.hoc.name`
- `cluster/array.hp3par.username`
- `cluster/array.symmetrix.password`
- `cluster/pool.drbd.fs_type`
- `cluster/pool.hoc.compression`
- `cluster/pool.hoc.dedup`
- `node/array.freenas.api`
- `node/array.freenas.password`
- `node/array.freenas.username`
- `node/array.hoc.name`
- `node/array.hp3par.username`
- `node/array.symmetrix.password`
- `node/pool.drbd.fs_type`
- `node/pool.hoc.compression`
- `node/pool.hoc.dedup`

### Removed

- `cluster/array.centera.java_bin`
- `cluster/array.centera.jcass_dir`
- `cluster/array.centera.password`
- `cluster/array.centera.server`
- `cluster/array.centera.username`
- `cluster/array.dorado.api`
- `cluster/array.dorado.name`
- `cluster/array.dorado.timeout`
- `cluster/array.emcvnx.method`
- `cluster/array.emcvnx.password`
- `cluster/array.emcvnx.scope`
- `cluster/array.emcvnx.spa`
- `cluster/array.emcvnx.spb`
- `cluster/array.emcvnx.username`
- `cluster/array.eva.bin`
- `cluster/array.eva.manager`
- `cluster/array.ibmds.hmc1`
- `cluster/array.ibmds.hmc2`
- `cluster/array.ibmsvc.key`
- `cluster/array.nexenta.port`
- `cluster/pool.dorado.array`
- `cluster/pool.dorado.compression`
- `cluster/pool.dorado.dedup`
- `cluster/pool.dorado.diskgroup`
- `cluster/pool.dorado.fs_type`
- `cluster/pool.dorado.hypermetrodomain`
- `node/array.centera.java_bin`
- `node/array.centera.jcass_dir`
- `node/array.centera.password`
- `node/array.centera.server`
- `node/array.centera.username`
- `node/array.dorado.api`
- `node/array.dorado.name`
- `node/array.dorado.timeout`
- `node/array.emcvnx.method`
- `node/array.emcvnx.password`
- `node/array.emcvnx.scope`
- `node/array.emcvnx.spa`
- `node/array.emcvnx.spb`
- `node/array.emcvnx.username`
- `node/array.eva.bin`
- `node/array.eva.manager`
- `node/array.ibmds.hmc1`
- `node/array.ibmds.hmc2`
- `node/array.ibmsvc.key`
- `node/array.nexenta.port`
- `node/pool.dorado.array`
- `node/pool.dorado.compression`
- `node/pool.dorado.dedup`
- `node/pool.dorado.diskgroup`
- `node/pool.dorado.fs_type`
- `node/pool.dorado.hypermetrodomain`

### Changed

- `cluster/array.freenas.timeout`
  - types: dorado, freenas, hoc, truenas -> freenas, hoc, truenas
- `cluster/array.hp3par.manager`
  - description rewritten
- `cluster/array.hp3par.method`
  - candidates: cli, proxy, ssh -> cli, ssh
  - description rewritten
- `cluster/array.type`
  - candidates: centera, dorado, emcvnx, eva, freenas, hds, hoc, hp3par, ibmds, ibmsvc, netapp, nexenta, symmetrix, truenas, vioserver, xtremio -> freenas, hds, hoc, hp3par, pure, symmetrix, truenas, xtremio
- `cluster/collector.timeout`
  - default: 5s -> 10s
- `cluster/hb.disk.dev`
  - description rewritten
- `cluster/hb.multicast.addr`
  - description rewritten
- `cluster/hb.multicast.intf`
  - description rewritten
- `cluster/hb.unicast.addr`
  - description rewritten
- `cluster/pool.freenas.array`
  - types: dorado, freenas, hoc, pure, symmetrix, truenas -> freenas, hoc, pure, symmetrix, truenas
- `cluster/pool.freenas.diskgroup`
  - types: dorado, freenas, hoc, pure, truenas -> freenas, hoc, pure, truenas
- `cluster/pool.type`
  - candidates: directory, dorado, drbd, freenas, hoc, loop, pure, rados, share, shm, symmetrix, truenas, vg, virtual, zpool -> directory, drbd, freenas, hoc, loop, pure, rados, share, shm, symmetrix, truenas, vg, virtual, zpool
- `node/array.freenas.timeout`
  - types: dorado, freenas, hoc, truenas -> freenas, hoc, truenas
- `node/array.hp3par.manager`
  - description rewritten
- `node/array.hp3par.method`
  - candidates: cli, proxy, ssh -> cli, ssh
  - description rewritten
- `node/array.type`
  - candidates: centera, dorado, emcvnx, eva, freenas, hds, hoc, hp3par, ibmds, ibmsvc, netapp, nexenta, symmetrix, truenas, vioserver, xtremio -> freenas, hds, hoc, hp3par, pure, symmetrix, truenas, xtremio
- `node/collector.timeout`
  - default: 5s -> 10s
- `node/hb.disk.dev`
  - description rewritten
- `node/hb.multicast.addr`
  - description rewritten
- `node/hb.multicast.intf`
  - description rewritten
- `node/hb.unicast.addr`
  - description rewritten
- `node/pool.freenas.array`
  - types: dorado, freenas, hoc, pure, symmetrix, truenas -> freenas, hoc, pure, symmetrix, truenas
- `node/pool.freenas.diskgroup`
  - types: dorado, freenas, hoc, pure, truenas -> freenas, hoc, pure, truenas
- `node/pool.type`
  - candidates: directory, dorado, drbd, freenas, hoc, loop, pure, rados, share, shm, symmetrix, truenas, vg, virtual, zpool -> directory, drbd, freenas, hoc, loop, pure, rados, share, shm, symmetrix, truenas, vg, virtual, zpool
- `svc/DEFAULT.pg_mem_limit`
  - description rewritten
- `svc/container.docker.ipcns`
  - candidates: unset -> , host, none, private, shareable
- `svc/container.docker.netns`
  - candidates: unset -> , host, none
- `svc/container.docker.pidns`
  - candidates: unset -> , host
- `svc/container.kvm.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `svc/container.lxc.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `svc/container.oci.ipcns`
  - candidates: unset -> , host, none, private, shareable
- `svc/container.oci.netns`
  - candidates: unset -> , host, none
- `svc/container.oci.pidns`
  - candidates: unset -> , host
- `svc/container.podman.ipcns`
  - candidates: unset -> , host, none, private, shareable
- `svc/container.podman.netns`
  - candidates: unset -> , host, none
- `svc/container.podman.pidns`
  - candidates: unset -> , host
- `svc/container.vbox.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `svc/disk.crypt.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `svc/disk.disk.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `svc/disk.drbd.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `svc/disk.hp3par.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `svc/disk.loop.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `svc/disk.lv.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `svc/disk.lvm.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `svc/disk.md.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `svc/disk.rados.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `svc/disk.raw.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `svc/disk.vg.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `svc/disk.zpool.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `svc/disk.zvol.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `svc/fs.9pfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.9pfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.9pfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.9pfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.afs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.afs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.afs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.afs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.bfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.bfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.bfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.bfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.bind.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.bind.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.bind.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.bind.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.btrfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.btrfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.btrfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.btrfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.cephfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.cephfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.cephfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.cephfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.cifs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.cifs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.cifs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.cifs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.directory.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.directory.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.directory.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.directory.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ext2.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ext2.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ext2.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ext2.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ext3.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ext3.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ext3.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ext3.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ext4.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ext4.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ext4.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ext4.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.f2fs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.f2fs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.f2fs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.f2fs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.gfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.gfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.gfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.gfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.gfs2.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.gfs2.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.gfs2.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.gfs2.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.glusterfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.glusterfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.glusterfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.glusterfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.gpfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.gpfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.gpfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.gpfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.hfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.hfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.hfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.hfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.hfsplus.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.hfsplus.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.hfsplus.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.hfsplus.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.hpfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.hpfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.hpfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.hpfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.jffs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.jffs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.jffs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.jffs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.jffs2.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.jffs2.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.jffs2.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.jffs2.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.jfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.jfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.jfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.jfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.jfs2.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.jfs2.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.jfs2.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.jfs2.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.lofs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.lofs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.lofs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.lofs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.logfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.logfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.logfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.logfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.minix.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.minix.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.minix.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.minix.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.msdos.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.msdos.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.msdos.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.msdos.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ncpfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ncpfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ncpfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ncpfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.nfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.nfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.nfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.nfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.nfs4.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.nfs4.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.nfs4.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.nfs4.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.nilfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.nilfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.nilfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.nilfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.none.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.none.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.none.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.none.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ntfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ntfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ntfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ntfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ocfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ocfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ocfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ocfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ocfs2.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ocfs2.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ocfs2.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ocfs2.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.qnx4.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.qnx4.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.qnx4.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.qnx4.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.reiserfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.reiserfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.reiserfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.reiserfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.reiserfs4.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.reiserfs4.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.reiserfs4.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.reiserfs4.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.rpc_pipefs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.rpc_pipefs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.rpc_pipefs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.rpc_pipefs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.sgcp_nfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.sgcp_nfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.sgcp_nfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.sgcp_nfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.smbfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.smbfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.smbfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.smbfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.tmpfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.tmpfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.tmpfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.tmpfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.tux3.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.tux3.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.tux3.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.tux3.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ufs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ufs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ufs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ufs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ufs2.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ufs2.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ufs2.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.ufs2.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.umsdos.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.umsdos.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.umsdos.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.umsdos.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.vfat.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.vfat.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.vfat.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.vfat.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.vxfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.vxfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.vxfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.vxfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.xfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.xfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.xfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.xfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.xia.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.xia.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.xia.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.xia.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.zfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.zfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.zfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/fs.zfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/ip.docker.alias`
  - deprecated: unset -> v3.0.0-rc62
- `svc/ip.docker.mode`
  - description rewritten
- `svc/ip.host.gateway`
  - deprecated: unset -> v3.0.0-rc62
- `svc/ip.netns.alias`
  - deprecated: unset -> v3.0.0-rc62
- `svc/ip.netns.mode`
  - description rewritten
- `svc/task.docker.ipcns`
  - candidates: unset -> , host, none, private, shareable
- `svc/task.docker.netns`
  - candidates: unset -> , host, none
- `svc/task.docker.pidns`
  - candidates: unset -> , host
- `svc/task.oci.ipcns`
  - candidates: unset -> , host, none, private, shareable
- `svc/task.oci.netns`
  - candidates: unset -> , host, none
- `svc/task.oci.pidns`
  - candidates: unset -> , host
- `svc/task.podman.ipcns`
  - candidates: unset -> , host, none, private, shareable
- `svc/task.podman.netns`
  - candidates: unset -> , host, none
- `svc/task.podman.pidns`
  - candidates: unset -> , host
- `svc/volume..configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/volume..directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/volume..secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `svc/volume..signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/DEFAULT.pg_mem_limit`
  - description rewritten
- `vol/disk.crypt.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `vol/disk.disk.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `vol/disk.drbd.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `vol/disk.hp3par.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `vol/disk.loop.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `vol/disk.lv.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `vol/disk.lvm.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `vol/disk.md.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `vol/disk.rados.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `vol/disk.raw.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `vol/disk.vg.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `vol/disk.zpool.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `vol/disk.zvol.promote_rw`
  - deprecated: unset -> v3.0.0-rc62
- `vol/fs.9pfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.9pfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.9pfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.9pfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.afs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.afs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.afs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.afs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.bfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.bfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.bfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.bfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.bind.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.bind.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.bind.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.bind.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.btrfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.btrfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.btrfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.btrfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.cephfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.cephfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.cephfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.cephfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.cifs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.cifs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.cifs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.cifs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.directory.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.directory.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.directory.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.directory.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ext2.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ext2.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ext2.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ext2.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ext3.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ext3.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ext3.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ext3.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ext4.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ext4.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ext4.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ext4.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.f2fs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.f2fs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.f2fs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.f2fs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.gfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.gfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.gfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.gfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.gfs2.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.gfs2.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.gfs2.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.gfs2.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.glusterfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.glusterfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.glusterfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.glusterfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.gpfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.gpfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.gpfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.gpfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.hfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.hfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.hfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.hfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.hfsplus.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.hfsplus.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.hfsplus.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.hfsplus.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.hpfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.hpfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.hpfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.hpfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.jffs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.jffs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.jffs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.jffs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.jffs2.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.jffs2.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.jffs2.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.jffs2.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.jfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.jfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.jfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.jfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.jfs2.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.jfs2.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.jfs2.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.jfs2.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.lofs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.lofs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.lofs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.lofs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.logfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.logfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.logfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.logfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.minix.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.minix.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.minix.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.minix.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.msdos.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.msdos.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.msdos.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.msdos.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ncpfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ncpfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ncpfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ncpfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.nfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.nfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.nfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.nfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.nfs4.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.nfs4.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.nfs4.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.nfs4.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.nilfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.nilfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.nilfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.nilfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.none.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.none.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.none.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.none.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ntfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ntfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ntfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ntfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ocfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ocfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ocfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ocfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ocfs2.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ocfs2.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ocfs2.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ocfs2.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.qnx4.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.qnx4.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.qnx4.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.qnx4.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.reiserfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.reiserfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.reiserfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.reiserfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.reiserfs4.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.reiserfs4.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.reiserfs4.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.reiserfs4.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.rpc_pipefs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.rpc_pipefs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.rpc_pipefs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.rpc_pipefs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.sgcp_nfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.sgcp_nfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.sgcp_nfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.sgcp_nfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.smbfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.smbfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.smbfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.smbfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.tmpfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.tmpfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.tmpfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.tmpfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.tux3.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.tux3.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.tux3.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.tux3.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ufs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ufs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ufs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ufs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ufs2.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ufs2.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ufs2.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.ufs2.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.umsdos.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.umsdos.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.umsdos.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.umsdos.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.vfat.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.vfat.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.vfat.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.vfat.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.vxfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.vxfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.vxfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.vxfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.xfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.xfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.xfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.xfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.xia.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.xia.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.xia.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.xia.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.zfs.configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.zfs.directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.zfs.secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/fs.zfs.signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/task.docker.ipcns`
  - candidates: unset -> , host, none, private, shareable
- `vol/task.docker.netns`
  - candidates: unset -> , host, none
- `vol/task.docker.pidns`
  - candidates: unset -> , host
- `vol/task.oci.ipcns`
  - candidates: unset -> , host, none, private, shareable
- `vol/task.oci.netns`
  - candidates: unset -> , host, none
- `vol/task.oci.pidns`
  - candidates: unset -> , host
- `vol/task.podman.ipcns`
  - candidates: unset -> , host, none, private, shareable
- `vol/task.podman.netns`
  - candidates: unset -> , host, none
- `vol/task.podman.pidns`
  - candidates: unset -> , host
- `vol/volume..configs`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/volume..directories`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/volume..secrets`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install
- `vol/volume..signal`
  - deprecated: unset -> v3.0.0-rc62
  - replacedBy: unset -> install

## v3.0.0-rc62


### Changed

- `cluster/collector.speaker_grace_period`
  - since: v3.0.0-rc60 -> v3.0.0-rc61
- `cluster/node.load_pool_interval`
  - since: v3.0.0-rc60 -> v3.0.0-rc61
- `node/collector.speaker_grace_period`
  - since: v3.0.0-rc60 -> v3.0.0-rc61
- `node/node.load_pool_interval`
  - since: v3.0.0-rc60 -> v3.0.0-rc61

## v3.0.0-rc61


### Added

- `cluster/collector.speaker_grace_period`
- `cluster/node.load_pool_interval`
- `node/collector.speaker_grace_period`
- `node/node.load_pool_interval`
- `svc/disk.crypt.iter_time`
- `svc/disk.crypt.pbkdf`
- `svc/disk.crypt.pbkdf_memory`
- `svc/disk.crypt.pbkdf_parallel`
- `vol/disk.crypt.iter_time`
- `vol/disk.crypt.pbkdf`
- `vol/disk.crypt.pbkdf_memory`
- `vol/disk.crypt.pbkdf_parallel`

### Changed

- `svc/disk.crypt.manage_passphrase`
  - description rewritten
- `vol/disk.crypt.manage_passphrase`
  - description rewritten

## v3.0.0-rc59


### Added

- `cluster/node.max_install_size`
- `node/node.max_install_size`

### Changed

- `cluster/node.allowed_urls`
  - description rewritten
- `node/node.allowed_urls`
  - description rewritten
- `svc/DEFAULT.type`
  - inherit: leaf2head -> leaf
- `svc/app.forking.environment`
  - description rewritten
- `svc/app.simple.environment`
  - description rewritten
- `svc/container.docker.environment`
  - description rewritten
- `svc/container.lxc.create_environment`
  - description rewritten
- `svc/container.oci.environment`
  - description rewritten
- `svc/container.podman.environment`
  - description rewritten
- `svc/fs.9pfs.install`
  - description rewritten
- `svc/fs.afs.install`
  - description rewritten
- `svc/fs.bfs.install`
  - description rewritten
- `svc/fs.bind.install`
  - description rewritten
- `svc/fs.btrfs.install`
  - description rewritten
- `svc/fs.cephfs.install`
  - description rewritten
- `svc/fs.cifs.install`
  - description rewritten
- `svc/fs.directory.install`
  - description rewritten
- `svc/fs.ext2.install`
  - description rewritten
- `svc/fs.ext3.install`
  - description rewritten
- `svc/fs.ext4.install`
  - description rewritten
- `svc/fs.f2fs.install`
  - description rewritten
- `svc/fs.gfs.install`
  - description rewritten
- `svc/fs.gfs2.install`
  - description rewritten
- `svc/fs.glusterfs.install`
  - description rewritten
- `svc/fs.gpfs.install`
  - description rewritten
- `svc/fs.hfs.install`
  - description rewritten
- `svc/fs.hfsplus.install`
  - description rewritten
- `svc/fs.hpfs.install`
  - description rewritten
- `svc/fs.jffs.install`
  - description rewritten
- `svc/fs.jffs2.install`
  - description rewritten
- `svc/fs.jfs.install`
  - description rewritten
- `svc/fs.jfs2.install`
  - description rewritten
- `svc/fs.lofs.install`
  - description rewritten
- `svc/fs.logfs.install`
  - description rewritten
- `svc/fs.minix.install`
  - description rewritten
- `svc/fs.msdos.install`
  - description rewritten
- `svc/fs.ncpfs.install`
  - description rewritten
- `svc/fs.nfs.install`
  - description rewritten
- `svc/fs.nfs4.install`
  - description rewritten
- `svc/fs.nilfs.install`
  - description rewritten
- `svc/fs.none.install`
  - description rewritten
- `svc/fs.ntfs.install`
  - description rewritten
- `svc/fs.ocfs.install`
  - description rewritten
- `svc/fs.ocfs2.install`
  - description rewritten
- `svc/fs.qnx4.install`
  - description rewritten
- `svc/fs.reiserfs.install`
  - description rewritten
- `svc/fs.reiserfs4.install`
  - description rewritten
- `svc/fs.rpc_pipefs.install`
  - description rewritten
- `svc/fs.sgcp_nfs.install`
  - description rewritten
- `svc/fs.smbfs.install`
  - description rewritten
- `svc/fs.tmpfs.install`
  - description rewritten
- `svc/fs.tux3.install`
  - description rewritten
- `svc/fs.ufs.install`
  - description rewritten
- `svc/fs.ufs2.install`
  - description rewritten
- `svc/fs.umsdos.install`
  - description rewritten
- `svc/fs.vfat.install`
  - description rewritten
- `svc/fs.vxfs.install`
  - description rewritten
- `svc/fs.xfs.install`
  - description rewritten
- `svc/fs.xia.install`
  - description rewritten
- `svc/fs.zfs.install`
  - description rewritten
- `svc/task.docker.environment`
  - description rewritten
- `svc/task.host.environment`
  - description rewritten
- `svc/task.oci.environment`
  - description rewritten
- `svc/task.podman.environment`
  - description rewritten
- `svc/volume..install`
  - description rewritten
- `vol/DEFAULT.type`
  - inherit: leaf2head -> leaf
- `vol/fs.9pfs.install`
  - description rewritten
- `vol/fs.afs.install`
  - description rewritten
- `vol/fs.bfs.install`
  - description rewritten
- `vol/fs.bind.install`
  - description rewritten
- `vol/fs.btrfs.install`
  - description rewritten
- `vol/fs.cephfs.install`
  - description rewritten
- `vol/fs.cifs.install`
  - description rewritten
- `vol/fs.directory.install`
  - description rewritten
- `vol/fs.ext2.install`
  - description rewritten
- `vol/fs.ext3.install`
  - description rewritten
- `vol/fs.ext4.install`
  - description rewritten
- `vol/fs.f2fs.install`
  - description rewritten
- `vol/fs.gfs.install`
  - description rewritten
- `vol/fs.gfs2.install`
  - description rewritten
- `vol/fs.glusterfs.install`
  - description rewritten
- `vol/fs.gpfs.install`
  - description rewritten
- `vol/fs.hfs.install`
  - description rewritten
- `vol/fs.hfsplus.install`
  - description rewritten
- `vol/fs.hpfs.install`
  - description rewritten
- `vol/fs.jffs.install`
  - description rewritten
- `vol/fs.jffs2.install`
  - description rewritten
- `vol/fs.jfs.install`
  - description rewritten
- `vol/fs.jfs2.install`
  - description rewritten
- `vol/fs.lofs.install`
  - description rewritten
- `vol/fs.logfs.install`
  - description rewritten
- `vol/fs.minix.install`
  - description rewritten
- `vol/fs.msdos.install`
  - description rewritten
- `vol/fs.ncpfs.install`
  - description rewritten
- `vol/fs.nfs.install`
  - description rewritten
- `vol/fs.nfs4.install`
  - description rewritten
- `vol/fs.nilfs.install`
  - description rewritten
- `vol/fs.none.install`
  - description rewritten
- `vol/fs.ntfs.install`
  - description rewritten
- `vol/fs.ocfs.install`
  - description rewritten
- `vol/fs.ocfs2.install`
  - description rewritten
- `vol/fs.qnx4.install`
  - description rewritten
- `vol/fs.reiserfs.install`
  - description rewritten
- `vol/fs.reiserfs4.install`
  - description rewritten
- `vol/fs.rpc_pipefs.install`
  - description rewritten
- `vol/fs.sgcp_nfs.install`
  - description rewritten
- `vol/fs.smbfs.install`
  - description rewritten
- `vol/fs.tmpfs.install`
  - description rewritten
- `vol/fs.tux3.install`
  - description rewritten
- `vol/fs.ufs.install`
  - description rewritten
- `vol/fs.ufs2.install`
  - description rewritten
- `vol/fs.umsdos.install`
  - description rewritten
- `vol/fs.vfat.install`
  - description rewritten
- `vol/fs.vxfs.install`
  - description rewritten
- `vol/fs.xfs.install`
  - description rewritten
- `vol/fs.xia.install`
  - description rewritten
- `vol/fs.zfs.install`
  - description rewritten
- `vol/task.docker.environment`
  - description rewritten
- `vol/task.host.environment`
  - description rewritten
- `vol/task.oci.environment`
  - description rewritten
- `vol/task.podman.environment`
  - description rewritten
- `vol/volume..install`
  - description rewritten

## v3.0.0-rc58


### Added

- `svc/task.acme.blocking_post_stop`
- `svc/task.acme.blocking_pre_stop`
- `svc/task.acme.post_stop`
- `svc/task.acme.pre_stop`
- `svc/task.acme.stop_requires`
- `svc/task.host.blocking_post_stop`
- `svc/task.host.blocking_pre_stop`
- `svc/task.host.post_stop`
- `svc/task.host.pre_stop`
- `svc/task.host.stop_requires`
- `vol/task.host.blocking_post_stop`
- `vol/task.host.blocking_pre_stop`
- `vol/task.host.post_stop`
- `vol/task.host.pre_stop`
- `vol/task.host.stop_requires`

### Removed

- `svc/container.oci.rootless_group`
- `svc/container.oci.rootless_user`
- `svc/task.oci.rootless_group`
- `svc/task.oci.rootless_user`
- `vol/task.oci.rootless_group`
- `vol/task.oci.rootless_user`

### Changed

- `cluster/collector.timeout`
  - description rewritten
- `cluster/node.branch`
  - description rewritten
- `cluster/node.collector_timeout`
  - description rewritten
- `cluster/node.dbcompliance`
  - defaultText: Same protocol, server and port as `dbopensvc`, but with a different path.
 -> unset
  - deprecated: unset -> v3.0.0-rc58
  - description rewritten
- `cluster/node.dbopensvc`
  - deprecated: unset -> v3.0.0-rc58
  - replacedBy: unset -> collector.url
  - description rewritten
- `cluster/node.repo`
  - description rewritten
- `cluster/node.repopkg`
  - description rewritten
- `node/collector.timeout`
  - description rewritten
- `node/node.branch`
  - description rewritten
- `node/node.collector_timeout`
  - description rewritten
- `node/node.dbcompliance`
  - defaultText: Same protocol, server and port as `dbopensvc`, but with a different path.
 -> unset
  - deprecated: unset -> v3.0.0-rc58
  - description rewritten
- `node/node.dbopensvc`
  - deprecated: unset -> v3.0.0-rc58
  - replacedBy: unset -> collector.url
  - description rewritten
- `node/node.oci`
  - candidates: unset -> docker, podman
  - description rewritten
- `node/node.repo`
  - description rewritten
- `node/node.repopkg`
  - description rewritten
- `svc/DEFAULT.disable`
  - description rewritten
- `svc/app.forking.disable`
  - description rewritten
- `svc/app.simple.disable`
  - description rewritten
- `svc/container.docker.disable`
  - description rewritten
- `svc/container.docker.netns`
  - description rewritten
- `svc/container.kvm.disable`
  - description rewritten
- `svc/container.lxc.disable`
  - description rewritten
- `svc/container.oci.disable`
  - description rewritten
- `svc/container.oci.netns`
  - description rewritten
- `svc/container.oci.userns`
  - description rewritten
- `svc/container.podman.disable`
  - description rewritten
- `svc/container.podman.netns`
  - description rewritten
- `svc/container.vbox.disable`
  - description rewritten
- `svc/disk.crypt.disable`
  - description rewritten
- `svc/disk.disk.disable`
  - description rewritten
- `svc/disk.drbd.disable`
  - description rewritten
- `svc/disk.hp3par.disable`
  - description rewritten
- `svc/disk.loop.disable`
  - description rewritten
- `svc/disk.lv.disable`
  - description rewritten
- `svc/disk.lvm.disable`
  - description rewritten
- `svc/disk.md.disable`
  - description rewritten
- `svc/disk.rados.disable`
  - description rewritten
- `svc/disk.raw.disable`
  - description rewritten
- `svc/disk.sgcp_nfs_cg.disable`
  - description rewritten
- `svc/disk.vg.disable`
  - description rewritten
- `svc/disk.xp8.disable`
  - description rewritten
- `svc/disk.zpool.disable`
  - description rewritten
- `svc/disk.zvol.disable`
  - description rewritten
- `svc/fs.9pfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.9pfs.disable`
  - description rewritten
- `svc/fs.9pfs.group`
  - description rewritten
- `svc/fs.9pfs.install`
  - description rewritten
- `svc/fs.9pfs.user`
  - description rewritten
- `svc/fs.afs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.afs.disable`
  - description rewritten
- `svc/fs.afs.group`
  - description rewritten
- `svc/fs.afs.install`
  - description rewritten
- `svc/fs.afs.user`
  - description rewritten
- `svc/fs.bfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.bfs.disable`
  - description rewritten
- `svc/fs.bfs.group`
  - description rewritten
- `svc/fs.bfs.install`
  - description rewritten
- `svc/fs.bfs.user`
  - description rewritten
- `svc/fs.bind.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.bind.disable`
  - description rewritten
- `svc/fs.bind.group`
  - description rewritten
- `svc/fs.bind.install`
  - description rewritten
- `svc/fs.bind.user`
  - description rewritten
- `svc/fs.btrfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.btrfs.disable`
  - description rewritten
- `svc/fs.btrfs.group`
  - description rewritten
- `svc/fs.btrfs.install`
  - description rewritten
- `svc/fs.btrfs.user`
  - description rewritten
- `svc/fs.cephfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.cephfs.disable`
  - description rewritten
- `svc/fs.cephfs.group`
  - description rewritten
- `svc/fs.cephfs.install`
  - description rewritten
- `svc/fs.cephfs.user`
  - description rewritten
- `svc/fs.cifs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.cifs.disable`
  - description rewritten
- `svc/fs.cifs.group`
  - description rewritten
- `svc/fs.cifs.install`
  - description rewritten
- `svc/fs.cifs.user`
  - description rewritten
- `svc/fs.directory.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.directory.disable`
  - description rewritten
- `svc/fs.directory.group`
  - description rewritten
- `svc/fs.directory.install`
  - description rewritten
- `svc/fs.directory.user`
  - description rewritten
- `svc/fs.ext2.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.ext2.disable`
  - description rewritten
- `svc/fs.ext2.group`
  - description rewritten
- `svc/fs.ext2.install`
  - description rewritten
- `svc/fs.ext2.user`
  - description rewritten
- `svc/fs.ext3.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.ext3.disable`
  - description rewritten
- `svc/fs.ext3.group`
  - description rewritten
- `svc/fs.ext3.install`
  - description rewritten
- `svc/fs.ext3.user`
  - description rewritten
- `svc/fs.ext4.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.ext4.disable`
  - description rewritten
- `svc/fs.ext4.group`
  - description rewritten
- `svc/fs.ext4.install`
  - description rewritten
- `svc/fs.ext4.user`
  - description rewritten
- `svc/fs.f2fs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.f2fs.disable`
  - description rewritten
- `svc/fs.f2fs.group`
  - description rewritten
- `svc/fs.f2fs.install`
  - description rewritten
- `svc/fs.f2fs.user`
  - description rewritten
- `svc/fs.flag.disable`
  - description rewritten
- `svc/fs.gfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.gfs.disable`
  - description rewritten
- `svc/fs.gfs.group`
  - description rewritten
- `svc/fs.gfs.install`
  - description rewritten
- `svc/fs.gfs.user`
  - description rewritten
- `svc/fs.gfs2.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.gfs2.disable`
  - description rewritten
- `svc/fs.gfs2.group`
  - description rewritten
- `svc/fs.gfs2.install`
  - description rewritten
- `svc/fs.gfs2.user`
  - description rewritten
- `svc/fs.glusterfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.glusterfs.disable`
  - description rewritten
- `svc/fs.glusterfs.group`
  - description rewritten
- `svc/fs.glusterfs.install`
  - description rewritten
- `svc/fs.glusterfs.user`
  - description rewritten
- `svc/fs.gpfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.gpfs.disable`
  - description rewritten
- `svc/fs.gpfs.group`
  - description rewritten
- `svc/fs.gpfs.install`
  - description rewritten
- `svc/fs.gpfs.user`
  - description rewritten
- `svc/fs.hfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.hfs.disable`
  - description rewritten
- `svc/fs.hfs.group`
  - description rewritten
- `svc/fs.hfs.install`
  - description rewritten
- `svc/fs.hfs.user`
  - description rewritten
- `svc/fs.hfsplus.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.hfsplus.disable`
  - description rewritten
- `svc/fs.hfsplus.group`
  - description rewritten
- `svc/fs.hfsplus.install`
  - description rewritten
- `svc/fs.hfsplus.user`
  - description rewritten
- `svc/fs.hpfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.hpfs.disable`
  - description rewritten
- `svc/fs.hpfs.group`
  - description rewritten
- `svc/fs.hpfs.install`
  - description rewritten
- `svc/fs.hpfs.user`
  - description rewritten
- `svc/fs.jffs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.jffs.disable`
  - description rewritten
- `svc/fs.jffs.group`
  - description rewritten
- `svc/fs.jffs.install`
  - description rewritten
- `svc/fs.jffs.user`
  - description rewritten
- `svc/fs.jffs2.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.jffs2.disable`
  - description rewritten
- `svc/fs.jffs2.group`
  - description rewritten
- `svc/fs.jffs2.install`
  - description rewritten
- `svc/fs.jffs2.user`
  - description rewritten
- `svc/fs.jfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.jfs.disable`
  - description rewritten
- `svc/fs.jfs.group`
  - description rewritten
- `svc/fs.jfs.install`
  - description rewritten
- `svc/fs.jfs.user`
  - description rewritten
- `svc/fs.jfs2.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.jfs2.disable`
  - description rewritten
- `svc/fs.jfs2.group`
  - description rewritten
- `svc/fs.jfs2.install`
  - description rewritten
- `svc/fs.jfs2.user`
  - description rewritten
- `svc/fs.lofs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.lofs.disable`
  - description rewritten
- `svc/fs.lofs.group`
  - description rewritten
- `svc/fs.lofs.install`
  - description rewritten
- `svc/fs.lofs.user`
  - description rewritten
- `svc/fs.logfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.logfs.disable`
  - description rewritten
- `svc/fs.logfs.group`
  - description rewritten
- `svc/fs.logfs.install`
  - description rewritten
- `svc/fs.logfs.user`
  - description rewritten
- `svc/fs.minix.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.minix.disable`
  - description rewritten
- `svc/fs.minix.group`
  - description rewritten
- `svc/fs.minix.install`
  - description rewritten
- `svc/fs.minix.user`
  - description rewritten
- `svc/fs.msdos.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.msdos.disable`
  - description rewritten
- `svc/fs.msdos.group`
  - description rewritten
- `svc/fs.msdos.install`
  - description rewritten
- `svc/fs.msdos.user`
  - description rewritten
- `svc/fs.ncpfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.ncpfs.disable`
  - description rewritten
- `svc/fs.ncpfs.group`
  - description rewritten
- `svc/fs.ncpfs.install`
  - description rewritten
- `svc/fs.ncpfs.user`
  - description rewritten
- `svc/fs.nfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.nfs.disable`
  - description rewritten
- `svc/fs.nfs.group`
  - description rewritten
- `svc/fs.nfs.install`
  - description rewritten
- `svc/fs.nfs.user`
  - description rewritten
- `svc/fs.nfs4.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.nfs4.disable`
  - description rewritten
- `svc/fs.nfs4.group`
  - description rewritten
- `svc/fs.nfs4.install`
  - description rewritten
- `svc/fs.nfs4.user`
  - description rewritten
- `svc/fs.nilfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.nilfs.disable`
  - description rewritten
- `svc/fs.nilfs.group`
  - description rewritten
- `svc/fs.nilfs.install`
  - description rewritten
- `svc/fs.nilfs.user`
  - description rewritten
- `svc/fs.none.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.none.disable`
  - description rewritten
- `svc/fs.none.group`
  - description rewritten
- `svc/fs.none.install`
  - description rewritten
- `svc/fs.none.user`
  - description rewritten
- `svc/fs.ntfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.ntfs.disable`
  - description rewritten
- `svc/fs.ntfs.group`
  - description rewritten
- `svc/fs.ntfs.install`
  - description rewritten
- `svc/fs.ntfs.user`
  - description rewritten
- `svc/fs.ocfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.ocfs.disable`
  - description rewritten
- `svc/fs.ocfs.group`
  - description rewritten
- `svc/fs.ocfs.install`
  - description rewritten
- `svc/fs.ocfs.user`
  - description rewritten
- `svc/fs.ocfs2.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.ocfs2.disable`
  - description rewritten
- `svc/fs.ocfs2.group`
  - description rewritten
- `svc/fs.ocfs2.install`
  - description rewritten
- `svc/fs.ocfs2.user`
  - description rewritten
- `svc/fs.qnx4.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.qnx4.disable`
  - description rewritten
- `svc/fs.qnx4.group`
  - description rewritten
- `svc/fs.qnx4.install`
  - description rewritten
- `svc/fs.qnx4.user`
  - description rewritten
- `svc/fs.reiserfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.reiserfs.disable`
  - description rewritten
- `svc/fs.reiserfs.group`
  - description rewritten
- `svc/fs.reiserfs.install`
  - description rewritten
- `svc/fs.reiserfs.user`
  - description rewritten
- `svc/fs.reiserfs4.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.reiserfs4.disable`
  - description rewritten
- `svc/fs.reiserfs4.group`
  - description rewritten
- `svc/fs.reiserfs4.install`
  - description rewritten
- `svc/fs.reiserfs4.user`
  - description rewritten
- `svc/fs.rpc_pipefs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.rpc_pipefs.disable`
  - description rewritten
- `svc/fs.rpc_pipefs.group`
  - description rewritten
- `svc/fs.rpc_pipefs.install`
  - description rewritten
- `svc/fs.rpc_pipefs.user`
  - description rewritten
- `svc/fs.sgcp_nfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.sgcp_nfs.disable`
  - description rewritten
- `svc/fs.sgcp_nfs.group`
  - description rewritten
- `svc/fs.sgcp_nfs.install`
  - description rewritten
- `svc/fs.sgcp_nfs.user`
  - description rewritten
- `svc/fs.smbfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.smbfs.disable`
  - description rewritten
- `svc/fs.smbfs.group`
  - description rewritten
- `svc/fs.smbfs.install`
  - description rewritten
- `svc/fs.smbfs.user`
  - description rewritten
- `svc/fs.tmpfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.tmpfs.disable`
  - description rewritten
- `svc/fs.tmpfs.group`
  - description rewritten
- `svc/fs.tmpfs.install`
  - description rewritten
- `svc/fs.tmpfs.user`
  - description rewritten
- `svc/fs.tux3.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.tux3.disable`
  - description rewritten
- `svc/fs.tux3.group`
  - description rewritten
- `svc/fs.tux3.install`
  - description rewritten
- `svc/fs.tux3.user`
  - description rewritten
- `svc/fs.ufs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.ufs.disable`
  - description rewritten
- `svc/fs.ufs.group`
  - description rewritten
- `svc/fs.ufs.install`
  - description rewritten
- `svc/fs.ufs.user`
  - description rewritten
- `svc/fs.ufs2.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.ufs2.disable`
  - description rewritten
- `svc/fs.ufs2.group`
  - description rewritten
- `svc/fs.ufs2.install`
  - description rewritten
- `svc/fs.ufs2.user`
  - description rewritten
- `svc/fs.umsdos.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.umsdos.disable`
  - description rewritten
- `svc/fs.umsdos.group`
  - description rewritten
- `svc/fs.umsdos.install`
  - description rewritten
- `svc/fs.umsdos.user`
  - description rewritten
- `svc/fs.vfat.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.vfat.disable`
  - description rewritten
- `svc/fs.vfat.group`
  - description rewritten
- `svc/fs.vfat.install`
  - description rewritten
- `svc/fs.vfat.user`
  - description rewritten
- `svc/fs.vxfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.vxfs.disable`
  - description rewritten
- `svc/fs.vxfs.group`
  - description rewritten
- `svc/fs.vxfs.install`
  - description rewritten
- `svc/fs.vxfs.user`
  - description rewritten
- `svc/fs.xfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.xfs.disable`
  - description rewritten
- `svc/fs.xfs.group`
  - description rewritten
- `svc/fs.xfs.install`
  - description rewritten
- `svc/fs.xfs.user`
  - description rewritten
- `svc/fs.xia.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.xia.disable`
  - description rewritten
- `svc/fs.xia.group`
  - description rewritten
- `svc/fs.xia.install`
  - description rewritten
- `svc/fs.xia.user`
  - description rewritten
- `svc/fs.zfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/fs.zfs.disable`
  - description rewritten
- `svc/fs.zfs.group`
  - description rewritten
- `svc/fs.zfs.install`
  - description rewritten
- `svc/fs.zfs.user`
  - description rewritten
- `svc/ip.cni.disable`
  - description rewritten
- `svc/ip.docker.disable`
  - description rewritten
- `svc/ip.host.disable`
  - description rewritten
- `svc/ip.netns.disable`
  - description rewritten
- `svc/ip.route.disable`
  - description rewritten
- `svc/ip.rule.disable`
  - description rewritten
- `svc/ip.sgcp_dnsalias.disable`
  - description rewritten
- `svc/share.nfs.disable`
  - description rewritten
- `svc/sync.btrfs.disable`
  - description rewritten
- `svc/sync.btrfssnap.disable`
  - description rewritten
- `svc/sync.rsync.disable`
  - description rewritten
- `svc/sync.store.disable`
  - description rewritten
- `svc/sync.symsnapvx.disable`
  - description rewritten
- `svc/sync.symsrdfs.disable`
  - description rewritten
- `svc/sync.zfs.disable`
  - description rewritten
- `svc/sync.zfssnap.disable`
  - description rewritten
- `svc/task.acme.disable`
  - description rewritten
- `svc/task.docker.disable`
  - description rewritten
- `svc/task.host.disable`
  - description rewritten
- `svc/task.oci.disable`
  - description rewritten
- `svc/task.oci.userns`
  - description rewritten
- `svc/task.podman.disable`
  - description rewritten
- `svc/volume..dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `svc/volume..disable`
  - description rewritten
- `svc/volume..group`
  - description rewritten
- `svc/volume..install`
  - description rewritten
- `svc/volume..user`
  - description rewritten
- `usr/DEFAULT.grant`
  - description rewritten
- `vol/DEFAULT.disable`
  - description rewritten
- `vol/disk.crypt.disable`
  - description rewritten
- `vol/disk.disk.disable`
  - description rewritten
- `vol/disk.drbd.disable`
  - description rewritten
- `vol/disk.hp3par.disable`
  - description rewritten
- `vol/disk.loop.disable`
  - description rewritten
- `vol/disk.lv.disable`
  - description rewritten
- `vol/disk.lvm.disable`
  - description rewritten
- `vol/disk.md.disable`
  - description rewritten
- `vol/disk.rados.disable`
  - description rewritten
- `vol/disk.raw.disable`
  - description rewritten
- `vol/disk.sgcp_nfs_cg.disable`
  - description rewritten
- `vol/disk.vg.disable`
  - description rewritten
- `vol/disk.xp8.disable`
  - description rewritten
- `vol/disk.zpool.disable`
  - description rewritten
- `vol/disk.zvol.disable`
  - description rewritten
- `vol/fs.9pfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.9pfs.disable`
  - description rewritten
- `vol/fs.9pfs.group`
  - description rewritten
- `vol/fs.9pfs.install`
  - description rewritten
- `vol/fs.9pfs.user`
  - description rewritten
- `vol/fs.afs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.afs.disable`
  - description rewritten
- `vol/fs.afs.group`
  - description rewritten
- `vol/fs.afs.install`
  - description rewritten
- `vol/fs.afs.user`
  - description rewritten
- `vol/fs.bfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.bfs.disable`
  - description rewritten
- `vol/fs.bfs.group`
  - description rewritten
- `vol/fs.bfs.install`
  - description rewritten
- `vol/fs.bfs.user`
  - description rewritten
- `vol/fs.bind.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.bind.disable`
  - description rewritten
- `vol/fs.bind.group`
  - description rewritten
- `vol/fs.bind.install`
  - description rewritten
- `vol/fs.bind.user`
  - description rewritten
- `vol/fs.btrfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.btrfs.disable`
  - description rewritten
- `vol/fs.btrfs.group`
  - description rewritten
- `vol/fs.btrfs.install`
  - description rewritten
- `vol/fs.btrfs.user`
  - description rewritten
- `vol/fs.cephfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.cephfs.disable`
  - description rewritten
- `vol/fs.cephfs.group`
  - description rewritten
- `vol/fs.cephfs.install`
  - description rewritten
- `vol/fs.cephfs.user`
  - description rewritten
- `vol/fs.cifs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.cifs.disable`
  - description rewritten
- `vol/fs.cifs.group`
  - description rewritten
- `vol/fs.cifs.install`
  - description rewritten
- `vol/fs.cifs.user`
  - description rewritten
- `vol/fs.directory.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.directory.disable`
  - description rewritten
- `vol/fs.directory.group`
  - description rewritten
- `vol/fs.directory.install`
  - description rewritten
- `vol/fs.directory.user`
  - description rewritten
- `vol/fs.ext2.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.ext2.disable`
  - description rewritten
- `vol/fs.ext2.group`
  - description rewritten
- `vol/fs.ext2.install`
  - description rewritten
- `vol/fs.ext2.user`
  - description rewritten
- `vol/fs.ext3.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.ext3.disable`
  - description rewritten
- `vol/fs.ext3.group`
  - description rewritten
- `vol/fs.ext3.install`
  - description rewritten
- `vol/fs.ext3.user`
  - description rewritten
- `vol/fs.ext4.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.ext4.disable`
  - description rewritten
- `vol/fs.ext4.group`
  - description rewritten
- `vol/fs.ext4.install`
  - description rewritten
- `vol/fs.ext4.user`
  - description rewritten
- `vol/fs.f2fs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.f2fs.disable`
  - description rewritten
- `vol/fs.f2fs.group`
  - description rewritten
- `vol/fs.f2fs.install`
  - description rewritten
- `vol/fs.f2fs.user`
  - description rewritten
- `vol/fs.flag.disable`
  - description rewritten
- `vol/fs.gfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.gfs.disable`
  - description rewritten
- `vol/fs.gfs.group`
  - description rewritten
- `vol/fs.gfs.install`
  - description rewritten
- `vol/fs.gfs.user`
  - description rewritten
- `vol/fs.gfs2.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.gfs2.disable`
  - description rewritten
- `vol/fs.gfs2.group`
  - description rewritten
- `vol/fs.gfs2.install`
  - description rewritten
- `vol/fs.gfs2.user`
  - description rewritten
- `vol/fs.glusterfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.glusterfs.disable`
  - description rewritten
- `vol/fs.glusterfs.group`
  - description rewritten
- `vol/fs.glusterfs.install`
  - description rewritten
- `vol/fs.glusterfs.user`
  - description rewritten
- `vol/fs.gpfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.gpfs.disable`
  - description rewritten
- `vol/fs.gpfs.group`
  - description rewritten
- `vol/fs.gpfs.install`
  - description rewritten
- `vol/fs.gpfs.user`
  - description rewritten
- `vol/fs.hfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.hfs.disable`
  - description rewritten
- `vol/fs.hfs.group`
  - description rewritten
- `vol/fs.hfs.install`
  - description rewritten
- `vol/fs.hfs.user`
  - description rewritten
- `vol/fs.hfsplus.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.hfsplus.disable`
  - description rewritten
- `vol/fs.hfsplus.group`
  - description rewritten
- `vol/fs.hfsplus.install`
  - description rewritten
- `vol/fs.hfsplus.user`
  - description rewritten
- `vol/fs.hpfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.hpfs.disable`
  - description rewritten
- `vol/fs.hpfs.group`
  - description rewritten
- `vol/fs.hpfs.install`
  - description rewritten
- `vol/fs.hpfs.user`
  - description rewritten
- `vol/fs.jffs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.jffs.disable`
  - description rewritten
- `vol/fs.jffs.group`
  - description rewritten
- `vol/fs.jffs.install`
  - description rewritten
- `vol/fs.jffs.user`
  - description rewritten
- `vol/fs.jffs2.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.jffs2.disable`
  - description rewritten
- `vol/fs.jffs2.group`
  - description rewritten
- `vol/fs.jffs2.install`
  - description rewritten
- `vol/fs.jffs2.user`
  - description rewritten
- `vol/fs.jfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.jfs.disable`
  - description rewritten
- `vol/fs.jfs.group`
  - description rewritten
- `vol/fs.jfs.install`
  - description rewritten
- `vol/fs.jfs.user`
  - description rewritten
- `vol/fs.jfs2.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.jfs2.disable`
  - description rewritten
- `vol/fs.jfs2.group`
  - description rewritten
- `vol/fs.jfs2.install`
  - description rewritten
- `vol/fs.jfs2.user`
  - description rewritten
- `vol/fs.lofs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.lofs.disable`
  - description rewritten
- `vol/fs.lofs.group`
  - description rewritten
- `vol/fs.lofs.install`
  - description rewritten
- `vol/fs.lofs.user`
  - description rewritten
- `vol/fs.logfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.logfs.disable`
  - description rewritten
- `vol/fs.logfs.group`
  - description rewritten
- `vol/fs.logfs.install`
  - description rewritten
- `vol/fs.logfs.user`
  - description rewritten
- `vol/fs.minix.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.minix.disable`
  - description rewritten
- `vol/fs.minix.group`
  - description rewritten
- `vol/fs.minix.install`
  - description rewritten
- `vol/fs.minix.user`
  - description rewritten
- `vol/fs.msdos.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.msdos.disable`
  - description rewritten
- `vol/fs.msdos.group`
  - description rewritten
- `vol/fs.msdos.install`
  - description rewritten
- `vol/fs.msdos.user`
  - description rewritten
- `vol/fs.ncpfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.ncpfs.disable`
  - description rewritten
- `vol/fs.ncpfs.group`
  - description rewritten
- `vol/fs.ncpfs.install`
  - description rewritten
- `vol/fs.ncpfs.user`
  - description rewritten
- `vol/fs.nfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.nfs.disable`
  - description rewritten
- `vol/fs.nfs.group`
  - description rewritten
- `vol/fs.nfs.install`
  - description rewritten
- `vol/fs.nfs.user`
  - description rewritten
- `vol/fs.nfs4.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.nfs4.disable`
  - description rewritten
- `vol/fs.nfs4.group`
  - description rewritten
- `vol/fs.nfs4.install`
  - description rewritten
- `vol/fs.nfs4.user`
  - description rewritten
- `vol/fs.nilfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.nilfs.disable`
  - description rewritten
- `vol/fs.nilfs.group`
  - description rewritten
- `vol/fs.nilfs.install`
  - description rewritten
- `vol/fs.nilfs.user`
  - description rewritten
- `vol/fs.none.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.none.disable`
  - description rewritten
- `vol/fs.none.group`
  - description rewritten
- `vol/fs.none.install`
  - description rewritten
- `vol/fs.none.user`
  - description rewritten
- `vol/fs.ntfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.ntfs.disable`
  - description rewritten
- `vol/fs.ntfs.group`
  - description rewritten
- `vol/fs.ntfs.install`
  - description rewritten
- `vol/fs.ntfs.user`
  - description rewritten
- `vol/fs.ocfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.ocfs.disable`
  - description rewritten
- `vol/fs.ocfs.group`
  - description rewritten
- `vol/fs.ocfs.install`
  - description rewritten
- `vol/fs.ocfs.user`
  - description rewritten
- `vol/fs.ocfs2.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.ocfs2.disable`
  - description rewritten
- `vol/fs.ocfs2.group`
  - description rewritten
- `vol/fs.ocfs2.install`
  - description rewritten
- `vol/fs.ocfs2.user`
  - description rewritten
- `vol/fs.qnx4.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.qnx4.disable`
  - description rewritten
- `vol/fs.qnx4.group`
  - description rewritten
- `vol/fs.qnx4.install`
  - description rewritten
- `vol/fs.qnx4.user`
  - description rewritten
- `vol/fs.reiserfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.reiserfs.disable`
  - description rewritten
- `vol/fs.reiserfs.group`
  - description rewritten
- `vol/fs.reiserfs.install`
  - description rewritten
- `vol/fs.reiserfs.user`
  - description rewritten
- `vol/fs.reiserfs4.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.reiserfs4.disable`
  - description rewritten
- `vol/fs.reiserfs4.group`
  - description rewritten
- `vol/fs.reiserfs4.install`
  - description rewritten
- `vol/fs.reiserfs4.user`
  - description rewritten
- `vol/fs.rpc_pipefs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.rpc_pipefs.disable`
  - description rewritten
- `vol/fs.rpc_pipefs.group`
  - description rewritten
- `vol/fs.rpc_pipefs.install`
  - description rewritten
- `vol/fs.rpc_pipefs.user`
  - description rewritten
- `vol/fs.sgcp_nfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.sgcp_nfs.disable`
  - description rewritten
- `vol/fs.sgcp_nfs.group`
  - description rewritten
- `vol/fs.sgcp_nfs.install`
  - description rewritten
- `vol/fs.sgcp_nfs.user`
  - description rewritten
- `vol/fs.smbfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.smbfs.disable`
  - description rewritten
- `vol/fs.smbfs.group`
  - description rewritten
- `vol/fs.smbfs.install`
  - description rewritten
- `vol/fs.smbfs.user`
  - description rewritten
- `vol/fs.tmpfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.tmpfs.disable`
  - description rewritten
- `vol/fs.tmpfs.group`
  - description rewritten
- `vol/fs.tmpfs.install`
  - description rewritten
- `vol/fs.tmpfs.user`
  - description rewritten
- `vol/fs.tux3.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.tux3.disable`
  - description rewritten
- `vol/fs.tux3.group`
  - description rewritten
- `vol/fs.tux3.install`
  - description rewritten
- `vol/fs.tux3.user`
  - description rewritten
- `vol/fs.ufs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.ufs.disable`
  - description rewritten
- `vol/fs.ufs.group`
  - description rewritten
- `vol/fs.ufs.install`
  - description rewritten
- `vol/fs.ufs.user`
  - description rewritten
- `vol/fs.ufs2.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.ufs2.disable`
  - description rewritten
- `vol/fs.ufs2.group`
  - description rewritten
- `vol/fs.ufs2.install`
  - description rewritten
- `vol/fs.ufs2.user`
  - description rewritten
- `vol/fs.umsdos.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.umsdos.disable`
  - description rewritten
- `vol/fs.umsdos.group`
  - description rewritten
- `vol/fs.umsdos.install`
  - description rewritten
- `vol/fs.umsdos.user`
  - description rewritten
- `vol/fs.vfat.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.vfat.disable`
  - description rewritten
- `vol/fs.vfat.group`
  - description rewritten
- `vol/fs.vfat.install`
  - description rewritten
- `vol/fs.vfat.user`
  - description rewritten
- `vol/fs.vxfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.vxfs.disable`
  - description rewritten
- `vol/fs.vxfs.group`
  - description rewritten
- `vol/fs.vxfs.install`
  - description rewritten
- `vol/fs.vxfs.user`
  - description rewritten
- `vol/fs.xfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.xfs.disable`
  - description rewritten
- `vol/fs.xfs.group`
  - description rewritten
- `vol/fs.xfs.install`
  - description rewritten
- `vol/fs.xfs.user`
  - description rewritten
- `vol/fs.xia.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.xia.disable`
  - description rewritten
- `vol/fs.xia.group`
  - description rewritten
- `vol/fs.xia.install`
  - description rewritten
- `vol/fs.xia.user`
  - description rewritten
- `vol/fs.zfs.dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/fs.zfs.disable`
  - description rewritten
- `vol/fs.zfs.group`
  - description rewritten
- `vol/fs.zfs.install`
  - description rewritten
- `vol/fs.zfs.user`
  - description rewritten
- `vol/ip.sgcp_dnsalias.disable`
  - description rewritten
- `vol/share.nfs.disable`
  - description rewritten
- `vol/sync.btrfs.disable`
  - description rewritten
- `vol/sync.btrfssnap.disable`
  - description rewritten
- `vol/sync.rsync.disable`
  - description rewritten
- `vol/sync.store.disable`
  - description rewritten
- `vol/sync.symsnapvx.disable`
  - description rewritten
- `vol/sync.symsrdfs.disable`
  - description rewritten
- `vol/sync.zfs.disable`
  - description rewritten
- `vol/sync.zfssnap.disable`
  - description rewritten
- `vol/task.docker.disable`
  - description rewritten
- `vol/task.host.disable`
  - description rewritten
- `vol/task.oci.disable`
  - description rewritten
- `vol/task.oci.userns`
  - description rewritten
- `vol/task.podman.disable`
  - description rewritten
- `vol/volume..dirperm`
  - defaultText: The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the permission of the head directory of the receiver is unchecked
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644
 -> The value of `perm` with the execute bit added to each class (user,
group, other) that has the read bit set. For example, `perm = 0640`
implies `dirperm = 0750`: user gets `x` because user has `r`, group
gets `x` because group has `r`, other gets neither because other has
no `r`.

If `perm` is also not set,
* the mode of the volume root is left as it is, its owner given by `user` and `group` when set
* the permission of other directories defaults to 0755
* the permission of files from sec objects defaults to 0600
* the permission of other files defaults to 0644

  - description rewritten
- `vol/volume..disable`
  - description rewritten
- `vol/volume..group`
  - description rewritten
- `vol/volume..install`
  - description rewritten
- `vol/volume..user`
  - description rewritten

## v3.0.0-rc57


### Added

- `cluster/listener.public_metrics`
- `cluster/listener.vsock_port`
- `cluster/node.allowed_cidrs`
- `cluster/node.allowed_urls`
- `cluster/pool.loop.fs_type`
- `node/listener.public_metrics`
- `node/listener.vsock_port`
- `node/node.allowed_cidrs`
- `node/node.allowed_urls`
- `node/pool.loop.fs_type`
- `svc/container.kvm.bridge`
- `svc/container.kvm.cdrom`
- `svc/container.kvm.cloud_init`
- `svc/container.kvm.disk`
- `svc/container.kvm.image`
- `svc/container.kvm.memory`
- `svc/container.kvm.network`
- `svc/container.kvm.network_filter`
- `svc/container.kvm.osinfo`
- `svc/container.kvm.vcpus`
- `svc/container.kvm.virtinst_args`
- `svc/container.kvm.vsock_port`

### Changed

- `cluster/network.lan.dev`
  - description rewritten
- `cluster/pool.dorado.fs_type`
  - types: dorado, drbd, freenas, hoc, loop, pure, rados, symmetrix, truenas, vg -> dorado, drbd, freenas, hoc, pure, rados, symmetrix, truenas, vg
- `cluster/pool.type`
  - default: directory -> loop
  - description rewritten
- `node/network.lan.dev`
  - description rewritten
- `node/pool.dorado.fs_type`
  - types: dorado, drbd, freenas, hoc, loop, pure, rados, symmetrix, truenas, vg -> dorado, drbd, freenas, hoc, pure, rados, symmetrix, truenas, vg
- `node/pool.type`
  - default: directory -> loop
  - description rewritten
- `svc/app.forking.configs_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `svc/app.forking.environment`
  - description rewritten
- `svc/app.forking.secrets_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `svc/app.simple.configs_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `svc/app.simple.environment`
  - description rewritten
- `svc/app.simple.secrets_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `svc/container.docker.configs_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `svc/container.docker.environment`
  - description rewritten
- `svc/container.docker.secrets_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `svc/container.kvm.name`
  - required: true -> unset
- `svc/container.kvm.virtinst`
  - description rewritten
- `svc/container.lxc.create_configs_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> create_environment
- `svc/container.lxc.create_environment`
  - description rewritten
- `svc/container.lxc.create_secrets_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> create_environment
- `svc/container.oci.configs_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `svc/container.oci.environment`
  - description rewritten
- `svc/container.oci.secrets_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `svc/container.podman.configs_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `svc/container.podman.environment`
  - description rewritten
- `svc/container.podman.secrets_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `svc/task.docker.configs_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `svc/task.docker.environment`
  - description rewritten
- `svc/task.docker.secrets_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `svc/task.host.configs_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `svc/task.host.environment`
  - description rewritten
- `svc/task.host.secrets_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `svc/task.oci.configs_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `svc/task.oci.environment`
  - description rewritten
- `svc/task.oci.secrets_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `svc/task.podman.configs_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `svc/task.podman.environment`
  - description rewritten
- `svc/task.podman.secrets_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `usr/DEFAULT.grant`
  - description rewritten
- `vol/task.docker.configs_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `vol/task.docker.environment`
  - description rewritten
- `vol/task.docker.secrets_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `vol/task.host.configs_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `vol/task.host.environment`
  - description rewritten
- `vol/task.host.secrets_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `vol/task.oci.configs_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `vol/task.oci.environment`
  - description rewritten
- `vol/task.oci.secrets_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `vol/task.podman.configs_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment
- `vol/task.podman.environment`
  - description rewritten
- `vol/task.podman.secrets_environment`
  - deprecated: unset -> v3.0.0-rc57
  - replacedBy: unset -> environment

## v3.0.0-rc56


### Added

- `cluster/ai.agent_url`
- `cluster/listener.throttle_burst`
- `cluster/listener.throttle_expires`
- `cluster/listener.throttle_rate`
- `cluster/listener.ux_owner_group`
- `cluster/pool.vg.thin_pool`
- `cluster/store.keep`
- `cluster/store.schedule`
- `cluster/store.tar.host_key`
- `cluster/store.tar.shared`
- `cluster/store.tar.ssh_private_key`
- `cluster/store.tar.url`
- `cluster/store.type`
- `cluster/uxgroup.grant`
- `node/ai.agent_url`
- `node/listener.throttle_burst`
- `node/listener.throttle_expires`
- `node/listener.throttle_rate`
- `node/listener.ux_owner_group`
- `node/pool.vg.thin_pool`
- `node/store.keep`
- `node/store.schedule`
- `node/store.tar.host_key`
- `node/store.tar.shared`
- `node/store.tar.ssh_private_key`
- `node/store.tar.url`
- `node/store.type`
- `node/uxgroup.grant`
- `sec/store.keep`
- `sec/store.tar.host_key`
- `sec/store.tar.ssh_private_key`
- `sec/store.tar.url`
- `sec/store.type`
- `svc/DEFAULT.restore_from`
- `svc/app.forking.quiesce`
- `svc/app.forking.resume`
- `svc/app.simple.kill`
- `svc/app.simple.quiesce`
- `svc/app.simple.resume`
- `svc/container.docker.quiesce`
- `svc/container.docker.quiesce_input`
- `svc/container.docker.quiesce_ready`
- `svc/container.docker.quiesce_timeout`
- `svc/container.docker.resume_input`
- `svc/container.docker.uxgrant`
- `svc/container.oci.quiesce`
- `svc/container.oci.quiesce_input`
- `svc/container.oci.quiesce_ready`
- `svc/container.oci.quiesce_timeout`
- `svc/container.oci.resume_input`
- `svc/container.oci.uxgrant`
- `svc/container.podman.quiesce`
- `svc/container.podman.quiesce_input`
- `svc/container.podman.quiesce_ready`
- `svc/container.podman.quiesce_timeout`
- `svc/container.podman.resume_input`
- `svc/container.podman.uxgrant`
- `svc/disk.lv.thin_pool`
- `svc/sync.store.blocking_post_provision`
- `svc/sync.store.blocking_post_unprovision`
- `svc/sync.store.blocking_pre_provision`
- `svc/sync.store.blocking_pre_unprovision`
- `svc/sync.store.disable`
- `svc/sync.store.encap`
- `svc/sync.store.exclude`
- `svc/sync.store.include_refs`
- `svc/sync.store.keep`
- `svc/sync.store.log`
- `svc/sync.store.max_delay`
- `svc/sync.store.monitor`
- `svc/sync.store.optional`
- `svc/sync.store.post_provision`
- `svc/sync.store.post_unprovision`
- `svc/sync.store.pre_provision`
- `svc/sync.store.pre_unprovision`
- `svc/sync.store.provision`
- `svc/sync.store.provision_requires`
- `svc/sync.store.rids`
- `svc/sync.store.schedule`
- `svc/sync.store.shared`
- `svc/sync.store.snapshot`
- `svc/sync.store.standby`
- `svc/sync.store.store`
- `svc/sync.store.subset`
- `svc/sync.store.tags`
- `svc/sync.store.unprovision`
- `svc/sync.store.unprovision_requires`
- `svc/sync.store.update_requires`
- `svc/volume..exclusive`
- `svc/volume..snap`
- `usr/DEFAULT.uxuser`
- `vol/DEFAULT.restore_from`
- `vol/disk.lv.thin_pool`
- `vol/sync.store.blocking_post_provision`
- `vol/sync.store.blocking_post_unprovision`
- `vol/sync.store.blocking_pre_provision`
- `vol/sync.store.blocking_pre_unprovision`
- `vol/sync.store.disable`
- `vol/sync.store.encap`
- `vol/sync.store.exclude`
- `vol/sync.store.include_refs`
- `vol/sync.store.keep`
- `vol/sync.store.log`
- `vol/sync.store.max_delay`
- `vol/sync.store.monitor`
- `vol/sync.store.optional`
- `vol/sync.store.post_provision`
- `vol/sync.store.post_unprovision`
- `vol/sync.store.pre_provision`
- `vol/sync.store.pre_unprovision`
- `vol/sync.store.provision`
- `vol/sync.store.provision_requires`
- `vol/sync.store.rids`
- `vol/sync.store.schedule`
- `vol/sync.store.shared`
- `vol/sync.store.snapshot`
- `vol/sync.store.standby`
- `vol/sync.store.store`
- `vol/sync.store.subset`
- `vol/sync.store.tags`
- `vol/sync.store.unprovision`
- `vol/sync.store.unprovision_requires`
- `vol/sync.store.update_requires`
- `vol/volume..exclusive`
- `vol/volume..snap`

### Removed

- `cluster/listener.rate_limiter_burst`
- `cluster/listener.rate_limiter_expires`
- `cluster/listener.rate_limiter_rate`
- `node/backup.schedule`
- `node/listener.rate_limiter_burst`
- `node/listener.rate_limiter_expires`
- `node/listener.rate_limiter_rate`

### Changed

- `cluster/node.max_parallel`
  - description rewritten
- `node/node.max_parallel`
  - description rewritten
- `svc/app.simple.check`
  - description rewritten
- `svc/app.simple.stop`
  - description rewritten
- `svc/disk.drbd.disk`
  - description rewritten
- `svc/disk.zpool.vdev`
  - description rewritten
- `svc/fs.9pfs.mnt`
  - description rewritten
- `svc/fs.9pfs.zone`
  - description rewritten
- `svc/fs.afs.mnt`
  - description rewritten
- `svc/fs.afs.zone`
  - description rewritten
- `svc/fs.bfs.mnt`
  - description rewritten
- `svc/fs.bfs.zone`
  - description rewritten
- `svc/fs.bind.mnt`
  - description rewritten
- `svc/fs.bind.zone`
  - description rewritten
- `svc/fs.btrfs.mnt`
  - description rewritten
- `svc/fs.btrfs.zone`
  - description rewritten
- `svc/fs.cephfs.mnt`
  - description rewritten
- `svc/fs.cephfs.zone`
  - description rewritten
- `svc/fs.cifs.mnt`
  - description rewritten
- `svc/fs.cifs.zone`
  - description rewritten
- `svc/fs.ext2.mnt`
  - description rewritten
- `svc/fs.ext2.zone`
  - description rewritten
- `svc/fs.ext3.mnt`
  - description rewritten
- `svc/fs.ext3.zone`
  - description rewritten
- `svc/fs.ext4.mnt`
  - description rewritten
- `svc/fs.ext4.zone`
  - description rewritten
- `svc/fs.f2fs.mnt`
  - description rewritten
- `svc/fs.f2fs.zone`
  - description rewritten
- `svc/fs.gfs.mnt`
  - description rewritten
- `svc/fs.gfs.zone`
  - description rewritten
- `svc/fs.gfs2.mnt`
  - description rewritten
- `svc/fs.gfs2.zone`
  - description rewritten
- `svc/fs.glusterfs.mnt`
  - description rewritten
- `svc/fs.glusterfs.zone`
  - description rewritten
- `svc/fs.gpfs.mnt`
  - description rewritten
- `svc/fs.gpfs.zone`
  - description rewritten
- `svc/fs.hfs.mnt`
  - description rewritten
- `svc/fs.hfs.zone`
  - description rewritten
- `svc/fs.hfsplus.mnt`
  - description rewritten
- `svc/fs.hfsplus.zone`
  - description rewritten
- `svc/fs.hpfs.mnt`
  - description rewritten
- `svc/fs.hpfs.zone`
  - description rewritten
- `svc/fs.jffs.mnt`
  - description rewritten
- `svc/fs.jffs.zone`
  - description rewritten
- `svc/fs.jffs2.mnt`
  - description rewritten
- `svc/fs.jffs2.zone`
  - description rewritten
- `svc/fs.jfs.mnt`
  - description rewritten
- `svc/fs.jfs.zone`
  - description rewritten
- `svc/fs.jfs2.mnt`
  - description rewritten
- `svc/fs.jfs2.zone`
  - description rewritten
- `svc/fs.lofs.mnt`
  - description rewritten
- `svc/fs.lofs.zone`
  - description rewritten
- `svc/fs.logfs.mnt`
  - description rewritten
- `svc/fs.logfs.zone`
  - description rewritten
- `svc/fs.minix.mnt`
  - description rewritten
- `svc/fs.minix.zone`
  - description rewritten
- `svc/fs.msdos.mnt`
  - description rewritten
- `svc/fs.msdos.zone`
  - description rewritten
- `svc/fs.ncpfs.mnt`
  - description rewritten
- `svc/fs.ncpfs.zone`
  - description rewritten
- `svc/fs.nfs.mnt`
  - description rewritten
- `svc/fs.nfs.zone`
  - description rewritten
- `svc/fs.nfs4.mnt`
  - description rewritten
- `svc/fs.nfs4.zone`
  - description rewritten
- `svc/fs.nilfs.mnt`
  - description rewritten
- `svc/fs.nilfs.zone`
  - description rewritten
- `svc/fs.none.mnt`
  - description rewritten
- `svc/fs.none.zone`
  - description rewritten
- `svc/fs.ntfs.mnt`
  - description rewritten
- `svc/fs.ntfs.zone`
  - description rewritten
- `svc/fs.ocfs.mnt`
  - description rewritten
- `svc/fs.ocfs.zone`
  - description rewritten
- `svc/fs.ocfs2.mnt`
  - description rewritten
- `svc/fs.ocfs2.zone`
  - description rewritten
- `svc/fs.qnx4.mnt`
  - description rewritten
- `svc/fs.qnx4.zone`
  - description rewritten
- `svc/fs.reiserfs.mnt`
  - description rewritten
- `svc/fs.reiserfs.zone`
  - description rewritten
- `svc/fs.reiserfs4.mnt`
  - description rewritten
- `svc/fs.reiserfs4.zone`
  - description rewritten
- `svc/fs.rpc_pipefs.mnt`
  - description rewritten
- `svc/fs.rpc_pipefs.zone`
  - description rewritten
- `svc/fs.sgcp_nfs.mnt`
  - description rewritten
- `svc/fs.sgcp_nfs.zone`
  - description rewritten
- `svc/fs.smbfs.mnt`
  - description rewritten
- `svc/fs.smbfs.zone`
  - description rewritten
- `svc/fs.tmpfs.mnt`
  - description rewritten
- `svc/fs.tmpfs.zone`
  - description rewritten
- `svc/fs.tux3.mnt`
  - description rewritten
- `svc/fs.tux3.zone`
  - description rewritten
- `svc/fs.ufs.mnt`
  - description rewritten
- `svc/fs.ufs.zone`
  - description rewritten
- `svc/fs.ufs2.mnt`
  - description rewritten
- `svc/fs.ufs2.zone`
  - description rewritten
- `svc/fs.umsdos.mnt`
  - description rewritten
- `svc/fs.umsdos.zone`
  - description rewritten
- `svc/fs.vfat.mnt`
  - description rewritten
- `svc/fs.vfat.zone`
  - description rewritten
- `svc/fs.vxfs.mnt`
  - description rewritten
- `svc/fs.vxfs.zone`
  - description rewritten
- `svc/fs.xfs.mnt`
  - description rewritten
- `svc/fs.xfs.zone`
  - description rewritten
- `svc/fs.xia.mnt`
  - description rewritten
- `svc/fs.xia.zone`
  - description rewritten
- `svc/fs.zfs.mnt`
  - description rewritten
- `svc/fs.zfs.zone`
  - description rewritten
- `vol/disk.drbd.disk`
  - description rewritten
- `vol/disk.zpool.vdev`
  - description rewritten
- `vol/fs.9pfs.mnt`
  - description rewritten
- `vol/fs.9pfs.zone`
  - description rewritten
- `vol/fs.afs.mnt`
  - description rewritten
- `vol/fs.afs.zone`
  - description rewritten
- `vol/fs.bfs.mnt`
  - description rewritten
- `vol/fs.bfs.zone`
  - description rewritten
- `vol/fs.bind.mnt`
  - description rewritten
- `vol/fs.bind.zone`
  - description rewritten
- `vol/fs.btrfs.mnt`
  - description rewritten
- `vol/fs.btrfs.zone`
  - description rewritten
- `vol/fs.cephfs.mnt`
  - description rewritten
- `vol/fs.cephfs.zone`
  - description rewritten
- `vol/fs.cifs.mnt`
  - description rewritten
- `vol/fs.cifs.zone`
  - description rewritten
- `vol/fs.ext2.mnt`
  - description rewritten
- `vol/fs.ext2.zone`
  - description rewritten
- `vol/fs.ext3.mnt`
  - description rewritten
- `vol/fs.ext3.zone`
  - description rewritten
- `vol/fs.ext4.mnt`
  - description rewritten
- `vol/fs.ext4.zone`
  - description rewritten
- `vol/fs.f2fs.mnt`
  - description rewritten
- `vol/fs.f2fs.zone`
  - description rewritten
- `vol/fs.gfs.mnt`
  - description rewritten
- `vol/fs.gfs.zone`
  - description rewritten
- `vol/fs.gfs2.mnt`
  - description rewritten
- `vol/fs.gfs2.zone`
  - description rewritten
- `vol/fs.glusterfs.mnt`
  - description rewritten
- `vol/fs.glusterfs.zone`
  - description rewritten
- `vol/fs.gpfs.mnt`
  - description rewritten
- `vol/fs.gpfs.zone`
  - description rewritten
- `vol/fs.hfs.mnt`
  - description rewritten
- `vol/fs.hfs.zone`
  - description rewritten
- `vol/fs.hfsplus.mnt`
  - description rewritten
- `vol/fs.hfsplus.zone`
  - description rewritten
- `vol/fs.hpfs.mnt`
  - description rewritten
- `vol/fs.hpfs.zone`
  - description rewritten
- `vol/fs.jffs.mnt`
  - description rewritten
- `vol/fs.jffs.zone`
  - description rewritten
- `vol/fs.jffs2.mnt`
  - description rewritten
- `vol/fs.jffs2.zone`
  - description rewritten
- `vol/fs.jfs.mnt`
  - description rewritten
- `vol/fs.jfs.zone`
  - description rewritten
- `vol/fs.jfs2.mnt`
  - description rewritten
- `vol/fs.jfs2.zone`
  - description rewritten
- `vol/fs.lofs.mnt`
  - description rewritten
- `vol/fs.lofs.zone`
  - description rewritten
- `vol/fs.logfs.mnt`
  - description rewritten
- `vol/fs.logfs.zone`
  - description rewritten
- `vol/fs.minix.mnt`
  - description rewritten
- `vol/fs.minix.zone`
  - description rewritten
- `vol/fs.msdos.mnt`
  - description rewritten
- `vol/fs.msdos.zone`
  - description rewritten
- `vol/fs.ncpfs.mnt`
  - description rewritten
- `vol/fs.ncpfs.zone`
  - description rewritten
- `vol/fs.nfs.mnt`
  - description rewritten
- `vol/fs.nfs.zone`
  - description rewritten
- `vol/fs.nfs4.mnt`
  - description rewritten
- `vol/fs.nfs4.zone`
  - description rewritten
- `vol/fs.nilfs.mnt`
  - description rewritten
- `vol/fs.nilfs.zone`
  - description rewritten
- `vol/fs.none.mnt`
  - description rewritten
- `vol/fs.none.zone`
  - description rewritten
- `vol/fs.ntfs.mnt`
  - description rewritten
- `vol/fs.ntfs.zone`
  - description rewritten
- `vol/fs.ocfs.mnt`
  - description rewritten
- `vol/fs.ocfs.zone`
  - description rewritten
- `vol/fs.ocfs2.mnt`
  - description rewritten
- `vol/fs.ocfs2.zone`
  - description rewritten
- `vol/fs.qnx4.mnt`
  - description rewritten
- `vol/fs.qnx4.zone`
  - description rewritten
- `vol/fs.reiserfs.mnt`
  - description rewritten
- `vol/fs.reiserfs.zone`
  - description rewritten
- `vol/fs.reiserfs4.mnt`
  - description rewritten
- `vol/fs.reiserfs4.zone`
  - description rewritten
- `vol/fs.rpc_pipefs.mnt`
  - description rewritten
- `vol/fs.rpc_pipefs.zone`
  - description rewritten
- `vol/fs.sgcp_nfs.mnt`
  - description rewritten
- `vol/fs.sgcp_nfs.zone`
  - description rewritten
- `vol/fs.smbfs.mnt`
  - description rewritten
- `vol/fs.smbfs.zone`
  - description rewritten
- `vol/fs.tmpfs.mnt`
  - description rewritten
- `vol/fs.tmpfs.zone`
  - description rewritten
- `vol/fs.tux3.mnt`
  - description rewritten
- `vol/fs.tux3.zone`
  - description rewritten
- `vol/fs.ufs.mnt`
  - description rewritten
- `vol/fs.ufs.zone`
  - description rewritten
- `vol/fs.ufs2.mnt`
  - description rewritten
- `vol/fs.ufs2.zone`
  - description rewritten
- `vol/fs.umsdos.mnt`
  - description rewritten
- `vol/fs.umsdos.zone`
  - description rewritten
- `vol/fs.vfat.mnt`
  - description rewritten
- `vol/fs.vfat.zone`
  - description rewritten
- `vol/fs.vxfs.mnt`
  - description rewritten
- `vol/fs.vxfs.zone`
  - description rewritten
- `vol/fs.xfs.mnt`
  - description rewritten
- `vol/fs.xfs.zone`
  - description rewritten
- `vol/fs.xia.mnt`
  - description rewritten
- `vol/fs.xia.zone`
  - description rewritten
- `vol/fs.zfs.mnt`
  - description rewritten
- `vol/fs.zfs.zone`
  - description rewritten

## v3.0.0-rc53


### Added

- `svc/sync.btrfs.log`
- `svc/sync.btrfssnap.log`
- `svc/sync.rsync.log`
- `svc/sync.symsnapvx.log`
- `svc/sync.symsrdfs.log`
- `svc/sync.zfs.log`
- `svc/sync.zfssnap.log`
- `vol/sync.btrfs.log`
- `vol/sync.btrfssnap.log`
- `vol/sync.rsync.log`
- `vol/sync.symsnapvx.log`
- `vol/sync.symsrdfs.log`
- `vol/sync.zfs.log`
- `vol/sync.zfssnap.log`

### Changed

- `svc/task.acme.log`
  - default: true -> false
  - description rewritten
- `svc/task.docker.log`
  - default: true -> false
  - description rewritten
- `svc/task.host.log`
  - default: true -> false
  - description rewritten
- `svc/task.oci.log`
  - default: true -> false
  - description rewritten
- `svc/task.podman.log`
  - default: true -> false
  - description rewritten
- `vol/task.docker.log`
  - default: true -> false
  - description rewritten
- `vol/task.host.log`
  - default: true -> false
  - description rewritten
- `vol/task.oci.log`
  - default: true -> false
  - description rewritten
- `vol/task.podman.log`
  - default: true -> false
  - description rewritten

## v3.0.0-rc52


### Changed

- `svc/DEFAULT.hard_affinity`
  - description rewritten
- `svc/DEFAULT.hard_anti_affinity`
  - description rewritten
- `svc/DEFAULT.soft_affinity`
  - description rewritten
- `svc/DEFAULT.soft_anti_affinity`
  - description rewritten
- `svc/app.simple.stop`
  - description rewritten
- `vol/DEFAULT.hard_affinity`
  - description rewritten
- `vol/DEFAULT.hard_anti_affinity`
  - description rewritten
- `vol/DEFAULT.soft_affinity`
  - description rewritten
- `vol/DEFAULT.soft_anti_affinity`
  - description rewritten

## v3.0.0-rc50


### Changed

- `svc/disk.disk.disk_id`
  - recorded: unset -> true
- `vol/disk.disk.disk_id`
  - recorded: unset -> true

## v3.0.0-rc49


### Added

- `cluster/cluster.dns_reverse`
- `cluster/network.bridge.dns`
- `cluster/network.lan.modes`
- `cluster/network.lan.vlan_mode`
- `cluster/network.lan.vlan_tag`
- `node/cluster.dns_reverse`
- `node/network.bridge.dns`
- `node/network.lan.modes`
- `node/network.lan.vlan_mode`
- `node/network.lan.vlan_tag`
- `svc/task.acme.directory`
- `svc/task.acme.domains_from`
- `svc/task.acme.domains_to`
- `svc/task.acme.email`

### Changed

- `svc/container.docker.volume_mounts`
  - description rewritten
- `svc/container.oci.volume_mounts`
  - description rewritten
- `svc/container.podman.volume_mounts`
  - description rewritten
- `svc/fs.9pfs.install`
  - description rewritten
- `svc/fs.afs.install`
  - description rewritten
- `svc/fs.bfs.install`
  - description rewritten
- `svc/fs.bind.install`
  - description rewritten
- `svc/fs.btrfs.install`
  - description rewritten
- `svc/fs.cephfs.install`
  - description rewritten
- `svc/fs.cifs.install`
  - description rewritten
- `svc/fs.directory.install`
  - description rewritten
- `svc/fs.ext2.install`
  - description rewritten
- `svc/fs.ext3.install`
  - description rewritten
- `svc/fs.ext4.install`
  - description rewritten
- `svc/fs.f2fs.install`
  - description rewritten
- `svc/fs.gfs.install`
  - description rewritten
- `svc/fs.gfs2.install`
  - description rewritten
- `svc/fs.glusterfs.install`
  - description rewritten
- `svc/fs.gpfs.install`
  - description rewritten
- `svc/fs.hfs.install`
  - description rewritten
- `svc/fs.hfsplus.install`
  - description rewritten
- `svc/fs.hpfs.install`
  - description rewritten
- `svc/fs.jffs.install`
  - description rewritten
- `svc/fs.jffs2.install`
  - description rewritten
- `svc/fs.jfs.install`
  - description rewritten
- `svc/fs.jfs2.install`
  - description rewritten
- `svc/fs.lofs.install`
  - description rewritten
- `svc/fs.logfs.install`
  - description rewritten
- `svc/fs.minix.install`
  - description rewritten
- `svc/fs.msdos.install`
  - description rewritten
- `svc/fs.ncpfs.install`
  - description rewritten
- `svc/fs.nfs.install`
  - description rewritten
- `svc/fs.nfs4.install`
  - description rewritten
- `svc/fs.nilfs.install`
  - description rewritten
- `svc/fs.none.install`
  - description rewritten
- `svc/fs.ntfs.install`
  - description rewritten
- `svc/fs.ocfs.install`
  - description rewritten
- `svc/fs.ocfs2.install`
  - description rewritten
- `svc/fs.qnx4.install`
  - description rewritten
- `svc/fs.reiserfs.install`
  - description rewritten
- `svc/fs.reiserfs4.install`
  - description rewritten
- `svc/fs.rpc_pipefs.install`
  - description rewritten
- `svc/fs.sgcp_nfs.install`
  - description rewritten
- `svc/fs.smbfs.install`
  - description rewritten
- `svc/fs.tmpfs.install`
  - description rewritten
- `svc/fs.tux3.install`
  - description rewritten
- `svc/fs.ufs.install`
  - description rewritten
- `svc/fs.ufs2.install`
  - description rewritten
- `svc/fs.umsdos.install`
  - description rewritten
- `svc/fs.vfat.install`
  - description rewritten
- `svc/fs.vxfs.install`
  - description rewritten
- `svc/fs.xfs.install`
  - description rewritten
- `svc/fs.xia.install`
  - description rewritten
- `svc/fs.zfs.install`
  - description rewritten
- `svc/ip.docker.mode`
  - default: bridge -> unset
  - defaultText: unset -> The first of the `modes` of the network the address is drawn from, else `bridge`.

- `svc/ip.docker.vlan_mode`
  - default: native-untagged -> unset
  - defaultText: unset -> The `vlan_mode` of the network the address is drawn from, else `native-untagged`.

- `svc/ip.docker.vlan_tag`
  - description rewritten
- `svc/ip.netns.mode`
  - default: bridge -> unset
  - defaultText: unset -> The first of the `modes` of the network the address is drawn from, else `bridge`.

- `svc/ip.netns.vlan_mode`
  - default: native-untagged -> unset
  - defaultText: unset -> The `vlan_mode` of the network the address is drawn from, else `native-untagged`.

- `svc/ip.netns.vlan_tag`
  - description rewritten
- `svc/task.acme.on`
  - description rewritten
- `svc/task.acme.secs`
  - required: true -> unset
  - description rewritten
- `svc/task.docker.on`
  - description rewritten
- `svc/task.docker.volume_mounts`
  - description rewritten
- `svc/task.host.on`
  - description rewritten
- `svc/task.oci.on`
  - description rewritten
- `svc/task.oci.volume_mounts`
  - description rewritten
- `svc/task.podman.on`
  - description rewritten
- `svc/task.podman.volume_mounts`
  - description rewritten
- `svc/volume..install`
  - description rewritten
- `vol/fs.9pfs.install`
  - description rewritten
- `vol/fs.afs.install`
  - description rewritten
- `vol/fs.bfs.install`
  - description rewritten
- `vol/fs.bind.install`
  - description rewritten
- `vol/fs.btrfs.install`
  - description rewritten
- `vol/fs.cephfs.install`
  - description rewritten
- `vol/fs.cifs.install`
  - description rewritten
- `vol/fs.directory.install`
  - description rewritten
- `vol/fs.ext2.install`
  - description rewritten
- `vol/fs.ext3.install`
  - description rewritten
- `vol/fs.ext4.install`
  - description rewritten
- `vol/fs.f2fs.install`
  - description rewritten
- `vol/fs.gfs.install`
  - description rewritten
- `vol/fs.gfs2.install`
  - description rewritten
- `vol/fs.glusterfs.install`
  - description rewritten
- `vol/fs.gpfs.install`
  - description rewritten
- `vol/fs.hfs.install`
  - description rewritten
- `vol/fs.hfsplus.install`
  - description rewritten
- `vol/fs.hpfs.install`
  - description rewritten
- `vol/fs.jffs.install`
  - description rewritten
- `vol/fs.jffs2.install`
  - description rewritten
- `vol/fs.jfs.install`
  - description rewritten
- `vol/fs.jfs2.install`
  - description rewritten
- `vol/fs.lofs.install`
  - description rewritten
- `vol/fs.logfs.install`
  - description rewritten
- `vol/fs.minix.install`
  - description rewritten
- `vol/fs.msdos.install`
  - description rewritten
- `vol/fs.ncpfs.install`
  - description rewritten
- `vol/fs.nfs.install`
  - description rewritten
- `vol/fs.nfs4.install`
  - description rewritten
- `vol/fs.nilfs.install`
  - description rewritten
- `vol/fs.none.install`
  - description rewritten
- `vol/fs.ntfs.install`
  - description rewritten
- `vol/fs.ocfs.install`
  - description rewritten
- `vol/fs.ocfs2.install`
  - description rewritten
- `vol/fs.qnx4.install`
  - description rewritten
- `vol/fs.reiserfs.install`
  - description rewritten
- `vol/fs.reiserfs4.install`
  - description rewritten
- `vol/fs.rpc_pipefs.install`
  - description rewritten
- `vol/fs.sgcp_nfs.install`
  - description rewritten
- `vol/fs.smbfs.install`
  - description rewritten
- `vol/fs.tmpfs.install`
  - description rewritten
- `vol/fs.tux3.install`
  - description rewritten
- `vol/fs.ufs.install`
  - description rewritten
- `vol/fs.ufs2.install`
  - description rewritten
- `vol/fs.umsdos.install`
  - description rewritten
- `vol/fs.vfat.install`
  - description rewritten
- `vol/fs.vxfs.install`
  - description rewritten
- `vol/fs.xfs.install`
  - description rewritten
- `vol/fs.xia.install`
  - description rewritten
- `vol/fs.zfs.install`
  - description rewritten
- `vol/task.docker.on`
  - description rewritten
- `vol/task.docker.volume_mounts`
  - description rewritten
- `vol/task.host.on`
  - description rewritten
- `vol/task.oci.on`
  - description rewritten
- `vol/task.oci.volume_mounts`
  - description rewritten
- `vol/task.podman.on`
  - description rewritten
- `vol/task.podman.volume_mounts`
  - description rewritten
- `vol/volume..install`
  - description rewritten

## v3.0.0-rc48


### Added

- `cluster/network.lan.dev`
- `cluster/network.lan.gateway`
- `cluster/network.lan.network`
- `cluster/network.lan.ranges`
- `cluster/node.allow_envs`
- `cluster/pool.drbd.network`
- `node/network.lan.dev`
- `node/network.lan.gateway`
- `node/network.lan.network`
- `node/network.lan.ranges`
- `node/node.allow_envs`
- `node/pool.drbd.network`
- `svc/fs.btrfs.label`
- `svc/fs.btrfs.subvol`
- `svc/ip.docker.addr`
- `svc/ip.host.addr`
- `svc/ip.netns.addr`
- `svc/sync.btrfs.blocking_post_provision`
- `svc/sync.btrfs.blocking_post_unprovision`
- `svc/sync.btrfs.blocking_pre_provision`
- `svc/sync.btrfs.blocking_pre_unprovision`
- `svc/sync.btrfs.disable`
- `svc/sync.btrfs.dst`
- `svc/sync.btrfs.encap`
- `svc/sync.btrfs.max_delay`
- `svc/sync.btrfs.max_lag_age`
- `svc/sync.btrfs.monitor`
- `svc/sync.btrfs.optional`
- `svc/sync.btrfs.post_provision`
- `svc/sync.btrfs.post_unprovision`
- `svc/sync.btrfs.pre_provision`
- `svc/sync.btrfs.pre_unprovision`
- `svc/sync.btrfs.provision`
- `svc/sync.btrfs.provision_requires`
- `svc/sync.btrfs.recursive`
- `svc/sync.btrfs.schedule`
- `svc/sync.btrfs.shared`
- `svc/sync.btrfs.src`
- `svc/sync.btrfs.standby`
- `svc/sync.btrfs.subset`
- `svc/sync.btrfs.tags`
- `svc/sync.btrfs.target`
- `svc/sync.btrfs.timeout`
- `svc/sync.btrfs.unprovision`
- `svc/sync.btrfs.unprovision_requires`
- `svc/sync.btrfs.update_requires`
- `svc/sync.btrfssnap.blocking_post_provision`
- `svc/sync.btrfssnap.blocking_post_unprovision`
- `svc/sync.btrfssnap.blocking_pre_provision`
- `svc/sync.btrfssnap.blocking_pre_unprovision`
- `svc/sync.btrfssnap.disable`
- `svc/sync.btrfssnap.encap`
- `svc/sync.btrfssnap.keep`
- `svc/sync.btrfssnap.max_delay`
- `svc/sync.btrfssnap.monitor`
- `svc/sync.btrfssnap.name`
- `svc/sync.btrfssnap.optional`
- `svc/sync.btrfssnap.post_provision`
- `svc/sync.btrfssnap.post_unprovision`
- `svc/sync.btrfssnap.pre_provision`
- `svc/sync.btrfssnap.pre_unprovision`
- `svc/sync.btrfssnap.provision`
- `svc/sync.btrfssnap.provision_requires`
- `svc/sync.btrfssnap.recursive`
- `svc/sync.btrfssnap.schedule`
- `svc/sync.btrfssnap.shared`
- `svc/sync.btrfssnap.standby`
- `svc/sync.btrfssnap.subset`
- `svc/sync.btrfssnap.subvol`
- `svc/sync.btrfssnap.tags`
- `svc/sync.btrfssnap.unprovision`
- `svc/sync.btrfssnap.unprovision_requires`
- `svc/sync.btrfssnap.update_requires`
- `svc/task.acme.install`
- `svc/task.acme.on`
- `svc/task.acme.pace`
- `svc/task.docker.install`
- `svc/task.docker.on`
- `svc/task.docker.pace`
- `svc/task.host.container`
- `svc/task.host.install`
- `svc/task.host.on`
- `svc/task.host.pace`
- `svc/task.oci.install`
- `svc/task.oci.on`
- `svc/task.oci.pace`
- `svc/task.podman.install`
- `svc/task.podman.on`
- `svc/task.podman.pace`
- `vol/fs.btrfs.label`
- `vol/fs.btrfs.subvol`
- `vol/sync.btrfs.blocking_post_provision`
- `vol/sync.btrfs.blocking_post_unprovision`
- `vol/sync.btrfs.blocking_pre_provision`
- `vol/sync.btrfs.blocking_pre_unprovision`
- `vol/sync.btrfs.disable`
- `vol/sync.btrfs.dst`
- `vol/sync.btrfs.encap`
- `vol/sync.btrfs.max_delay`
- `vol/sync.btrfs.max_lag_age`
- `vol/sync.btrfs.monitor`
- `vol/sync.btrfs.optional`
- `vol/sync.btrfs.post_provision`
- `vol/sync.btrfs.post_unprovision`
- `vol/sync.btrfs.pre_provision`
- `vol/sync.btrfs.pre_unprovision`
- `vol/sync.btrfs.provision`
- `vol/sync.btrfs.provision_requires`
- `vol/sync.btrfs.recursive`
- `vol/sync.btrfs.schedule`
- `vol/sync.btrfs.shared`
- `vol/sync.btrfs.src`
- `vol/sync.btrfs.standby`
- `vol/sync.btrfs.subset`
- `vol/sync.btrfs.tags`
- `vol/sync.btrfs.target`
- `vol/sync.btrfs.timeout`
- `vol/sync.btrfs.unprovision`
- `vol/sync.btrfs.unprovision_requires`
- `vol/sync.btrfs.update_requires`
- `vol/sync.btrfssnap.blocking_post_provision`
- `vol/sync.btrfssnap.blocking_post_unprovision`
- `vol/sync.btrfssnap.blocking_pre_provision`
- `vol/sync.btrfssnap.blocking_pre_unprovision`
- `vol/sync.btrfssnap.disable`
- `vol/sync.btrfssnap.encap`
- `vol/sync.btrfssnap.keep`
- `vol/sync.btrfssnap.max_delay`
- `vol/sync.btrfssnap.monitor`
- `vol/sync.btrfssnap.name`
- `vol/sync.btrfssnap.optional`
- `vol/sync.btrfssnap.post_provision`
- `vol/sync.btrfssnap.post_unprovision`
- `vol/sync.btrfssnap.pre_provision`
- `vol/sync.btrfssnap.pre_unprovision`
- `vol/sync.btrfssnap.provision`
- `vol/sync.btrfssnap.provision_requires`
- `vol/sync.btrfssnap.recursive`
- `vol/sync.btrfssnap.schedule`
- `vol/sync.btrfssnap.shared`
- `vol/sync.btrfssnap.standby`
- `vol/sync.btrfssnap.subset`
- `vol/sync.btrfssnap.subvol`
- `vol/sync.btrfssnap.tags`
- `vol/sync.btrfssnap.unprovision`
- `vol/sync.btrfssnap.unprovision_requires`
- `vol/sync.btrfssnap.update_requires`
- `vol/task.docker.install`
- `vol/task.docker.on`
- `vol/task.docker.pace`
- `vol/task.host.container`
- `vol/task.host.install`
- `vol/task.host.on`
- `vol/task.host.pace`
- `vol/task.oci.install`
- `vol/task.oci.on`
- `vol/task.oci.pace`
- `vol/task.podman.install`
- `vol/task.podman.on`
- `vol/task.podman.pace`

### Changed

- `cfg/DEFAULT.env`
  - description rewritten
- `cluster/arbitrator.uri`
  - description rewritten
- `cluster/collector.url`
  - description rewritten
- `cluster/network.type`
  - candidates: bridge, routed_bridge -> bridge, lan, routed_bridge
  - description rewritten
- `cluster/node.collector`
  - description rewritten
- `cluster/node.env`
  - description rewritten
- `node/arbitrator.uri`
  - description rewritten
- `node/collector.url`
  - description rewritten
- `node/network.type`
  - candidates: bridge, routed_bridge -> bridge, lan, routed_bridge
  - description rewritten
- `node/node.collector`
  - description rewritten
- `node/node.env`
  - description rewritten
- `sec/DEFAULT.env`
  - description rewritten
- `sec/acme.directory`
  - description rewritten
- `svc/DEFAULT.env`
  - description rewritten
- `svc/disk.crypt.dev`
  - description rewritten
- `svc/disk.drbd.network`
  - description rewritten
- `svc/disk.lvm.pvs`
  - description rewritten
- `svc/disk.md.devs`
  - description rewritten
- `svc/disk.raw.devs`
  - description rewritten
- `svc/disk.vg.pvs`
  - description rewritten
- `svc/fs.9pfs.dev`
  - description rewritten
- `svc/fs.9pfs.install`
  - description rewritten
- `svc/fs.9pfs.perm`
  - description rewritten
- `svc/fs.afs.dev`
  - description rewritten
- `svc/fs.afs.install`
  - description rewritten
- `svc/fs.afs.perm`
  - description rewritten
- `svc/fs.bfs.dev`
  - description rewritten
- `svc/fs.bfs.install`
  - description rewritten
- `svc/fs.bfs.perm`
  - description rewritten
- `svc/fs.bind.dev`
  - description rewritten
- `svc/fs.bind.install`
  - description rewritten
- `svc/fs.bind.perm`
  - description rewritten
- `svc/fs.btrfs.dev`
  - description rewritten
- `svc/fs.btrfs.install`
  - description rewritten
- `svc/fs.btrfs.perm`
  - description rewritten
- `svc/fs.cephfs.dev`
  - description rewritten
- `svc/fs.cephfs.install`
  - description rewritten
- `svc/fs.cephfs.perm`
  - description rewritten
- `svc/fs.cifs.dev`
  - description rewritten
- `svc/fs.cifs.install`
  - description rewritten
- `svc/fs.cifs.perm`
  - description rewritten
- `svc/fs.directory.install`
  - description rewritten
- `svc/fs.directory.path`
  - description rewritten
- `svc/fs.directory.perm`
  - description rewritten
- `svc/fs.ext2.dev`
  - description rewritten
- `svc/fs.ext2.install`
  - description rewritten
- `svc/fs.ext2.perm`
  - description rewritten
- `svc/fs.ext3.dev`
  - description rewritten
- `svc/fs.ext3.install`
  - description rewritten
- `svc/fs.ext3.perm`
  - description rewritten
- `svc/fs.ext4.dev`
  - description rewritten
- `svc/fs.ext4.install`
  - description rewritten
- `svc/fs.ext4.perm`
  - description rewritten
- `svc/fs.f2fs.dev`
  - description rewritten
- `svc/fs.f2fs.install`
  - description rewritten
- `svc/fs.f2fs.perm`
  - description rewritten
- `svc/fs.gfs.dev`
  - description rewritten
- `svc/fs.gfs.install`
  - description rewritten
- `svc/fs.gfs.perm`
  - description rewritten
- `svc/fs.gfs2.dev`
  - description rewritten
- `svc/fs.gfs2.install`
  - description rewritten
- `svc/fs.gfs2.perm`
  - description rewritten
- `svc/fs.glusterfs.dev`
  - description rewritten
- `svc/fs.glusterfs.install`
  - description rewritten
- `svc/fs.glusterfs.perm`
  - description rewritten
- `svc/fs.gpfs.dev`
  - description rewritten
- `svc/fs.gpfs.install`
  - description rewritten
- `svc/fs.gpfs.perm`
  - description rewritten
- `svc/fs.hfs.dev`
  - description rewritten
- `svc/fs.hfs.install`
  - description rewritten
- `svc/fs.hfs.perm`
  - description rewritten
- `svc/fs.hfsplus.dev`
  - description rewritten
- `svc/fs.hfsplus.install`
  - description rewritten
- `svc/fs.hfsplus.perm`
  - description rewritten
- `svc/fs.hpfs.dev`
  - description rewritten
- `svc/fs.hpfs.install`
  - description rewritten
- `svc/fs.hpfs.perm`
  - description rewritten
- `svc/fs.jffs.dev`
  - description rewritten
- `svc/fs.jffs.install`
  - description rewritten
- `svc/fs.jffs.perm`
  - description rewritten
- `svc/fs.jffs2.dev`
  - description rewritten
- `svc/fs.jffs2.install`
  - description rewritten
- `svc/fs.jffs2.perm`
  - description rewritten
- `svc/fs.jfs.dev`
  - description rewritten
- `svc/fs.jfs.install`
  - description rewritten
- `svc/fs.jfs.perm`
  - description rewritten
- `svc/fs.jfs2.dev`
  - description rewritten
- `svc/fs.jfs2.install`
  - description rewritten
- `svc/fs.jfs2.perm`
  - description rewritten
- `svc/fs.lofs.dev`
  - description rewritten
- `svc/fs.lofs.install`
  - description rewritten
- `svc/fs.lofs.perm`
  - description rewritten
- `svc/fs.logfs.dev`
  - description rewritten
- `svc/fs.logfs.install`
  - description rewritten
- `svc/fs.logfs.perm`
  - description rewritten
- `svc/fs.minix.dev`
  - description rewritten
- `svc/fs.minix.install`
  - description rewritten
- `svc/fs.minix.perm`
  - description rewritten
- `svc/fs.msdos.dev`
  - description rewritten
- `svc/fs.msdos.install`
  - description rewritten
- `svc/fs.msdos.perm`
  - description rewritten
- `svc/fs.ncpfs.dev`
  - description rewritten
- `svc/fs.ncpfs.install`
  - description rewritten
- `svc/fs.ncpfs.perm`
  - description rewritten
- `svc/fs.nfs.dev`
  - description rewritten
- `svc/fs.nfs.install`
  - description rewritten
- `svc/fs.nfs.perm`
  - description rewritten
- `svc/fs.nfs4.dev`
  - description rewritten
- `svc/fs.nfs4.install`
  - description rewritten
- `svc/fs.nfs4.perm`
  - description rewritten
- `svc/fs.nilfs.dev`
  - description rewritten
- `svc/fs.nilfs.install`
  - description rewritten
- `svc/fs.nilfs.perm`
  - description rewritten
- `svc/fs.none.dev`
  - description rewritten
- `svc/fs.none.install`
  - description rewritten
- `svc/fs.none.perm`
  - description rewritten
- `svc/fs.ntfs.dev`
  - description rewritten
- `svc/fs.ntfs.install`
  - description rewritten
- `svc/fs.ntfs.perm`
  - description rewritten
- `svc/fs.ocfs.dev`
  - description rewritten
- `svc/fs.ocfs.install`
  - description rewritten
- `svc/fs.ocfs.perm`
  - description rewritten
- `svc/fs.ocfs2.dev`
  - description rewritten
- `svc/fs.ocfs2.install`
  - description rewritten
- `svc/fs.ocfs2.perm`
  - description rewritten
- `svc/fs.qnx4.dev`
  - description rewritten
- `svc/fs.qnx4.install`
  - description rewritten
- `svc/fs.qnx4.perm`
  - description rewritten
- `svc/fs.reiserfs.dev`
  - description rewritten
- `svc/fs.reiserfs.install`
  - description rewritten
- `svc/fs.reiserfs.perm`
  - description rewritten
- `svc/fs.reiserfs4.dev`
  - description rewritten
- `svc/fs.reiserfs4.install`
  - description rewritten
- `svc/fs.reiserfs4.perm`
  - description rewritten
- `svc/fs.rpc_pipefs.dev`
  - description rewritten
- `svc/fs.rpc_pipefs.install`
  - description rewritten
- `svc/fs.rpc_pipefs.perm`
  - description rewritten
- `svc/fs.sgcp_nfs.dev`
  - description rewritten
- `svc/fs.sgcp_nfs.install`
  - description rewritten
- `svc/fs.sgcp_nfs.perm`
  - description rewritten
- `svc/fs.smbfs.dev`
  - description rewritten
- `svc/fs.smbfs.install`
  - description rewritten
- `svc/fs.smbfs.perm`
  - description rewritten
- `svc/fs.tmpfs.dev`
  - description rewritten
- `svc/fs.tmpfs.install`
  - description rewritten
- `svc/fs.tmpfs.perm`
  - description rewritten
- `svc/fs.tux3.dev`
  - description rewritten
- `svc/fs.tux3.install`
  - description rewritten
- `svc/fs.tux3.perm`
  - description rewritten
- `svc/fs.ufs.dev`
  - description rewritten
- `svc/fs.ufs.install`
  - description rewritten
- `svc/fs.ufs.perm`
  - description rewritten
- `svc/fs.ufs2.dev`
  - description rewritten
- `svc/fs.ufs2.install`
  - description rewritten
- `svc/fs.ufs2.perm`
  - description rewritten
- `svc/fs.umsdos.dev`
  - description rewritten
- `svc/fs.umsdos.install`
  - description rewritten
- `svc/fs.umsdos.perm`
  - description rewritten
- `svc/fs.vfat.dev`
  - description rewritten
- `svc/fs.vfat.install`
  - description rewritten
- `svc/fs.vfat.perm`
  - description rewritten
- `svc/fs.vxfs.dev`
  - description rewritten
- `svc/fs.vxfs.install`
  - description rewritten
- `svc/fs.vxfs.perm`
  - description rewritten
- `svc/fs.xfs.dev`
  - description rewritten
- `svc/fs.xfs.install`
  - description rewritten
- `svc/fs.xfs.perm`
  - description rewritten
- `svc/fs.xia.dev`
  - description rewritten
- `svc/fs.xia.install`
  - description rewritten
- `svc/fs.xia.perm`
  - description rewritten
- `svc/fs.zfs.dev`
  - description rewritten
- `svc/fs.zfs.install`
  - description rewritten
- `svc/fs.zfs.perm`
  - description rewritten
- `svc/ip.docker.gateway`
  - description rewritten
- `svc/ip.docker.network`
  - description rewritten
- `svc/ip.host.dev`
  - required: true -> unset
  - description rewritten
- `svc/ip.host.name`
  - description rewritten
- `svc/ip.host.network`
  - provisioning: true -> unset
  - description rewritten
- `svc/ip.netns.gateway`
  - description rewritten
- `svc/ip.netns.network`
  - description rewritten
- `svc/share.nfs.opts`
  - description rewritten
- `svc/share.nfs.path`
  - description rewritten
- `svc/sync.rsync.snap`
  - description rewritten
- `svc/volume..install`
  - description rewritten
- `svc/volume..perm`
  - description rewritten
- `usr/DEFAULT.env`
  - description rewritten
- `vol/DEFAULT.env`
  - description rewritten
- `vol/disk.crypt.dev`
  - description rewritten
- `vol/disk.drbd.network`
  - description rewritten
- `vol/disk.lvm.pvs`
  - description rewritten
- `vol/disk.md.devs`
  - description rewritten
- `vol/disk.raw.devs`
  - description rewritten
- `vol/disk.vg.pvs`
  - description rewritten
- `vol/fs.9pfs.dev`
  - description rewritten
- `vol/fs.9pfs.install`
  - description rewritten
- `vol/fs.9pfs.perm`
  - description rewritten
- `vol/fs.afs.dev`
  - description rewritten
- `vol/fs.afs.install`
  - description rewritten
- `vol/fs.afs.perm`
  - description rewritten
- `vol/fs.bfs.dev`
  - description rewritten
- `vol/fs.bfs.install`
  - description rewritten
- `vol/fs.bfs.perm`
  - description rewritten
- `vol/fs.bind.dev`
  - description rewritten
- `vol/fs.bind.install`
  - description rewritten
- `vol/fs.bind.perm`
  - description rewritten
- `vol/fs.btrfs.dev`
  - description rewritten
- `vol/fs.btrfs.install`
  - description rewritten
- `vol/fs.btrfs.perm`
  - description rewritten
- `vol/fs.cephfs.dev`
  - description rewritten
- `vol/fs.cephfs.install`
  - description rewritten
- `vol/fs.cephfs.perm`
  - description rewritten
- `vol/fs.cifs.dev`
  - description rewritten
- `vol/fs.cifs.install`
  - description rewritten
- `vol/fs.cifs.perm`
  - description rewritten
- `vol/fs.directory.install`
  - description rewritten
- `vol/fs.directory.path`
  - description rewritten
- `vol/fs.directory.perm`
  - description rewritten
- `vol/fs.ext2.dev`
  - description rewritten
- `vol/fs.ext2.install`
  - description rewritten
- `vol/fs.ext2.perm`
  - description rewritten
- `vol/fs.ext3.dev`
  - description rewritten
- `vol/fs.ext3.install`
  - description rewritten
- `vol/fs.ext3.perm`
  - description rewritten
- `vol/fs.ext4.dev`
  - description rewritten
- `vol/fs.ext4.install`
  - description rewritten
- `vol/fs.ext4.perm`
  - description rewritten
- `vol/fs.f2fs.dev`
  - description rewritten
- `vol/fs.f2fs.install`
  - description rewritten
- `vol/fs.f2fs.perm`
  - description rewritten
- `vol/fs.gfs.dev`
  - description rewritten
- `vol/fs.gfs.install`
  - description rewritten
- `vol/fs.gfs.perm`
  - description rewritten
- `vol/fs.gfs2.dev`
  - description rewritten
- `vol/fs.gfs2.install`
  - description rewritten
- `vol/fs.gfs2.perm`
  - description rewritten
- `vol/fs.glusterfs.dev`
  - description rewritten
- `vol/fs.glusterfs.install`
  - description rewritten
- `vol/fs.glusterfs.perm`
  - description rewritten
- `vol/fs.gpfs.dev`
  - description rewritten
- `vol/fs.gpfs.install`
  - description rewritten
- `vol/fs.gpfs.perm`
  - description rewritten
- `vol/fs.hfs.dev`
  - description rewritten
- `vol/fs.hfs.install`
  - description rewritten
- `vol/fs.hfs.perm`
  - description rewritten
- `vol/fs.hfsplus.dev`
  - description rewritten
- `vol/fs.hfsplus.install`
  - description rewritten
- `vol/fs.hfsplus.perm`
  - description rewritten
- `vol/fs.hpfs.dev`
  - description rewritten
- `vol/fs.hpfs.install`
  - description rewritten
- `vol/fs.hpfs.perm`
  - description rewritten
- `vol/fs.jffs.dev`
  - description rewritten
- `vol/fs.jffs.install`
  - description rewritten
- `vol/fs.jffs.perm`
  - description rewritten
- `vol/fs.jffs2.dev`
  - description rewritten
- `vol/fs.jffs2.install`
  - description rewritten
- `vol/fs.jffs2.perm`
  - description rewritten
- `vol/fs.jfs.dev`
  - description rewritten
- `vol/fs.jfs.install`
  - description rewritten
- `vol/fs.jfs.perm`
  - description rewritten
- `vol/fs.jfs2.dev`
  - description rewritten
- `vol/fs.jfs2.install`
  - description rewritten
- `vol/fs.jfs2.perm`
  - description rewritten
- `vol/fs.lofs.dev`
  - description rewritten
- `vol/fs.lofs.install`
  - description rewritten
- `vol/fs.lofs.perm`
  - description rewritten
- `vol/fs.logfs.dev`
  - description rewritten
- `vol/fs.logfs.install`
  - description rewritten
- `vol/fs.logfs.perm`
  - description rewritten
- `vol/fs.minix.dev`
  - description rewritten
- `vol/fs.minix.install`
  - description rewritten
- `vol/fs.minix.perm`
  - description rewritten
- `vol/fs.msdos.dev`
  - description rewritten
- `vol/fs.msdos.install`
  - description rewritten
- `vol/fs.msdos.perm`
  - description rewritten
- `vol/fs.ncpfs.dev`
  - description rewritten
- `vol/fs.ncpfs.install`
  - description rewritten
- `vol/fs.ncpfs.perm`
  - description rewritten
- `vol/fs.nfs.dev`
  - description rewritten
- `vol/fs.nfs.install`
  - description rewritten
- `vol/fs.nfs.perm`
  - description rewritten
- `vol/fs.nfs4.dev`
  - description rewritten
- `vol/fs.nfs4.install`
  - description rewritten
- `vol/fs.nfs4.perm`
  - description rewritten
- `vol/fs.nilfs.dev`
  - description rewritten
- `vol/fs.nilfs.install`
  - description rewritten
- `vol/fs.nilfs.perm`
  - description rewritten
- `vol/fs.none.dev`
  - description rewritten
- `vol/fs.none.install`
  - description rewritten
- `vol/fs.none.perm`
  - description rewritten
- `vol/fs.ntfs.dev`
  - description rewritten
- `vol/fs.ntfs.install`
  - description rewritten
- `vol/fs.ntfs.perm`
  - description rewritten
- `vol/fs.ocfs.dev`
  - description rewritten
- `vol/fs.ocfs.install`
  - description rewritten
- `vol/fs.ocfs.perm`
  - description rewritten
- `vol/fs.ocfs2.dev`
  - description rewritten
- `vol/fs.ocfs2.install`
  - description rewritten
- `vol/fs.ocfs2.perm`
  - description rewritten
- `vol/fs.qnx4.dev`
  - description rewritten
- `vol/fs.qnx4.install`
  - description rewritten
- `vol/fs.qnx4.perm`
  - description rewritten
- `vol/fs.reiserfs.dev`
  - description rewritten
- `vol/fs.reiserfs.install`
  - description rewritten
- `vol/fs.reiserfs.perm`
  - description rewritten
- `vol/fs.reiserfs4.dev`
  - description rewritten
- `vol/fs.reiserfs4.install`
  - description rewritten
- `vol/fs.reiserfs4.perm`
  - description rewritten
- `vol/fs.rpc_pipefs.dev`
  - description rewritten
- `vol/fs.rpc_pipefs.install`
  - description rewritten
- `vol/fs.rpc_pipefs.perm`
  - description rewritten
- `vol/fs.sgcp_nfs.dev`
  - description rewritten
- `vol/fs.sgcp_nfs.install`
  - description rewritten
- `vol/fs.sgcp_nfs.perm`
  - description rewritten
- `vol/fs.smbfs.dev`
  - description rewritten
- `vol/fs.smbfs.install`
  - description rewritten
- `vol/fs.smbfs.perm`
  - description rewritten
- `vol/fs.tmpfs.dev`
  - description rewritten
- `vol/fs.tmpfs.install`
  - description rewritten
- `vol/fs.tmpfs.perm`
  - description rewritten
- `vol/fs.tux3.dev`
  - description rewritten
- `vol/fs.tux3.install`
  - description rewritten
- `vol/fs.tux3.perm`
  - description rewritten
- `vol/fs.ufs.dev`
  - description rewritten
- `vol/fs.ufs.install`
  - description rewritten
- `vol/fs.ufs.perm`
  - description rewritten
- `vol/fs.ufs2.dev`
  - description rewritten
- `vol/fs.ufs2.install`
  - description rewritten
- `vol/fs.ufs2.perm`
  - description rewritten
- `vol/fs.umsdos.dev`
  - description rewritten
- `vol/fs.umsdos.install`
  - description rewritten
- `vol/fs.umsdos.perm`
  - description rewritten
- `vol/fs.vfat.dev`
  - description rewritten
- `vol/fs.vfat.install`
  - description rewritten
- `vol/fs.vfat.perm`
  - description rewritten
- `vol/fs.vxfs.dev`
  - description rewritten
- `vol/fs.vxfs.install`
  - description rewritten
- `vol/fs.vxfs.perm`
  - description rewritten
- `vol/fs.xfs.dev`
  - description rewritten
- `vol/fs.xfs.install`
  - description rewritten
- `vol/fs.xfs.perm`
  - description rewritten
- `vol/fs.xia.dev`
  - description rewritten
- `vol/fs.xia.install`
  - description rewritten
- `vol/fs.xia.perm`
  - description rewritten
- `vol/fs.zfs.dev`
  - description rewritten
- `vol/fs.zfs.install`
  - description rewritten
- `vol/fs.zfs.perm`
  - description rewritten
- `vol/share.nfs.opts`
  - description rewritten
- `vol/share.nfs.path`
  - description rewritten
- `vol/sync.rsync.snap`
  - description rewritten
- `vol/volume..install`
  - description rewritten
- `vol/volume..perm`
  - description rewritten

## v3.0.0-rc46

No keyword changed.

## v3.0.0-rc45


### Added

- `cluster/collector.action_batch`
- `cluster/collector.action_log_timeout`
- `cluster/collector.feeder`
- `cluster/collector.ping_interval`
- `cluster/collector.server`
- `cluster/collector.status_delay`
- `cluster/collector.timeout`
- `cluster/collector.url`
- `cluster/listener.acme_port`
- `cluster/listener.tls_secs`
- `cluster/node.min_avail_mem`
- `cluster/node.min_avail_swap`
- `cluster/stats.disable`
- `cluster/stats.schedule`
- `node/collector.action_batch`
- `node/collector.action_log_timeout`
- `node/collector.feeder`
- `node/collector.ping_interval`
- `node/collector.server`
- `node/collector.status_delay`
- `node/collector.timeout`
- `node/collector.url`
- `node/listener.acme_port`
- `node/listener.tls_secs`
- `node/node.min_avail_mem`
- `node/node.min_avail_swap`
- `node/stats.disable`
- `node/stats.schedule`
- `sec/acme.directory`
- `sec/acme.renew_before`
- `sec/acme.webroot`
- `svc/task.acme.blocking_post_provision`
- `svc/task.acme.blocking_post_run`
- `svc/task.acme.blocking_post_unprovision`
- `svc/task.acme.blocking_pre_provision`
- `svc/task.acme.blocking_pre_run`
- `svc/task.acme.blocking_pre_unprovision`
- `svc/task.acme.check`
- `svc/task.acme.confirmation`
- `svc/task.acme.disable`
- `svc/task.acme.encap`
- `svc/task.acme.log`
- `svc/task.acme.max_parallel`
- `svc/task.acme.monitor`
- `svc/task.acme.on_error`
- `svc/task.acme.optional`
- `svc/task.acme.post_provision`
- `svc/task.acme.post_run`
- `svc/task.acme.post_unprovision`
- `svc/task.acme.pre_provision`
- `svc/task.acme.pre_run`
- `svc/task.acme.pre_unprovision`
- `svc/task.acme.provision`
- `svc/task.acme.provision_requires`
- `svc/task.acme.retcodes`
- `svc/task.acme.run_requires`
- `svc/task.acme.run_timeout`
- `svc/task.acme.schedule`
- `svc/task.acme.secs`
- `svc/task.acme.shared`
- `svc/task.acme.snooze`
- `svc/task.acme.standby`
- `svc/task.acme.subset`
- `svc/task.acme.tags`
- `svc/task.acme.timeout`
- `svc/task.acme.unprovision`
- `svc/task.acme.unprovision_requires`
- `svc/task.acme.webroot`

### Removed

- `cluster/node.min_avail_mem_pct`
- `cluster/node.min_avail_swap_pct`
- `node/node.min_avail_mem_pct`
- `node/node.min_avail_swap_pct`

### Changed

- `cluster/node.collector`
  - deprecated: unset -> v3.0.0-rc44
  - replacedBy: unset -> collector.url
- `cluster/node.collector_feeder`
  - deprecated: unset -> v3.0.0-rc44
  - replacedBy: unset -> collector.feeder
- `cluster/node.collector_ping_interval`
  - deprecated: unset -> v3.0.0-rc44
  - replacedBy: unset -> collector.ping_interval
- `cluster/node.collector_server`
  - deprecated: unset -> v3.0.0-rc44
  - replacedBy: unset -> collector.server
- `cluster/node.collector_status_delay`
  - deprecated: unset -> v3.0.0-rc44
  - replacedBy: unset -> collector.status_delay
- `cluster/node.collector_timeout`
  - deprecated: unset -> v3.0.0-rc44
  - replacedBy: unset -> collector.timeout
  - description rewritten
- `node/node.collector`
  - deprecated: unset -> v3.0.0-rc44
  - replacedBy: unset -> collector.url
- `node/node.collector_feeder`
  - deprecated: unset -> v3.0.0-rc44
  - replacedBy: unset -> collector.feeder
- `node/node.collector_ping_interval`
  - deprecated: unset -> v3.0.0-rc44
  - replacedBy: unset -> collector.ping_interval
- `node/node.collector_server`
  - deprecated: unset -> v3.0.0-rc44
  - replacedBy: unset -> collector.server
- `node/node.collector_status_delay`
  - deprecated: unset -> v3.0.0-rc44
  - replacedBy: unset -> collector.status_delay
- `node/node.collector_timeout`
  - deprecated: unset -> v3.0.0-rc44
  - replacedBy: unset -> collector.timeout
  - description rewritten
- `svc/app.forking.script`
  - description rewritten
- `svc/app.simple.script`
  - description rewritten
- `svc/container.docker.volume_mounts`
  - description rewritten
- `svc/container.lxc.cf`
  - description rewritten
- `svc/container.lxc.data_dir`
  - description rewritten
- `svc/container.lxc.rootfs`
  - description rewritten
- `svc/container.oci.volume_mounts`
  - description rewritten
- `svc/container.podman.volume_mounts`
  - description rewritten
- `svc/task.docker.volume_mounts`
  - description rewritten
- `svc/task.oci.volume_mounts`
  - description rewritten
- `svc/task.podman.volume_mounts`
  - description rewritten
- `vol/task.docker.volume_mounts`
  - description rewritten
- `vol/task.oci.volume_mounts`
  - description rewritten
- `vol/task.podman.volume_mounts`
  - description rewritten

## v3.0.0-rc43


### Added

- `cluster/console.port`
- `cluster/console.url`
- `node/console.port`
- `node/console.url`
- `svc/container.kvm.migrate_timeout`
- `svc/ip.rule.blocking_post_provision`
- `svc/ip.rule.blocking_post_start`
- `svc/ip.rule.blocking_post_stop`
- `svc/ip.rule.blocking_post_unprovision`
- `svc/ip.rule.blocking_pre_provision`
- `svc/ip.rule.blocking_pre_start`
- `svc/ip.rule.blocking_pre_stop`
- `svc/ip.rule.blocking_pre_unprovision`
- `svc/ip.rule.disable`
- `svc/ip.rule.encap`
- `svc/ip.rule.monitor`
- `svc/ip.rule.netns`
- `svc/ip.rule.optional`
- `svc/ip.rule.post_provision`
- `svc/ip.rule.post_start`
- `svc/ip.rule.post_stop`
- `svc/ip.rule.post_unprovision`
- `svc/ip.rule.pre_provision`
- `svc/ip.rule.pre_start`
- `svc/ip.rule.pre_stop`
- `svc/ip.rule.pre_unprovision`
- `svc/ip.rule.provision`
- `svc/ip.rule.provision_requires`
- `svc/ip.rule.restart`
- `svc/ip.rule.restart_delay`
- `svc/ip.rule.shared`
- `svc/ip.rule.spec`
- `svc/ip.rule.standby`
- `svc/ip.rule.start_requires`
- `svc/ip.rule.stop_requires`
- `svc/ip.rule.subset`
- `svc/ip.rule.tags`
- `svc/ip.rule.unprovision`
- `svc/ip.rule.unprovision_requires`

### Removed

- `cluster/console.insecure`
- `cluster/console.max_greet_timeout`
- `cluster/console.max_seats`
- `cluster/console.server`
- `node/console.insecure`
- `node/console.max_greet_timeout`
- `node/console.max_seats`
- `node/console.server`

### Changed

- `cluster/switch.brocade.method`
  - description rewritten
- `cluster/switch.brocade.name`
  - description rewritten
- `cluster/switch.brocade.password`
  - description rewritten
- `cluster/switch.type`
  - description rewritten
- `node/switch.brocade.method`
  - description rewritten
- `node/switch.brocade.name`
  - description rewritten
- `node/switch.brocade.password`
  - description rewritten
- `node/switch.schedule`
  - description rewritten
- `node/switch.type`
  - description rewritten
- `svc/fs.zfs.quota`
  - description rewritten
- `svc/fs.zfs.refquota`
  - defaultText: unset -> `x1` when `size` is set, none otherwise.

  - description rewritten
- `svc/fs.zfs.refreservation`
  - description rewritten
- `svc/fs.zfs.reservation`
  - description rewritten
- `svc/fs.zfs.size`
  - description rewritten
- `vol/fs.zfs.quota`
  - description rewritten
- `vol/fs.zfs.refquota`
  - defaultText: unset -> `x1` when `size` is set, none otherwise.

  - description rewritten
- `vol/fs.zfs.refreservation`
  - description rewritten
- `vol/fs.zfs.reservation`
  - description rewritten
- `vol/fs.zfs.size`
  - description rewritten

## v3.0.0-rc42


### Added

- `cluster/array.dorado.timeout`
- `cluster/array.freenas.insecure`
- `cluster/array.ibmsvc.key`
- `cluster/pool.dorado.array`
- `cluster/pool.dorado.diskgroup`
- `cluster/pool.dorado.fs_type`
- `cluster/pool.drbd.max_peers`
- `cluster/pool.shm.mode`
- `node/array.dorado.timeout`
- `node/array.freenas.insecure`
- `node/array.ibmsvc.key`
- `node/pool.dorado.array`
- `node/pool.dorado.diskgroup`
- `node/pool.dorado.fs_type`
- `node/pool.drbd.max_peers`
- `node/pool.shm.mode`
- `svc/DEFAULT.pg_cpu_burst`
- `svc/DEFAULT.pg_mem_high`
- `svc/DEFAULT.pg_pids_max`
- `svc/DEFAULT.wait_syncs_timeout`
- `svc/container.oci.rootless_group`
- `svc/container.oci.rootless_user`
- `svc/container.podman.rootless_group`
- `svc/container.podman.rootless_user`
- `svc/disk.hp3par.update_requires`
- `svc/fs.tmpfs.mode`
- `svc/fs.tmpfs.size`
- `svc/sync.rsync.update_requires`
- `svc/sync.symsnapvx.update_requires`
- `svc/sync.symsrdfs.update_requires`
- `svc/sync.zfs.max_lag_age`
- `svc/sync.zfs.max_lag_size`
- `svc/sync.zfs.update_requires`
- `svc/sync.zfssnap.update_requires`
- `svc/task.docker.read_only`
- `svc/task.docker.stop_timeout`
- `svc/task.docker.sysctl`
- `svc/task.oci.read_only`
- `svc/task.oci.rootless_group`
- `svc/task.oci.rootless_user`
- `svc/task.oci.stop_timeout`
- `svc/task.oci.sysctl`
- `svc/task.podman.read_only`
- `svc/task.podman.rootless_group`
- `svc/task.podman.rootless_user`
- `svc/task.podman.stop_timeout`
- `svc/task.podman.sysctl`
- `vol/DEFAULT.pg_cpu_burst`
- `vol/DEFAULT.pg_mem_high`
- `vol/DEFAULT.pg_pids_max`
- `vol/DEFAULT.wait_syncs_timeout`
- `vol/disk.hp3par.update_requires`
- `vol/fs.tmpfs.mode`
- `vol/fs.tmpfs.size`
- `vol/sync.rsync.update_requires`
- `vol/sync.symsnapvx.update_requires`
- `vol/sync.symsrdfs.update_requires`
- `vol/sync.zfs.max_lag_age`
- `vol/sync.zfs.max_lag_size`
- `vol/sync.zfs.update_requires`
- `vol/sync.zfssnap.update_requires`
- `vol/task.docker.read_only`
- `vol/task.docker.stop_timeout`
- `vol/task.docker.sysctl`
- `vol/task.oci.read_only`
- `vol/task.oci.rootless_group`
- `vol/task.oci.rootless_user`
- `vol/task.oci.stop_timeout`
- `vol/task.oci.sysctl`
- `vol/task.podman.read_only`
- `vol/task.podman.rootless_group`
- `vol/task.podman.rootless_user`
- `vol/task.podman.stop_timeout`
- `vol/task.podman.sysctl`

### Removed

- `cluster/array.netapp.key`
- `cluster/array.pure.insecure`
- `cluster/drbd.max_peers`
- `cluster/pool.freenas.fs_type`
- `node/array.netapp.key`
- `node/array.pure.insecure`
- `node/drbd.max_peers`
- `node/pool.freenas.fs_type`
- `svc/disk.hp3par.sync_requires`
- `svc/sync.rsync.sync_requires`
- `svc/sync.symsnapvx.sync_requires`
- `svc/sync.symsrdfs.sync_requires`
- `svc/sync.zfs.sync_requires`
- `svc/sync.zfssnap.sync_requires`
- `vol/disk.hp3par.sync_requires`
- `vol/sync.rsync.sync_requires`
- `vol/sync.symsnapvx.sync_requires`
- `vol/sync.symsrdfs.sync_requires`
- `vol/sync.zfs.sync_requires`
- `vol/sync.zfssnap.sync_requires`

### Changed

- `cluster/arbitrator.weight`
  - description rewritten
- `cluster/array.pure.secret`
  - description rewritten
- `node/arbitrator.weight`
  - description rewritten
- `node/array.pure.secret`
  - description rewritten
- `svc/DEFAULT.pg_cpu_shares`
  - description rewritten
- `svc/DEFAULT.pg_cpus`
  - description rewritten
- `svc/DEFAULT.pg_mem_limit`
  - description rewritten
- `svc/DEFAULT.pg_mem_oom_control`
  - description rewritten
- `svc/DEFAULT.pg_mems`
  - description rewritten
- `svc/DEFAULT.pg_vmem_limit`
  - description rewritten
- `svc/disk.drbd.template`
  - description rewritten
- `svc/disk.hp3par.array`
  - description rewritten
- `svc/disk.rados.config`
  - description rewritten
- `svc/disk.rados.keyring`
  - description rewritten
- `svc/disk.sgcp_nfs_cg.secret`
  - description rewritten
- `svc/fs.9pfs.install`
  - description rewritten
- `svc/fs.afs.install`
  - description rewritten
- `svc/fs.bfs.install`
  - description rewritten
- `svc/fs.bind.install`
  - description rewritten
- `svc/fs.btrfs.install`
  - description rewritten
- `svc/fs.cephfs.install`
  - description rewritten
- `svc/fs.cifs.install`
  - description rewritten
- `svc/fs.directory.install`
  - description rewritten
- `svc/fs.ext2.install`
  - description rewritten
- `svc/fs.ext3.install`
  - description rewritten
- `svc/fs.ext4.install`
  - description rewritten
- `svc/fs.f2fs.install`
  - description rewritten
- `svc/fs.gfs.install`
  - description rewritten
- `svc/fs.gfs2.install`
  - description rewritten
- `svc/fs.glusterfs.install`
  - description rewritten
- `svc/fs.gpfs.install`
  - description rewritten
- `svc/fs.hfs.install`
  - description rewritten
- `svc/fs.hfsplus.install`
  - description rewritten
- `svc/fs.hpfs.install`
  - description rewritten
- `svc/fs.jffs.install`
  - description rewritten
- `svc/fs.jffs2.install`
  - description rewritten
- `svc/fs.jfs.install`
  - description rewritten
- `svc/fs.jfs2.install`
  - description rewritten
- `svc/fs.lofs.install`
  - description rewritten
- `svc/fs.logfs.install`
  - description rewritten
- `svc/fs.minix.install`
  - description rewritten
- `svc/fs.msdos.install`
  - description rewritten
- `svc/fs.ncpfs.install`
  - description rewritten
- `svc/fs.nfs.install`
  - description rewritten
- `svc/fs.nfs4.install`
  - description rewritten
- `svc/fs.nilfs.install`
  - description rewritten
- `svc/fs.none.install`
  - description rewritten
- `svc/fs.ntfs.install`
  - description rewritten
- `svc/fs.ocfs.install`
  - description rewritten
- `svc/fs.ocfs2.install`
  - description rewritten
- `svc/fs.qnx4.install`
  - description rewritten
- `svc/fs.reiserfs.install`
  - description rewritten
- `svc/fs.reiserfs4.install`
  - description rewritten
- `svc/fs.rpc_pipefs.install`
  - description rewritten
- `svc/fs.sgcp_nfs.install`
  - description rewritten
- `svc/fs.sgcp_nfs.secret`
  - description rewritten
- `svc/fs.smbfs.install`
  - description rewritten
- `svc/fs.tmpfs.install`
  - description rewritten
- `svc/fs.tux3.install`
  - description rewritten
- `svc/fs.ufs.install`
  - description rewritten
- `svc/fs.ufs2.install`
  - description rewritten
- `svc/fs.umsdos.install`
  - description rewritten
- `svc/fs.vfat.install`
  - description rewritten
- `svc/fs.vxfs.install`
  - description rewritten
- `svc/fs.xfs.install`
  - description rewritten
- `svc/fs.xia.install`
  - description rewritten
- `svc/fs.zfs.install`
  - description rewritten
- `svc/ip.sgcp_dnsalias.secret`
  - description rewritten
- `svc/task.docker.max_parallel`
  - description rewritten
- `svc/task.host.max_parallel`
  - description rewritten
- `svc/task.oci.max_parallel`
  - description rewritten
- `svc/task.podman.max_parallel`
  - description rewritten
- `svc/volume..install`
  - description rewritten
- `vol/DEFAULT.pg_cpu_shares`
  - description rewritten
- `vol/DEFAULT.pg_cpus`
  - description rewritten
- `vol/DEFAULT.pg_mem_limit`
  - description rewritten
- `vol/DEFAULT.pg_mem_oom_control`
  - description rewritten
- `vol/DEFAULT.pg_mems`
  - description rewritten
- `vol/DEFAULT.pg_vmem_limit`
  - description rewritten
- `vol/disk.drbd.template`
  - description rewritten
- `vol/disk.hp3par.array`
  - description rewritten
- `vol/disk.rados.config`
  - description rewritten
- `vol/disk.rados.keyring`
  - description rewritten
- `vol/disk.sgcp_nfs_cg.secret`
  - description rewritten
- `vol/fs.9pfs.install`
  - description rewritten
- `vol/fs.afs.install`
  - description rewritten
- `vol/fs.bfs.install`
  - description rewritten
- `vol/fs.bind.install`
  - description rewritten
- `vol/fs.btrfs.install`
  - description rewritten
- `vol/fs.cephfs.install`
  - description rewritten
- `vol/fs.cifs.install`
  - description rewritten
- `vol/fs.directory.install`
  - description rewritten
- `vol/fs.ext2.install`
  - description rewritten
- `vol/fs.ext3.install`
  - description rewritten
- `vol/fs.ext4.install`
  - description rewritten
- `vol/fs.f2fs.install`
  - description rewritten
- `vol/fs.gfs.install`
  - description rewritten
- `vol/fs.gfs2.install`
  - description rewritten
- `vol/fs.glusterfs.install`
  - description rewritten
- `vol/fs.gpfs.install`
  - description rewritten
- `vol/fs.hfs.install`
  - description rewritten
- `vol/fs.hfsplus.install`
  - description rewritten
- `vol/fs.hpfs.install`
  - description rewritten
- `vol/fs.jffs.install`
  - description rewritten
- `vol/fs.jffs2.install`
  - description rewritten
- `vol/fs.jfs.install`
  - description rewritten
- `vol/fs.jfs2.install`
  - description rewritten
- `vol/fs.lofs.install`
  - description rewritten
- `vol/fs.logfs.install`
  - description rewritten
- `vol/fs.minix.install`
  - description rewritten
- `vol/fs.msdos.install`
  - description rewritten
- `vol/fs.ncpfs.install`
  - description rewritten
- `vol/fs.nfs.install`
  - description rewritten
- `vol/fs.nfs4.install`
  - description rewritten
- `vol/fs.nilfs.install`
  - description rewritten
- `vol/fs.none.install`
  - description rewritten
- `vol/fs.ntfs.install`
  - description rewritten
- `vol/fs.ocfs.install`
  - description rewritten
- `vol/fs.ocfs2.install`
  - description rewritten
- `vol/fs.qnx4.install`
  - description rewritten
- `vol/fs.reiserfs.install`
  - description rewritten
- `vol/fs.reiserfs4.install`
  - description rewritten
- `vol/fs.rpc_pipefs.install`
  - description rewritten
- `vol/fs.sgcp_nfs.install`
  - description rewritten
- `vol/fs.sgcp_nfs.secret`
  - description rewritten
- `vol/fs.smbfs.install`
  - description rewritten
- `vol/fs.tmpfs.install`
  - description rewritten
- `vol/fs.tux3.install`
  - description rewritten
- `vol/fs.ufs.install`
  - description rewritten
- `vol/fs.ufs2.install`
  - description rewritten
- `vol/fs.umsdos.install`
  - description rewritten
- `vol/fs.vfat.install`
  - description rewritten
- `vol/fs.vxfs.install`
  - description rewritten
- `vol/fs.xfs.install`
  - description rewritten
- `vol/fs.xia.install`
  - description rewritten
- `vol/fs.zfs.install`
  - description rewritten
- `vol/ip.sgcp_dnsalias.secret`
  - description rewritten
- `vol/task.docker.max_parallel`
  - description rewritten
- `vol/task.host.max_parallel`
  - description rewritten
- `vol/task.oci.max_parallel`
  - description rewritten
- `vol/task.podman.max_parallel`
  - description rewritten
- `vol/volume..install`
  - description rewritten

## v3.0.0-rc41


### Changed

- `svc/container.oci.userns`
  - description rewritten
- `svc/task.oci.userns`
  - description rewritten
- `vol/task.oci.userns`
  - description rewritten
