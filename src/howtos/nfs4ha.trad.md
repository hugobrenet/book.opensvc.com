<!-- llms: A highly available NFSv4 service with the fewest virtualization layers: setup, deployment, clients, and switch and failover tests. -->
# NFS4 High Availability Setup - Traditional Integration

This howto describes a NFS4-only HA service setup using the least possible virtualization layers (no persistent volume, no cluster backend network IP address, no ingress gateway, no container), to maximize efficiency and robustness.

It has been tested on Red Hat Enterprise Linux 8.7 nodes.


## Prerequisites

~ A couple of nodes:

```
node1 5.196.34.132
node2 5.196.34.133
```

~ A failover IP address for the NFS4 server:

```
nfsv4.opensvc.com 5.196.34.141
```

~ A Shared storage (SAN disk, DRBD, ...):

```
/dev/mapper/36001405102633e566cd41bebac415158
```


## Setup the OpenSVC Cluster

* [Install the agent](/agent/install.md#red-hat-enterprise-linux-8)
* [Enroll the nodes in the cluster](/agent/configure.cluster.md#enroll-a-node)

Now `om mon` should report:

```
Daemon                                 node1        node2        
 uptime                              | 11m          5m
 state                               |
 hb queue                            | 0            0            
 hb rx                               | O            O            
 hb tx                               | O            O            

Nodes                                  node1        node2        
 uptime                              | 11d          11d          
 score                               | 62           67           
  load15m                            | 0.2          0.4          
  mem                                | 66%3.82g<90% 30%3.82g<90% 
  swap                               | -            -            
 state                               |               

Objects ~ *                            node1        node2       
```

## Disable NFS4-Related systemd Unit Files

So they can be managed by OpenSVC.

**On both nodes:**

```bash
systemctl mask --now rpc-statd.service \
                     rpc-gssd.service \
                     rpcbind.service \
                     rpcbind.socket \
                     nfs-server.service \
                     nfs-mountd.service \
                     nfs-idmapd.service \
                     nfsdcld.service
```

## Deploy the Service

Deploy the OpenSVC service named `nfsv4` in the `test` namespace, storing configurations and data in the `/dev/mapper/36001405102633e566cd41bebac415158` SAN disk formatted with an ext4 filesystem, reachable with the public DNS name `nfsv4.opensvc.com` configured on the network interface `eth0`.

**On node1:**

```bash
om test/svc/nfsv4 deploy \
  --config https://raw.githubusercontent.com/opensvc/opensvc_templates/main/nfs/nfsv4.conf \
  --env dev=/dev/mapper/36001405102633e566cd41bebac415158 \
  --env nfshost=5.196.34.141 \
  --env nic=eth0
```

This command creates and provisions the system resources needed by the service on both nodes

```
root@node1:~# om system/svc/nfsv4 instance status -r
test/svc/nfsv4               up
└ instances
  ├ node2                    down  idle
  └ node1                    up    idle started
    └ resources
      ├ ip#1       ...../..  up    host 5.196.34.141/27 eth0
      ├ fs#1       ........  up    ext4 /dev/mapper/36001405102633e566cd41bebac415158@/srv/nfsv4.test.svc.cluster1
      ├ fs#2       ........  up    rpc_pipefs @/var/lib/nfs/rpc_pipefs
      ├ fs#3       ........  up    bind /srv/nfsv4.test.svc.cluster1/etc/nfs.conf@/etc/nfs.conf
      ├ fs#4       ........  up    bind /srv/nfsv4.test.svc.cluster1/etc/exports@/etc/exports
      ├ app#1      ...../..  up    simple nfsdcld
      ├ app#2      ...../..  up    simple rpc.idmapd
      ├ app#3      ...../..  up    forking nfsd
      └ app#4      ...../..  up    simple rpc.mountd
```


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

### Test the Switch

This step only serves to ensure that the IP, and filesystem fail over back and forth between nodes before continuing with the NFS4 layer setup.

#### Initial Situation

The green `O` symbol means that the service instance is currently running on `node1`.

**On node1 or node2:**

```
[root@node1 ~]# om test/svc/nfsv4 mon
test/svc/nfsv4                   node1 node2
 test/svc/nfsv4  up  ha  1/1   | O^    X
```

#### Move Service to node2

The `switch` action will relocate the service to the other node. The `^` symbol highlights the service preferred node.

**On node1 or node2:**

```
[root@node1 ~]# om test/svc/nfsv4 switch
```

After a few seconds, the service should end up like this:
```
[root@node1 ~]# om test/svc/nfsv4 mon
test/svc/nfsv4                   node1 node2
 test/svc/nfsv4  up^  ha  1/1  | X^    O
```

#### Move Service Back to node1

You can use either the `switch` action or `giveback` to move the service to its preferred node.

**On node1 or node2:**

```
[root@node1 ~]# om test/svc/nfsv4 giveback

[root@node1 ~]# om test/svc/nfsv4 mon
test/svc/nfsv4                   node1 node2
 test/svc/nfsv4  up  ha  1/1   | O^    X
```


### Test the Failover

Start NFS client activity (fio runs, for example), then reboot the node hosting the active service instance.


> **Warning:** This howto uses the default NFS4 security and tuning configurations. You may now tune the NFS4 configuration to match your specific requirements.
