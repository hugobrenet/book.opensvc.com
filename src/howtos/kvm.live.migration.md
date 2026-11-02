<!-- llms: A step-by-step guide to a highly available KVM cluster with live migration, using DRBD 9 and OpenSVC on Ubuntu 24.04. -->
KVM High Availability Clustering Using DRBD and OpenSVC on Ubuntu 24.04
---

# Introduction

This document provides a step-by-step guide for deploying a
high-availability (HA) KVM cluster using **DRBD 9** from Linbit and
**OpenSVC** on **Ubuntu 24.04**. DRBD provides network-based block
replication, effectively acting as shared storage comparable to RAID1
over TCP/IP.

This setup enables:
-   Automatic failover of KVM virtual machines when a node becomes unavailable
-   Live migration of virtual machines with zero downtime

# Prerequisites
 
This guide uses the following environment:

-   Two Ubuntu 24.04 servers: `n1` and `n2`
-   Same network segment: `10.30.0.0/24`
-   IP addressing:
    -   `n1` → `10.30.0.11`
    -   `n2` → `10.30.0.12`
    -   `kvm1` → `10.30.0.20`
    -   Gateway → `10.30.0.1`
-   CPU virtualization extensions enabled (`VT-x` for Intel, `AMD-V` for
    AMD)
-   Sudo or root access
-   Sufficient disk space available on both nodes

# Installation

## DRBD

DRBD software is a product from Linbit company. It is shipped by default on Ubuntu distributions as version `8.x`. The current guide requires DRBD version **9.x** minimum.

Linbit exposes a drbd public ppa repository, where DRBD release candidates are regularly pushed. We will use this repository to install DRBD version 9.

### Add Linbit DRBD9 PPA

Let's add [Linbit DRBD9 public ppa](https://launchpad.net/~linbit/+archive/ubuntu/linbit-drbd9-stack "Linbit DRBD Public PPA Repository") to our distributions, and install DRBD.

```
sudo add-apt-repository ppa:linbit/linbit-drbd9-stack
sudo apt update
sudo apt -y install drbd-dkms drbd-utils
modinfo drbd | grep ^version
```

