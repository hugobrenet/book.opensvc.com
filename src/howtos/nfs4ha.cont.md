<!-- llms: A highly available NFSv4 service in containers, on LVM2, DRBD and Podman, deployed with OpenSVC. -->
# NFS4 High Availability Setup - Container Integration

This howto describes a NFS4-only HA service setup using modern OpenSVC features.

It has been tested on Red Hat Enterprise Linux 8.7 nodes.

---

## Prerequisites

| Prerequisite                              | Example                                     |
|-------------------------------------------|---------------------------------------------|
| 2 nodes                                   | node1 `5.196.34.132` / node2 `5.196.34.133` |
| A failover IP address for the NFS4 server | nfsv4.opensvc.com `5.196.34.141`            |
| Shared storage (SAN, iSCSI, ...) or DRBD  |                                             |
| OpenSVC agent 2.1+ installed              |                                             |

---

## Setup LVM2

Configure an LVM2 volume group to host an LVM2 logical volume, used as the DRBD backing device.

```bash
dnf -y install lvm2
pvcreate /dev/vdb
vgcreate datavg /dev/vdb
```

---

## Setup DRBD

### Kernel Module & Utils

[Linbit](https://www.linbit.com/) DRBD kernel modules for RHEL are available on [ElRepo](https://www.elrepo.org/).

```bash
dnf -y install https://www.elrepo.org/elrepo-release-8.el8.elrepo.noarch.rpm
rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
sed -i 's/^mirrorlist/#mirrorlist/' /etc/yum.repos.d/elrepo.repo
dnf -y install kmod-drbd90 drbd90-utils
```

You can verify that DRBD is ready with the command below:

```
[root@node1 ~]# modinfo drbd | grep ^version
version:        9.1.13
```

---

## Setup Podman

Install and configure Podman for container management on Red Hat systems.

```bash
dnf -y install podman
podman network create loopback
curl -o /etc/cni/net.d/loopback.conflist https://raw.githubusercontent.com/opensvc/opensvc_templates/main/nfs/loopback.conflist
mkdir -p /etc/containers/containers.conf.d
echo -e '[network]\ndefault_network = "loopback"' > /etc/containers/containers.conf.d/opensvc.loopback.conf
```

> **Note:** By default, CNI connects a container on the `podman` network and assigns an IP address in the `10.88.0.0/16` range. Since network configuration is managed by the OpenSVC agent, we configure Podman to connect containers on a basic private network namespace with only a loopback IP address.

---

## Setup OpenSVC

### Install OpenSVC

**On both nodes:**

```bash
dnf -y install python3 python3-cryptography
curl -o opensvc-2.1-latest.rpm https://repo.opensvc.com/rpms/2.1/current
dnf -y install ./opensvc-2.1-latest.rpm
```

### Enroll Cluster Nodes

**On node1:**

Verify cluster on node1 defines cluster name and has at least one heartbeat or define cluster name and heartbeat.
```bash
[root@node1 ~]# om cluster set --kw hb#1.type=unicast
[root@node1 ~]# om cluster set --kw cluster.name=cluster1
```

**On node2** — create a join token, and copy the `/root/node2.token` file to node1:

```bash
[root@node2 ~]# om daemon auth --role join --duration 10m >/root/node2.token
```

**On node1** — enroll node2:

```bash
[root@node1 ~]# om cluster enroll --node node2 --token /root/node2.token --wait
Node node2 accepted the join order
Cluster nodes updated
Waiting for node2 to beat
Node node2 is alive
```

**On node1** — unfreeze nodes and set up root SSH trust:

```bash
om node thaw
om node update ssh authorized keys --node='*'
```

> **Note:** Ensure that you can SSH as root from one node to another without being prompted for a password.

You should now have a configured cluster:

```
[root@node1 ~]# om mon
Threads                               node1        node2
 daemon         running             |
 hb#1.rx        running  [::]:10000 | /            O
 hb#1.tx        running             | /            O
 listener       running       :1214
 monitor        running
 scheduler      running

Nodes                                 node1        node2
 score                              | 69           69
  load 15m                          | 0.0          0.0
  mem                               | 12/98%:1.77g 11/98%:1.77g
  swap                              | -            -
 state                              |
```

### Setup Storage Pool

We configure a cluster storage pool for automated volume object provisioning. It is a DRBD pool backed by an LVM2 volume group. More setups relying on other technologies are also supported.

**On node1:**

```bash
om cluster set --kw pool#drbd.type=drbd --kw pool#drbd.vg=datavg --kw pool#drbd.status_schedule=@1
om pool status
```

```
[root@node1 ~]# om pool status
name      type       caps                             head                             vols  size    used   free
|- default directory rox,rwx,roo,rwo,blk              /var/lib/opensvc/pool/directory  0     9.89g   3.34g  6.55g
`- shm     shm        rox,rwx,roo,rwo,blk              /dev/shm                         0     906m    84.0k  906m

[root@node1 ~]# om cluster set --kw pool#drbd.type=drbd --kw pool#drbd.vg=datavg --kw pool#drbd.status_schedule=@1

[root@node1 ~]# om pool status
name      type       caps                             head                             vols  size    used   free
|- default directory rox,rwx,roo,rwo,blk              /var/lib/opensvc/pool/directory  0     9.89g   3.34g  6.55g
|- drbd    drbd       rox,rwx,roo,rwo,snap,blk,shared  datavg                           1     100.0g  0m     100.0g
`- shm     shm        rox,rwx,roo,rwo,blk              /dev/shm                         0     906m    84.0k  906m
```

### Setup Network Configuration

Configure OpenSVC to share the CNI configuration path with Podman.

```bash
om cluster set --kw cni.config="/etc/cni/net.d"
```

---

## Deploy the Service

### Install Config Map

We create a config map object `test/cfg/nfsv4` to store an `exports` key containing the `/etc/exports` file and a `nfs`key containing the `/etc/nfs.conf` file. The config map is replicated across cluster nodes and injected into the NFS container.

```bash
om test/cfg/nfsv4 create
curl -o - \
  https://raw.githubusercontent.com/opensvc/opensvc_templates/main/nfs/etc.exports.conf | \
  sed -e 's@ROOTFS@@' | \
  om test/cfg/nfsv4 add --key exports --from=-
  
om test/cfg/nfsv4 add --key nfs --from https://raw.githubusercontent.com/opensvc/opensvc_templates/main/nfs/etc.nfs.conf
```

> **Note:** The `exports` key can be modified with the command `om test/cfg/nfsv4 edit --key exports`. The container is immediately updated with the new content. Depending on the application, it may be necessary to send signals or restart some processes to apply the change.

### Deploy with NFS Container Disabled

Create the OpenSVC service using the name `nfsv4`, in the `test` namespace, using a `5G` volume provisioned in the `drbd` pool, backed by the `datavg` LVM2 volume group, reachable using the public DNS name `nfsv4.opensvc.com` configured on interface `eth0` with default gateway `5.196.34.158`.

**On node1:**

```bashscript
om test/svc/nfsv4 deploy \
  --config https://raw.githubusercontent.com/opensvc/opensvc_templates/main/nfs/nfsv4-container-disabled.conf \
  --env size=5G \
  --env fqdn=nfsv4.opensvc.com \
  --env gateway=5.196.34.158 \
  --env nic=eth0
```

> **Note:** The config used in this command has the NFS container resource disabled. Using that trick, we can configure NFS later and test core (IP, disk, filesystem) failovers early.
>
> This is convenient for learning purposes, but in other situations you may want to use `--config https://raw.githubusercontent.com/opensvc/opensvc_templates/main/nfs/nfsv4-container.conf` for a one-step deployment.

This command creates and configures the system resources needed by the service on both nodes:

- OpenSVC volume object `test/vol/nfsv4.test.svc.cluster1`:
    - 5GB logical volume in the `datavg` volume group
    - DRBD resources on both nodes (creation and synchronisation)
    - ext4 filesystem
- OpenSVC service object `test/svc/nfsv4`

After a few minutes (DRBD synchronisation time), you should end up in this situation:

#### Service Object `test/svc/nfsv4` Status

```
[root@node1 ~]# om test/svc/nfsv4 print status -r
test/svc/nfsv4                   up
`- instances
   |- node2                      down       idle
   `- node1                      up         idle, started
      |- ip#1            ........ up         netns macvlan nfsv4.opensvc.com/27 eth0@container#0
      |- volume#cfg      ........ up         nfsv4-cfg
      |- volume#data     ........ up         nfsv4-data
      |- container#0     ...../.. up         podman ghcr.io/opensvc/pause
      |- container#debug ...O./.. up         podman docker.io/opensvc/container_toolbox:latest
      |- container#nfs   ..D../.. n/a        podman docker.io/erichough/nfs-server
      |- sync#i0         ..DO./.. n/a        rsync svc config to nodes
      `- task#export     ...O./.. n/a        task.host
```

#### Volume Object `test/vol/nfsv4-data` Status

```
[root@node1 ~]# om test/vol/nfsv4-data print status -r
test/vol/nfsv4-data              up
|- instances
|  |- node2                      stdby up   idle
|  `- node1                      up         idle, started
|     |- disk#1         ......S. stdby up   lv datavg/nfsv4-data.test.vol.cluster1
|     |- disk#2         ......S. stdby up   drbd nfsv4-data.test.vol.cluster1
|     |                                     info: Primary
|     |- fs#1           ........ up         xfs /dev/drbd0@/srv/nfsv4-data.test.vol.cluster1
|     `- sync#i0        ..DO./.. n/a        rsync svc config to nodes
`- children
   `- test/svc/nfsv4             up
```

> **Note:** The agent automatically manages the dependency between the volume object and the service that uses it.

### Test the Core Failover

This step only serves to ensure that the IP, DRBD, and filesystem fail over back and forth between nodes before continuing with the NFS4 layer setup.

#### Initial Situation

The green `O` means that the service is currently running on `node1`.

**On node1 or node2:**

```
[root@node1 ~]# om test/svc/nfsv4 mon
test/svc/nfsv4                   node1 node2
 test/svc/nfsv4  up  ha  1/1   |  O^    S
```

#### Move Service to node2

The `switch` action will relocate the service to the other node. The `^` means that the service is not running on its preferred node.

**On node1 or node2:**

```
[root@node1 ~]# om test/svc/nfsv4 switch
@ n:node1 o:test/svc/nfsv4 sc:n
test/svc/nfsv4 defer target state set to placed@node2

[root@node1 ~]# om test/svc/nfsv4 mon
test/svc/nfsv4                   node1 node2
 test/svc/nfsv4  up^  ha  1/1  |  S^    O
```

#### Move Service Back to node1

You can use either the `switch` action or `giveback` to move the service to its preferred node.

**On node1 or node2:**

```
[root@node1 ~]# om test/svc/nfsv4 giveback
@ n:node1 o:test/svc/nfsv4 sc:n
test/svc/nfsv4 defer target state set to placed

[root@node1 ~]# om test/svc/nfsv4 mon
test/svc/nfsv4                   node1 node2
 test/svc/nfsv4  up  ha  1/1   |  O^    S
```

---

## Enable NFS4

We only need to start the NFS container to open the service to NFS clients.

### Enable & Start NFS Container Resource

**On node1:**

```
[root@node1 ~]# om test/svc/nfsv4 enable --rid container#nfs
@ n:node1 o:test/svc/nfsv4 sc:n
  remove container#nfs.disable

[root@node1 ~]# om test/svc/nfsv4 start --rid container#nfs
@ n:node1 o:test/svc/nfsv4 sc:n
  add rid volume#cfg, volume#data to satisfy dependencies
@ n:node1 o:test/vol/nfsv4-cfg r:fs#1 sc:n
  shmfs@/srv/nfsv4-cfg.test.vol.cluster1 is already mounted
@ n:node1 o:test/vol/nfsv4-data r:disk#1 sc:n
  lv datavg/nfsv4-data.test.vol.cluster1 is already up
@ n:node1 o:test/vol/nfsv4-data r:disk#2 sc:n
  drbd resource nfsv4-data.test.vol.cluster1 is already connected
  drbd resource nfsv4-data.test.vol.cluster1 is already Primary
@ n:node1 o:test/vol/nfsv4-data r:fs#1 sc:n
  xfs /dev/drbd0@/srv/nfsv4-data.test.vol.cluster1 is already mounted
@ n:node1 o:test/svc/nfsv4 r:container#nfs sc:n
  push start timeout to 05s (cached) + 02m (pull)
  ...
  wait for up status
  wait for container operational

[root@node1 ~]# om test/svc/nfsv4 print status -r
test/svc/nfsv4                   up
`- instances
   |- node2                      down       idle
   `- node1                      up         idle, started
      |- ip#1            ........ up         netns macvlan nfsv4.opensvc.com/27 eth0@container#0
      |- volume#cfg      ........ up         nfsv4-cfg
      |- volume#data     ........ up         nfsv4-data
      |- container#0     ...../.. up         podman ghcr.io/opensvc/pause
      |- container#debug ...O./.. up         podman docker.io/opensvc/container_toolbox:latest
      |- container#nfs   ...../.. up         podman docker.io/erichough/nfs-server
      |- sync#i0         ..DO./.. n/a        rsync svc config to nodes
      `- task#export     ...O./.. n/a        task.host
```

---

## Test

### Connect Clients

You should be able to mount the NFS root share from any client:

```bash
[root@client ~]# mount -v -t nfs4 -o proto=tcp,port=2049 nfsv4.opensvc.com:/ /mnt
mount.nfs4: timeout set for Thu Mar  2 17:11:37 2023
mount.nfs4: trying text-based options 'proto=tcp,port=2049,vers=4.2,addr=5.196.34.141,clientaddr=37.59.71.10'

[root@client ~]# df -h /mnt
Filesystem           Size   Used  Avail Use% Mounted on
nfsv4.opensvc.com:/  4860M     0  4560M   0% /mnt
```

### Test the Failover

Start NFS client activity (fio runs, for example), then reboot the node hosting the active service instance.

> **Warning:** OpenSVC is not responsible for the NFS4 container image `erichough/nfs-server`. It may need adaptations to fit your requirements. You can also replace it with another image.

---

## Admin Tasks

### Modify Exports

You may want to change the NFS exports list using the two-step procedure below:

```bash
om test/cfg/nfsv4 edit --key exports
om test/svc/nfsv4 run --rid task#export
```

> **Note:** The agent automatically pushes the new exports file into the container once it is saved to disk. The `task#export` resource execution proceeds with the new NFS shares export.

### Grace and lease time
In an HA cluster, the Lease Time (how long a client holds a lock) and Grace Time (the post-restart period where only lock recoveries are allowed) default to 90 seconds. This causes a significant "freeze" during a container failover, as the new NFS server blocks new I/O until the grace period expires. Reducing these values is critical for achieving fast, seamless transitions between nodes.

You can change these values in the `nfs` key of the `test/cfg/nfsv4` config map.

```bash
om test/cfg/nfsv4 edit --key nfs
```

> **Note:** The `nfs` key content is injected into the container as the `/etc/nfs.conf` file. You need to restart the container for the new configuration to be applied. You can check the current values with the command `docker exec -it test..nfsv4.container.nfs cat /proc/fs/nfsd/nfsv4gracetime` and `docker exec -it test..nfsv4.container.nfs cat /proc/fs/nfsd/nfsv4leasetime`.

> **Warning:** The grace period need to be superior or equal to the lease time and both must be > 10 at least. Setting a grace period too low may cause lock recovery issues during failover.

### Network Troubleshooting

If you experience any network issues, you can troubleshoot by entering the container network namespace using `container#debug`. It includes all network tools (netstat, ip, ...).

```bash
om test/svc/nfsv4 enter --rid container#debug
```