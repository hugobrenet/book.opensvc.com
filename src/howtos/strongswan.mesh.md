<!-- llms: Encrypting with strongSwan the traffic between the nodes of a routed bridge network, rendered and run by an OpenSVC service: its key, configuration and checks. -->
# strongSwan Mesh

A [routed bridge](../agent/configure.networks.md#routed-bridge) network
carries the traffic between the nodes in tunnels, `ipip` or `ip6ip6`, which
encrypt nothing. This page deploys strongSwan on every node to encrypt them
with IPsec, its configuration rendered by the agent from the tunnels of the
node, and following them as nodes join or leave and as the key rotates.

The deployment was run as written on a three-node cluster, `dev2n1`,
`dev2n2` and `dev2n3`, whose `backend1` routed bridge tunnels its traffic
over `fd01:2345:6789:2900::/64`. The outputs below are from that cluster.

## How it works

Three objects of the `system` namespace:

* `system/sec/strongswan`, the pre-shared key of the mesh.
* `system/cfg/strongswan`, the strongSwan configuration, its `swanctl.conf` a
  [template](../agent/apps.design.datastores.md#templates) rendered on each
  node into one IPsec connection per tunnel of the node.
* `system/svc/strongswan`, a service running on every node, which installs
  the configuration in a tmpfs, runs strongSwan in a container, and keeps the
  two up to date with two [event-triggered tasks](../agent/internals.daemon.scheduler.md#event-triggered-runs):
  * `task#refresh` installs the configuration again when the peers of a
    network change, rendered from the new tunnels.
  * `task#load_all` has strongSwan load the configuration again whenever an
    install wrote it, whatever ran the install: the refresh, a start, or a
    change of the key.

## The pre-shared key

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om system/sec/strongswan create
om system/sec/strongswan key add --name psk --value "$(openssl rand -base64 32)"
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/octet-stream" \
  --data-binary '[DEFAULT]' \
  "https://<node>:1215/api/object/path/system/sec/strongswan/config/file"

openssl rand -base64 32 | tr -d '\n' |
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @- \
  "https://<node>:1215/api/object/path/system/sec/strongswan/data/key?name=psk"
```

</div>
</div>

## The configuration

`swanctl.conf` is a template ranging over the `tunnels` of the node, each
tunnel once, with the addresses of its two ends:

```
# Rendered by om on {{ref "nodename"}}: one transport mode connection per
# tunnel of the networks of the node, encrypting what it carries.
connections {
{{- range tunnels }}
    {{.Nodename}} {
        version      = 2
        local_addrs  = {{.Local}}
        remote_addrs = {{.Remote}}
        local {
            auth = psk
        }
        remote {
            auth = psk
        }
        children {
            om-tunnel {
                mode         = transport
                local_ts     = dynamic[4],dynamic[41]
                remote_ts    = dynamic[4],dynamic[41]
                start_action = trap
            }
        }
    }
{{- end }}
}
secrets {
    ike-mesh {
        secret = {{printf "%q" (key "./sec/strongswan" "psk")}}
    }
}
```

* The connections are in transport mode, and select the protocols `4` and
  `41`, the `ipip` and `ip6ip6` tunnels: what is encrypted is the tunnel
  traffic, between the two ends. With `tunnel_mode = gre`, select `47`.
* `start_action = trap` negotiates a connection on its first packet, so a node
  joining needs no action of its peers. The packets sent while it is
  negotiated are dropped.
* `key` reads the pre-shared key from the sec. The rendered file holds it, so
  its install line sets mode `600`.

`strongswan.conf` has strongSwan load the configuration when it starts:

```
charon {
    start-scripts {
        swanctl-load = swanctl --load-all
    }
}
```

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om system/cfg/strongswan create
om system/cfg/strongswan key add --name swanctl.conf --from swanctl.conf
om system/cfg/strongswan key add --name strongswan.conf --from strongswan.conf
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/octet-stream" \
  --data-binary '[DEFAULT]' \
  "https://<node>:1215/api/object/path/system/cfg/strongswan/config/file"

for key in swanctl.conf strongswan.conf
do
  curl -s -X POST -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/octet-stream" \
    --data-binary @$key \
    "https://<node>:1215/api/object/path/system/cfg/strongswan/data/key?name=$key"
done
```

</div>
</div>

## The service

`strongswan.svc.conf`:

```ini
[DEFAULT]
topology = flex
flex_min = {#nodes}
orchestrate = ha
nodes = {clusternodes}

[fs#1]
type = tmpfs
mnt = /srv/{fqdn}
size = 1m
mode = 700
install = /swanctl.conf from ./cfg/{name} key swanctl.conf mode 600 template required
    /strongswan.conf from ./cfg/{name} key strongswan.conf mode 644 required

[container#swanctl]
type = oci
image = mberner/strongswan:5.9.11
rm = true
detach = true
privileged = true
netns = host
volume_mounts = {fs#1.mnt}/swanctl.conf:/etc/swanctl/swanctl.conf:ro {fs#1.mnt}/strongswan.conf:/etc/strongswan.conf:ro

[task#refresh]
type = host
install = fs#1
on = NetworkPeersUpdated
pace = @30s backoff @1m

[task#load_all]
type = host
container = container#swanctl
command = swanctl --load-all
log = true
on = FileInstalled,rid=fs#1
```

* `flex_min = {#nodes}` runs an instance on every node, each one encrypting the
  tunnels of its node.
* The configuration is installed in a tmpfs, so the rendered key never reaches
  a disk.
* The container shares the network namespace of the node, where the tunnels
  and the IPsec policies are. Its image is an example: any image with
  strongSwan's `charon` and `swanctl` does.
* `task#refresh` is a host task with no command: its work is the `install`.
  `pace` runs it once for the several networks a node joining updates.
* `task#load_all` runs `swanctl --load-all` in the container, whatever its
  runtime, on the installs that wrote the files.

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om system/svc/strongswan create --config strongswan.svc.conf --provision --wait
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @strongswan.svc.conf \
  "https://<node>:1215/api/object/path/system/svc/strongswan/config/file"

curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/object/path/system/svc/strongswan/action/provision"
```

</div>
</div>

    $ om system/svc/strongswan instance ls
    OBJECT                 NODE    AVAIL
    system/svc/strongswan  dev2n1  up
    system/svc/strongswan  dev2n2  up
    system/svc/strongswan  dev2n3  up

## Check

Each node renders its own peers. On `dev2n1`, the secret masked:

    connections {
        dev2n2 {
            version      = 2
            local_addrs  = fd01:2345:6789:2900::11
            remote_addrs = fd01:2345:6789:2900::12
            ...
        }
        dev2n3 {
            version      = 2
            local_addrs  = fd01:2345:6789:2900::11
            remote_addrs = fd01:2345:6789:2900::13
            ...
        }
    }

The first traffic in the tunnels negotiates the connections:

    $ docker exec system..strongswan.container.swanctl swanctl --list-sas
    dev2n2: #2, ESTABLISHED, IKEv2, ea2b32a62ceaa7c3_i 5d09b564f3813dee_r*
      local  'fd01:2345:6789:2900::11' @ fd01:2345:6789:2900::11[4500]
      remote 'fd01:2345:6789:2900::12' @ fd01:2345:6789:2900::12[4500]
      AES_CBC-128/HMAC_SHA2_256_128/PRF_HMAC_SHA2_256/ECP_256
      om-tunnel: #4, reqid 1, INSTALLED, TRANSPORT, ESP:AES_GCM_16-128
        local  fd01:2345:6789:2900::11/128[ipencap] fd01:2345:6789:2900::11/128[ipv6]
        remote fd01:2345:6789:2900::12/128[ipencap] fd01:2345:6789:2900::12/128[ipv6]
    dev2n3: #1, ESTABLISHED, IKEv2, 44ae77070c3fa61d_i 5d835693278b8de3_r*
      ...

and the kernel encrypts the tunnel traffic with ESP:

    $ ip xfrm state | grep -A1 ^src
    src fd01:2345:6789:2900::11 dst fd01:2345:6789:2900::12
    	proto esp spi 0xc5333751 reqid 1 mode transport
    src fd01:2345:6789:2900::12 dst fd01:2345:6789:2900::11
    	proto esp spi 0xc5894520 reqid 1 mode transport
    ...

## Rotate the key

A change of the pre-shared key installs `swanctl.conf` again on every node, as
the template read it, and the install has strongSwan load it:

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om system/sec/strongswan key change --name psk --value "$(openssl rand -base64 32)"
```

</div>
<div class="tab" data-title="API">

```bash
openssl rand -base64 32 | tr -d '\n' |
curl -s -X PUT -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @- \
  "https://<node>:1215/api/object/path/system/sec/strongswan/data/key?name=psk"
```

</div>
</div>

    $ om system/svc/strongswan logs --node '*'
    ...
    2026-10-11T22:33:45.687392+02:00 INF dev2n1: instance: system/svc/strongswan: fs#1: reinstall key swanctl.conf from system/cfg/strongswan to /srv/strongswan.system.svc.reliable-leopard/swanctl.conf with owner : perm -rw-------
    2026-10-11T22:33:45.888706+02:00 INF dev2n1: daemon: scheduler: system/svc/strongswan: task#load_all: run: on FileInstalled,node=dev2n1,path=system/svc/strongswan,rid=fs#1: due now
    2026-10-11T22:33:46.053920+02:00 INF dev2n2: instance: system/svc/strongswan: fs#1: reinstall key swanctl.conf from system/cfg/strongswan to /srv/strongswan.system.svc.reliable-leopard/swanctl.conf with owner : perm -rw-------
    2026-10-11T22:33:46.058449+02:00 INF dev2n3: instance: system/svc/strongswan: fs#1: reinstall key swanctl.conf from system/cfg/strongswan to /srv/strongswan.system.svc.reliable-leopard/swanctl.conf with owner : perm -rw-------
    2026-10-11T22:33:46.256092+02:00 INF dev2n2: daemon: scheduler: system/svc/strongswan: task#load_all: run: on FileInstalled,node=dev2n2,path=system/svc/strongswan,rid=fs#1: due now
    2026-10-11T22:33:46.259537+02:00 INF dev2n3: daemon: scheduler: system/svc/strongswan: task#load_all: run: on FileInstalled,node=dev2n3,path=system/svc/strongswan,rid=fs#1: due now

The connections established keep their keys until they are negotiated again.
The ones negotiated after the load use the new pre-shared key.

## Nodes joining and leaving

A node leaving the cluster changes the peers of the routed bridges of the
others. Their network setup publishes one `NetworkPeersUpdated` per network,
`task#refresh` runs at the first and once more for the others, and renders the
tunnels left:

On `dev2n1`, as `dev2n3` was evicted, the labels left out:

    $ om daemon events --filter NetworkPeersUpdated --filter FileInstalled -o json
    {"kind":"NetworkPeersUpdated","id":0,"at":"2026-10-11T21:11:04.34949462+02:00","data":{"node":"dev2n1","name":"backend1"}}
    {"kind":"NetworkPeersUpdated","id":1,"at":"2026-10-11T21:11:04.349501204+02:00","data":{"node":"dev2n1","name":"backend2"}}
    {"kind":"NetworkPeersUpdated","id":2,"at":"2026-10-11T21:11:04.355136718+02:00","data":{"node":"dev2n1","name":"backend3"}}
    {"kind":"NetworkPeersUpdated","id":3,"at":"2026-10-11T21:11:04.355946578+02:00","data":{"node":"dev2n1","name":"backend4"}}
    {"kind":"NetworkPeersUpdated","id":4,"at":"2026-10-11T21:11:04.356517017+02:00","data":{"node":"dev2n1","name":"backend5"}}
    {"kind":"FileInstalled","id":5,"at":"2026-10-11T21:11:04.746653447+02:00","data":{"node":"dev2n1","path":"system/svc/strongswan","rid":"fs#1","files":["/swanctl.conf"],"at":"2026-10-11T21:11:04.544314706+02:00"}}

The file was installed within a second of the network setup, and loaded: the
connection to `dev2n3` was gone. The run the other
networks asked for, 30 seconds later, rendered the same file, installed
nothing, and loaded nothing.

A node joining is the same the other way round: the others render the tunnel to
it as soon as it is in the cluster nodes, and its own instance renders all the
tunnels when it starts.

> ➡️ See Also
> * [Templates](../agent/apps.design.datastores.md#templates)
> * [Event-triggered Runs](../agent/internals.daemon.scheduler.md#event-triggered-runs)
> * [Cluster Networks](../agent/configure.networks.md)