> ⚠️ **Warning**: The Linbit public PPA is not recommended for
> production. For production-grade repositories and support, contact
> [Linbit](https://linbit.com "Linbit website") directly.


### Verify DRBD version

```
opensvc@n1:~$ modinfo drbd | grep ^version
version:        9.2.15
```

### Ensure DRBD systemd unit is disabled 

DRBD systemd unit must remain **disabled** on cluster nodes.

> ⚠️ **Warning**: OpenSVC must be the only component responsible of DRBD resources management.

```
opensvc@n1:~$ systemctl status drbd
○ drbd.service - DRBD -- please disable. Instead, use the per resource drbd@.target template unit.
     Loaded: loaded (/usr/lib/systemd/system/drbd.service; disabled; preset: disabled)
     Active: inactive (dead)
       Docs: man:drbd.service(7)
```


## System Upgrade

Ensure your operating system is up to date

```
sudo apt update
sudo apt -y dist-upgrade
sudo reboot
```

## Time Synchronization (NTP)

Ensure all nodes have NTP enabled. Ubuntu defaults are usually sufficient.

```
opensvc@n1:~$ sudo timedatectl status
               Local time: Fri 2025-10-31 11:52:34 CET
           Universal time: Fri 2025-10-31 10:52:34 UTC
                 RTC time: Fri 2025-10-31 10:52:34
                Time zone: Europe/Paris (CET, +0100)
System clock synchronized: yes
              NTP service: active
          RTC in local TZ: no
```

## Check server name resolution

It is very important that both nodes are correctly configured from a name service resolution point of view

Check that:

* `n1` can resolve n2 to ip addr
* `n2` can resolve n1 to ip addr
* both nodes can resolve `kvm1` to ip addr

## KVM Installation

### Verify CPU Virtualization Support

Check that your processors support hardware virtualisation extensions

You must see either `vmx` or `svm` from the `egrep --color "(vmx|svm)" /proc/cpuinfo` command

### Install Hypervisor Components

You need to install the following packages to run KVM virtual machines

```
sudo apt install -y qemu-kvm virtinst virt-manager libguestfs-tools bridge-utils
```

Once done, ensure that libvirtd systemd unit is enabled and started

```
sudo systemctl enable --now libvirtd.service
```

## Local Storage Setup

DRBD requires a block device. For this guide, we use an LVM volume group on `/dev/vdb`.

```
opensvc@n1:~$ sudo pvcreate -f /dev/vdb
opensvc@n1:~$ sudo vgcreate data /dev/vdb
opensvc@n1:~$ sudo vgs
  VG   #PV #LV #SN Attr   VSize   VFree 
  data   1   0   0 wz--n-  <5.00g <5.00g
  root   1   1   0 wz--n- <26.95g     0 
```


## Setup firewall

If your network enforces filtering, ensure the following flows are allowed:

* `n1 <=> 22/tcp <=> n2` ssh communication between nodes
* `n1 <=> 1215/tcp <=> n2` api communication between nodes
* `n1 <=> 10000/tcp <=> n2` unicast heartbeat communication between nodes
* `n1 <=> 7289/tcp <=> n2` DRBD communication between nodes for first DRBD resource
* `n1, n2 <=> icmp <=> 10.30.0.0/24` OpenSVC has security checks, one of them uses icmp ping


> ⚠️ **Warning**: Each DRBD resource need a dedicated TCP port to communicate with peer node. If you plan to deploy 10 different DRBD resources, then you have to open ports starting from 7289 to 7289+9=7298

## Network Bridge Setup

As we prepare a KVM virtual machine deployment, it will require a direct network connection to our subnet `10.30.0.0/24`.

A network bridge has to be configured on both cluster nodes. 

The netplan configuration is described below

```
opensvc@n1:~$ sudo cat /etc/netplan/br-prd.yaml 
network:
  version: 2
  renderer: networkd
  ethernets:
    enp1s0:
      match:
        macaddress: "22:23:24:1e:00:11"
      set-name: enp1s0
      dhcp4: no
      dhcp6: no
  bridges:
    br-prd:
      interfaces: 
        - enp1s0
      parameters:
        stp: false
        forward-delay: 0
      accept-ra: no
      addresses: 
        - 10.30.0.11/24
      nameservers:
        search:
          - demo.com
        addresses:
          - 8.8.8.8
          - 8.8.4.4
      routes:
        - to: 0.0.0.0/0
          via: 10.30.0.1
          metric: 100
```

Adjust the bridge configuration to your environment, and then apply it

```
sudo netplan generate --debug
sudo netplan apply --debug
```

## OpenSVC

### Installation

The OpenSVC server installation is described [here](https://book.opensvc.com/agent/install.html "OpenSVC installation")


#### Import opensvc gpg signing keys

```
curl -s -o- https://packages.opensvc.com/gpg.public.key.asc | \
    sudo gpg --dearmor --output /etc/apt/trusted.gpg.d/opensvc-package-pub.gpg --yes
```

#### Add the opensvc repository to apt sources

```
cat - <<EOF | sudo tee /etc/apt/sources.list.d/opensvc.list 
deb https://packages.opensvc.com/apt/ubuntu uat-opensvc-v3-noble main
deb-src https://packages.opensvc.com/apt/ubuntu uat-opensvc-v3-noble main
EOF
```

#### Install the opensvc server

```
sudo apt update
sudo apt -y install opensvc-server
```

> 🛈 **Info**: Although not mandatory, the package `opensvc-client` should also be installed. It installs the `ox` command, which is a fancy text user interface tool to manage OpenSVC clusters

Once the installation is done, ensure systemd unit `opensvc-server` is enabled and started

```
sudo systemctl enable --now opensvc-server.service
```

Finally, check that OpenSVC is running fine **on both nodes**

```
opensvc@n1:~$ sudo om mon
Threads                              n1           
 daemon                            | O            
 collector                         | /            
 hb                                |              
  hb#1.rx          running unicast | /            
  hb#1.tx          running unicast | /            
 listener                          | 1215         
 scheduler         running         |              
                                                  
Nodes                                n1           
 score                             | 97           
  load15m                          | 0.0          
  mem                              | 20%2.83g<98% 
  swap                             | 0%3.56g<90%  
 state                             |              
                                                  
Objects matching *                   n1           

```

### Set a custom cluster name (optional)

It is a best practise to set a custom cluster name, especially if you plan to deploy multiple different clusters

On node `n1`:
```
opensvc@n1:~$ sudo om cluster config update --set cluster.name=drbd4kvm
committed
opensvc@n1:~$ sudo om cluster config get --kw cluster.name
drbd4kvm
```

### Enroll cluster nodes

We enroll `n2` in the `n1` cluster from our laptop.

A join token is created on `n2`, and piped to the `om cluster enroll` command executed on `n1`, which reads it from its standard input:
```
ssh opensvc@n2 sudo om daemon auth --role join --duration 10m | ssh opensvc@n1 sudo om cluster enroll --node n2 --token /dev/stdin --wait
```

The log should looks like below

```
john@laptop:~$ ssh opensvc@n2 sudo om daemon auth --role join --duration 10m | ssh opensvc@n1 sudo om cluster enroll --node n2 --token /dev/stdin --wait
Node n2 accepted the join order
Cluster nodes updated
Waiting for n2 to beat
Node n2 is alive
```

And the `om mon` command executed on one of the cluster nodes should looks like:

```
root@n1:~# om mon
Daemon          n1           n2           
 uptime       | 3m23         3m24         
 state        | dns          dns          
 hb queue     | 0            0            
 hb rx        | O            O            
 hb tx        | O            O            
                                          
Nodes           n1           n2           
 uptime       | -            -            
 score        | 95           95           
  load15m     | 0.2          0.2          
  mem         | 30%2.83g<98% 27%2.83g<98% 
  swap        | 1%3.56g<90%  1%3.56g<90%  
 state        |                           
                                          
Objects ~ *     n1           n2           
```


> 🛈 **Info**: We can see that a unicast heartbeat `hb rx` and `hb tx` has been autoconfigured. By default, it exchanges information on TCP port 10000.

Heartbeats details can be seen using `om daemon hb status` command.


```
root@n1:~# om daemon hb status
RUNNING  BEATING  ID       NODE  PEER  TYPE     DESC         CHANGED_AT                           
O        O        hb#1.rx  n1    n2    unicast  :10000 ← n2  2025-11-28T09:35:08.603796279+01:00  
O        O        hb#1.tx  n1    n2    unicast  → n2:10000   2025-11-28T09:35:08.444365461+01:00  
O        O        hb#1.rx  n2    n1    unicast  :10000 ← n1  2025-11-28T09:35:11.706616707+01:00  
O        O        hb#1.tx  n2    n1    unicast  → n1:10000   2025-11-28T09:35:11.463338726+01:00  
```

> ⚠️ **Warning**: The default heartbeat configuration is ++minimal++. For a real production deployment, it is highly recommended to add other heartbeats kinds (relay, disk, multicast, unicast), and enable quorum arbitration.


### Configure SSH trust

Enable automatic SSH trust between nodes (used for internal safety mechanisms).

This configuration is automated using the command below.

```
om cluster ssh trust
```

The configuration creates an opensvc dedicated ssh key pair on each node, and trust the public keys on all cluster nodes

```
root@n1:~# ls -l ~/.ssh/opensvc*
-rw------- 1 root root 452 Nov  4 11:06 /root/.ssh/opensvc
-rw-r--r-- 1 root root 133 Nov  4 11:06 /root/.ssh/opensvc.pub
root@n1:~# cat ~/.ssh/authorized_keys 
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMgCrZCehGhMPJK5j1ImjfzEKCaoSTiUBweLHteT8Hxd opensvc@n1 sshkey=opensvc 2025-11-04T11:06:31+01:00
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKRBR+niCfqJPDINuIeZjQo17FhYK0FpQMutb3474p48 opensvc@n2 sshkey=opensvc 2025-11-04T11:06:31+01:00
```

Test:
```
root@n1:~# ssh -i /root/.ssh/opensvc n2 hostname
```

### Configure DRBD storage pool

To make smooth DRBD configuration, we declare a DRBD storage pool in the cluster. The pool will be backed by the LVM volume group named `data`, which was created previously.


```
root@n1:~# om cluster config update --set pool#drbdvm.type=drbd --set pool#drbdvm.vg=data
committed

root@n1:~# om cluster config show --section pool#drbdvm
[pool#drbdvm]
type = drbd
vg = data
```

Once done, we can query the cluster about free space in the pool

```
root@n1:~# om pool list --name drbdvm
NAME    TYPE  CAPABILITIES                     HEAD  VOLUME_COUNT  BIN_SIZE  BIN_USED  BIN_FREE  
drbdvm  drbd  rox,rwx,roo,rwo,snap,blk,shared  data  0             10g       0         10g       
```

By default the pool is cluster wide, so the reported space is aggregated accross nodes. To see local space, we have to specify the target node

```
root@n1:~# om pool list --name drbdvm --node n1
NODE  NAME    TYPE  CAPABILITIES                     HEAD  VOLUME_COUNT  BIN_SIZE  BIN_USED  BIN_FREE  
n1    drbdvm  drbd  rox,rwx,roo,rwo,snap,blk,shared  data  0             5g        0         5g        
```

### Configure OpenSVC service

We first deal with the DRBD storage part, and then with VM provisioning

#### Create service: storage part

First we create a service named `kvm1` in the `demo` namespace, with automated orchestration, and accross all cluster nodes
```
root@n1:~# om demo/svc/kvm1 create --kw nodes={clusternodes} --kw orchestrate=ha
```

Then we add storage resources to the service
```
om demo/svc/kvm1 config update --set volume#data.name={name} --set volume#data.shared=true --set volume#data.size=4G --set volume#data.format=false --set volume#data.pool=drbdvm
```

We have the following config at the moment
```
root@n1:~# om demo/svc/kvm1 config show
[DEFAULT]
nodes = {clusternodes}
orchestrate = ha
id = a6867a1e-e8b3-46eb-919f-78d4c60ca9c9

[volume#data]
name = {name}
shared = true
size = 4G
format = false
pool = drbdvm
```

> 🛈 **Info**: The volume#data config snippet will request a storage device to the cluster, which will provision it into the drbd pool because of the `shared=true` parameter. In case you have many pools in the cluster config, it is possible to add the `pool=drbdkvm` parameter to force the target pool used for volume creation.

Now provision the storage part
```
root@n1:~# om demo/svc/kvm1 provision --wait
OBJECT         ORCHESTRATION_ID                      ERROR  
demo/svc/kvm1  e332c71f-1f6b-4aed-b7fe-345db3fb00a9  -      

```

During the DRBD device initial synchronisation, we see the transitional states below:

```
root@n1:~# drbdadm status
kvm1.demo.vol.drbd4kvm role:Primary
  disk:UpToDate open:no
  n2 role:Secondary
    replication:SyncSource peer-disk:Inconsistent done:30.84

root@n1:~# om demo/svc/kvm1 instance status -r
demo/svc/kvm1                    up    warn                                     
└ instances            
  ├ n2                           down  idle                                     
  └ n1                           up    warn idle started                        
    └ resources                                                                 
      └ volume#data    ........  up    kvm1                                     
                                       warn: Volume demo/vol/kvm1 has warnings  
```
Once the synchronisation is finished, the states looks like:

```
root@n1:~# drbdadm status
kvm1.demo.vol.drbd4kvm role:Primary
  disk:UpToDate open:no
  n2 role:Secondary
    peer-disk:UpToDate

root@n1:~# om demo/svc/kvm1 instance status -r
demo/svc/kvm1                    up                  
└ instances            
  ├ n2                           down  idle          
  └ n1                           up    idle started  
    └ resources                                      
      └ volume#data    ........  up    kvm1          
```

The DRBD volume creation is fully automated. The DRBD configuration is located in `/etc/drbd.d/kvm1.demo.vol.drbd4kvm.res`

```
root@n1:~# cat /etc/drbd.d/kvm1.demo.vol.drbd4kvm.res
resource kvm1.demo.vol.drbd4kvm {
    
    on n1 {
        device    /dev/drbd0;
        disk      /dev/data/kvm1.demo.vol.drbd4kvm;
        meta-disk internal;
        address   ipv4 10.30.0.11:7289;
        node-id   0;
    }
    
    on n2 {
        device    /dev/drbd0;
        disk      /dev/data/kvm1.demo.vol.drbd4kvm;
        meta-disk internal;
        address   ipv4 10.30.0.12:7289;
        node-id   1;
    }
    
    connection-mesh {
        hosts n1 n2;
    }
}
```

The command below displays the devices involved in the service. We can see that the resulting exposed DRBD device is `/dev/drbd0`
```
root@n1:~# om demo/svc/kvm1 instance device list
OBJECT         RESOURCE     DRIVER_GROUP  DRIVER_NAME  ROLE     DEVICE                            
demo/svc/kvm1  volume#data  volume                     exposed  /dev/drbd0
demo/svc/kvm1  volume#data  volume                     sub      /dev/data/kvm1.demo.vol.drbd4kvm
demo/svc/kvm1  volume#data  volume                     base     /dev/data/kvm1.demo.vol.drbd4kvm
```

#### Create service: vm part

Now that the DRBD block device is ready, we can focus on VM deployment. 4 steps are needed:

1. Download a qcow2 image and customize it
2. Dump image content into DRBD device
3. Create the kvm guest
4. Declare the kvm resource in OpenSVC service


##### Download a qcow2 image and customize it

We start by downloading a VM image, Ubuntu 25.10 (Questing Quokka) for the demo. We store it in `/var/lib/libvirt/images/questing.kvm1.img`.

```
curl -L -o /var/lib/libvirt/images/questing.kvm1.img https://cloud-images.ubuntu.com/questing/current/questing-server-cloudimg-amd64.img
```

For customization purposes, the `virt_customize` command brings the following features

- set root password to `drbdrocks`
- set hostname to `kvm1`
- copy file `enp1s0.yaml` into image file at `/etc/netplan/enp1s0.yaml`

First create the file `enp1s0.yaml` to configure network at boot

```
cat >| enp1s0.yaml <<EOF
network:
  version: 2
  renderer: networkd
  ethernets:
    enp1s0:
      dhcp4: no
      dhcp6: no
      addresses: 
        - 10.30.0.95/24
      routes:
        - to: 0.0.0.0/0
          via: 10.30.0.1
          metric: 100
EOF
```

Then actually customize the image file

```
root@n1:~# virt-customize -a /var/lib/libvirt/images/questing.kvm1.img \
--root-password password:drbdrocks \
--hostname kvm1 \
--copy-in enp1s0.yaml:/etc/netplan
```

> 🛈 **Info**: Try with `--no-network` if virt-customize fails.

##### Dump image content into DRBD device

Let's convert the qcow2 image to raw format, and write it into the DRBD device
```
IMAGE_LOC=/var/lib/libvirt/images/questing.kvm1.img
DRBD_DEV=/dev/drbd0
qemu-img convert -f qcow2 -O raw $IMAGE_LOC $DRBD_DEV
```

##### Create the KVM guest

Initiate the virt-install command to instantiate and boot the vm

```
OS_VARIANT=ubuntu25.10
VM_BRIDGE=br-prd
virt-install \
--name kvm1 \
--ram 2048 \
--vcpus 2 \
--cpu=host \
--disk path=$DRBD_DEV \
--os-variant $OS_VARIANT \
--network bridge:$VM_BRIDGE,model=virtio \
--graphics none \
--audio none \
--console pty,target_type=serial \
--boot hd \
--noautoconsole \
--import
```

> 🛈 **Info**: The OS_VARIANT value can be identified using command `virt-install --osinfo list`. The VM_BRIDGE value corresponds to the bridge that we created earlier in the demo.


The virtual machine boots in the background. The console is available using command `virsh console kvm1`, and can be exited with `control+]`. If you have an X server available, it is possible to use the graphical interface using the command `virt-manager`.

After a few seconds, the virtual machine is available

```
root@n1:~# ping -c3 kvm1
PING kvm1 (10.30.0.20) 56(84) bytes of data.
64 bytes from kvm1 (10.30.0.20): icmp_seq=1 ttl=64 time=0.255 ms
64 bytes from kvm1 (10.30.0.20): icmp_seq=2 ttl=64 time=0.794 ms
64 bytes from kvm1 (10.30.0.20): icmp_seq=3 ttl=64 time=0.545 ms

--- kvm1 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2021ms
rtt min/avg/max/mdev = 0.255/0.531/0.794/0.220 ms
```

##### Declare the kvm resource in OpenSVC service

Once the virtual machine is operational, we have to add it to the OpenSVC service configuration, as a new resource:

```
root@n1:~# om demo/svc/kvm1 config update --set container#1.type=kvm --set container#1.name=kvm1
committed

root@n1:~# om demo/svc/kvm1 instance status -r
demo/svc/kvm1                    up                          
└ instances            
  ├ n2                           down  mix-provisioned idle  
  └ n1                           up    idle started          
    └ resources                                              
      ├ volume#data    ........  up    kvm1                  
      └ container#1    ........  up    kvm kvm1              
```

> ⚠️ **Warning**: As the VM provisioning was done manually on `n1`, the `mix-provisioned` state appear on the `n2` instance. We have to inform `n2` OpenSVC agent that the virtual machine resource is actually provisioned.


```
root@n1:~# om demo/svc/kvm1 instance provision --state-only --node n2
OBJECT         NODE  SID                                   
demo/svc/kvm1  n2    d24fb390-8d62-4fa8-80cb-77da3980778c  

root@n1:~# om demo/svc/kvm1 print status -r
demo/svc/kvm1                    up                  
└ instances            
  ├ n2                           down  idle          
  └ n1                           up    idle started  
    └ resources                                      
      ├ volume#data    ........  up    kvm1          
      └ container#1    ........  up    kvm kvm1      
```

The service state is now normal on both nodes.

# Tests

## Test OpenSVC service

It is now possible to test service failover between nodes. Two methods are possible:
- VM switch with downtime
- VM switch with kvm live migration (no downtime)

### VM switch with downtime

The switch action can be submitted with the command `om demo/svc/kvm1 switch`

The following steps are orchestrated:
- n1: stop the VM
- n1: bring down drbd device (secondary)
- n2: bring up drbd device (primary)
- n2: start the vm

```
root@n1:~# om demo/svc/kvm1 instance ls
OBJECT         NODE  AVAIL  
demo/svc/kvm1  n1    up   
demo/svc/kvm1  n2    down 

root@n1:~# om demo/svc/kvm1 switch --wait
OBJECT         ORCHESTRATION_ID                      ERROR  
demo/svc/kvm1  983c32b5-96c4-4930-8eb2-670c5fae0cc8  -      

root@n1:~# om demo/svc/kvm1 instance ls
OBJECT         NODE  AVAIL  
demo/svc/kvm1  n1    down   
demo/svc/kvm1  n2    up 
```

> 🛈 **Info**: This process can take several seconds or even minutes depending on kvm domain use.

### VM switch with kvm live migration (no downtime)

The switch action can be submitted with the command `om demo/svc/kvm1 switch --live`

The following steps are orchestrated:
- n1: enable drbd dual primary
- n1: launch virsh migrate --live --persistent
- n1: disable drbd dual primary


```
root@n1:~# om demo/svc/kvm1 instance ls
OBJECT         NODE  AVAIL  
demo/svc/kvm1  n1    up   
demo/svc/kvm1  n2    down 

root@n1:~# om demo/svc/kvm1 switch --live --wait
OBJECT         ORCHESTRATION_ID                      ERROR  
demo/svc/kvm1  c898ddc6-f827-48b5-8686-21ddf500e56e  -      

root@n1:~# om demo/svc/kvm1 instance ls
OBJECT         NODE  AVAIL  
demo/svc/kvm1  n1    down   
demo/svc/kvm1  n2    up 
```

> 🛈 **Info**: This process is transparent, without any network disruption.

