<!-- llms: KVM guests a container.kvm resource describes with a few keywords: cloud image or cdrom install, volume files, networks, display, logs, caps, and what a namespace administrator may set. -->
# KVM Guests

A `container.kvm` resource can describe a guest with a few keywords, instead of a `virtinst` command. `virt-install` and libvirt pick the qemu options for the node.

The node needs `virt-install`, `qemu-img` and systemd. A guest on an om network also needs `dnsmasq` and `nft`.

A user holding the `admin` role of a namespace can run a guest. See [What a Namespace Administrator May Set](#what-a-namespace-administrator-may-set).

## A Guest From a Cloud Image

```
[DEFAULT]
nodes = n1 n2

[volume#1]
size = 10g
format = false

[volume#2]
name = images
exclusive = false

[container#1]
type = kvm
vcpus = 2
memory = 2g
disk = volume#1
network = backend3 backend5
image = volume#2:/noble.qcow2
cloud_init = from ./cfg/vm1 key user-data
```

`volume#1` is the disk of the guest, and `volume#2` a volume holding images. The keywords are read at the provision only, the definition of the domain being the reference from then on, except `network`.

`image` is a file of a volume of the object, or an http(s) url, or a path of the node for root. A qcow2 or raw image with no backing file. It is written to the first disk.

`name` defaults to `<namespace>..<name>.container.1`.

The placement leader makes the guest. The other nodes receive its definition, and do not touch its disks, so a guest failing over needs replicated or shared storage.

## Upload a File to a Volume

A namespace administrator gives a guest an operating system through a volume. The webapp has a **Files** tab on the volumes.

The api issues a ticket, and the file is sent to the console port of the node, served by a process of its own, which survives a restart of the daemon:

<div class="tabs">
<div class="tab" data-title="API">

```
TICKET=$(curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/instance/path/<ns>/vol/images/file?name=noble.qcow2" | jq -r .ticket)

curl -X PUT --data-binary @noble.qcow2 "https://<node>:1216/?ticket=$TICKET"
```

</div>
</div>

The file appears complete or not at all, and never in place of a file of its name unless the ticket is asked with `replace=true`: the ticket is refused `409` when the file exists, and so is the transfer when the file was created meanwhile, by the services using the volume for example. The transfer is answered `204`, `409` when the volume is not available on the node or the file exists, and `507` when the file does not fit in the size of the volume.

An uploaded file is marked with who sent it and when, in the `user.opensvc.upload` extended attribute, and the listing of the files says so in their `uploaded_by` and `uploaded_at`. A file rewritten in place keeps the mark, its `modified_at` then later than its `uploaded_at`. A filesystem keeping no extended attributes leaves the files unmarked.

The files of the volume are reached in its directories with the `dir` parameter, a path relative to the top of the volume, which no component may lead up from nor be hidden. The listing (`GET …/file?dir=isos`) returns the files, directories and links, a link being listed as what it says and never followed, the first 1000 by name and `truncated` when there are more. `POST …/file/directory?dir=isos&name=debian` makes a directory, and no parent. `DELETE …/file?dir=isos&name=x` removes a file, a link, or an empty directory: nothing recursively. A directory not existing is answered `404`, one that is something else `409`. An installer uploaded in a directory is named as `volume#2:/isos/debian.iso` by the `cdrom` and `image` keywords.

A file of a volume is read the same way: `POST …/file/download?dir=isos&name=debian.iso` issues the ticket, and a `GET` of the console port with it answers the bytes, `200`, or `206` for a single `Range`, as an attachment of the name of the file. A ticket opens one read. A link is not followed: it is answered `409`, as a directory is, and a file not existing `404`.

A volume shared by several objects needs `exclusive = false` on all their `volume` resources.

## Download Images

The node policy on urls refuses every url by default. Root says the sources the cluster trusts, for all the nodes:

<div class="tabs">
<div class="tab" data-title="CLI">

```
om cluster config update --set "node.allowed_urls=https://cloud-images.ubuntu.com/*"
```

</div>
</div>

They apply to all that fetches a url on a node, as the source of a key. `node.allowed_cidrs` allows the private range of a mirror of the site, a url being still needed. A url is fetched as root from the node, so these are root's to set, and redirects stay refused: a url must be the final one.

## Install From a CDROM

```
[container#1]
type = kvm
vcpus = 2
memory = 2g
disk = volume#1
network = backend3
cdrom = volume#2:/debian.iso
osinfo = debian12
```

The installer runs at the provision. Answer it on the [display](#display).

The guest stops at the first reboot of the installer, for it to boot its disk from then on. The object is then in `warn`, its volumes being up, which an orchestrated start refuses. Start the instance:

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> instance start
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/instance/path/<ns>/svc/<name>/action/start"
```

</div>
</div>

An installer stopped before its end is not resumed: the definition no longer has the media, and the guest is to be provisioned again.

A lan network is refused with `cdrom`, an installed system having no cloud-init to tell it its address.

## Networks

`network` gives the guest an interface per om network. A network being of one family, a guest of both is on two.

* On a `routed_bridge` or a `bridge` network, a dnsmasq of the bridge hands the address out by mac at each boot. A start on another node gets an address of that node.
* On a `lan` network, the address follows the guest, which cloud-init tells it at its first boot, so a lan needs `image`.

The addresses are in the dns of the cluster, in the `ipaddr` and `ipaddrs` resource status info.

A filter keeps the guest to its mac and its addresses: it can not take the address of another, nor answer as a router or a dhcp server. The start is refused on a node with no `nft`, and the status warns of a running guest having lost its filter or its dnsmasq. The filter expects an eui-64 link-local address on an ipv6 network, which a cloud image is told to use. A guest installed by hand has to use one.

A guest on an om network can not be moved live. A lan on an interface that is neither a linux nor an openvswitch bridge is refused, and so is a lan for a flex object, whose instances would hold one mac and one address.

## Display

A guest the keywords describe has a vnc display on a unix socket, so the node opens no port for it. The webapp has a **Display** action on the `container.kvm` resources, to see the screen, use the keyboard and send Ctrl+Alt+Del.

The action opens a console session with a one-time ticket, for the `admin` of the namespace:

<div class="tabs">
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/instance/path/<ns>/svc/<name>/console?rid=container%231&graphics=true"
```

</div>
</div>

The binary messages of the websocket opened with the ticket are the bytes of the RFB protocol. A guest with a spice display says so: the browser speaks vnc.

## Logs

The container logs of a guest are what it writes to its first serial port, from its first boot on: the kernel, the init system and cloud-init, whose host key fingerprints are a way to check the key a first ssh connection is shown.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> container logs --rid container#1 --follow
```

</div>
<div class="tab" data-title="API">

```
curl -s -N -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/instance/path/<ns>/svc/<name>/container/log?rid=container%231&follow=true"
```

</div>
</div>

Reading them takes the root role, and each node keeps the file of the runs it held, so the output of a run before a failover is read on the node it ran on. A guest provisioned before this feature gets the file at its next start.

The terminal sequences are removed from what is read, not from the file. Whatever shows on the serial console is kept, a session logged in there included. A guest writing nothing to its serial port, as Windows does by default, has empty logs.

The qemu log of the domain stays in `/var/log/libvirt/qemu/<name>.log`: it is the one of the hypervisor, and a start that fails says its error in the logs of the action.

## Caps and Claims

A guest runs in the process group of its resource, under the ones of its object and its namespace, so the `pg_*` keywords bound it. A cap changes live with `om <path> instance pg update`.

`vcpus` and `memory` are what the guest sees, whatever the caps:

* `pg_cpus` says the host cpus its threads run on.
* `pg_cpu_quota` caps all its threads together: `100%@2` for 2 vcpus at full speed.
* `pg_mem_limit` counts the memory it touched and what qemu takes, which is about 300m more for a guest of 1g. Over it, the guest is killed.

So a cap below the `memory` of a guest plus 384m is refused, and so are guests of an object not fitting its cap together.

In a namespace claiming the cpu or the memory, a guest with no cap is capped to what it is given, and counted for it: `100%@<vcpus>`, and `memory` plus 384m. A node with no systemd can not cap a guest, which is refused there.

## What a Namespace Administrator May Set

| Keyword | |
|---|---|
| `vcpus`, `memory`, `cloud_init`, `start_timeout`, `stop_timeout` | yes |
| `disk` | `volume#N` only |
| `image`, `cdrom` | a url, or `volume#N:/path` |
| `network` | network names, within the claims of the namespace |
| `osinfo` | an osinfo name |
| anything else, as `virtinst`, `virtinst_args`, `bridge`, `network_filter`, `name`, `rcmd` | root |

`encapnodes` with a kvm guest needs root too: the node reaches an encapsulated node by name, as root.
