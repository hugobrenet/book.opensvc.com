<!-- llms: An ingress gateway, an haproxy service exposing outside the cluster the services of a backend network: its topologies, certificate, configuration and deployment. -->
# Ingress Gateway

Services obtaining their IP address from a backend network are not reachable
from outside the cluster. An ingress gateway is a service with a public
address that routes the requests of the outside world to them.

HAProxy is our recommended program for it, routing layer 4 and layer 7
traffic. This page deploys one, with certificates the agent renews.

## How the gateway finds the backends

The gateway names the backend servers by their [cluster dns](configure.dns.md)
names, `<name>.<namespace>.svc.<clustername>`, and HAProxy resolves them again
as they move, with its `resolvers` mechanism:

    resolvers clusterdns
        parse-resolv-conf
        accepted_payload_size 8192

HAProxy runs in a container started by the agent, whose `/etc/resolv.conf`
names the cluster nameservers, and `parse-resolv-conf` reads them from there.
A backend then refers to these resolvers:

    backend svc1
        server-template svc1_ 1 svc1.ns1.svc.${CLUSTERNAME}:80 resolvers clusterdns check init-addr none

`init-addr none` lets HAProxy start while a backend is not resolvable yet,
its service being down or not deployed.

## Topologies

* **One gateway for the cluster:** a single HAProxy, in a failover service.
  The public address moves with it. This is the deployment below.
* **One gateway per node:** every node runs a HAProxy exposing the same
  servers, in a `topology = flex` service, and an upstream load balancer picks
  one.

## Deploy

The gateway is three objects of a namespace, here `igw`:

* `igw/sec/haproxy`, the certificate of the https frontend
* `igw/cfg/haproxy`, the haproxy configuration
* `igw/svc/haproxy`, the service running haproxy, which installs the other two
  in a volume

### The certificate

A self-signed certificate is enough to start with. The
[Certificates](#certificates) section below replaces it with one the browsers
trust.

```bash
om igw/sec/haproxy create --kw cn=svc1.example.com
om igw/sec/haproxy certificate create
```

### The haproxy configuration

```
global
    tune.lua.bool-sample-conversion normal
    lua-load /usr/local/etc/haproxy/acme-http01-webroot.lua
    # a reload waits no longer than this for the open connections to end
    hard-stop-after 30s

resolvers clusterdns
    parse-resolv-conf
    accepted_payload_size 8192

defaults
    mode http
    timeout connect 5s
    timeout client 30s
    timeout server 30s

frontend http
    bind :80
    acl acme path_beg /.well-known/acme-challenge/
    http-request use-service lua.acme-http01 if METH_GET acme
    redirect scheme https code 301 if !acme

frontend https
    bind :443 ssl crt /usr/local/etc/haproxy/certs/
    use_backend svc1 if { hdr(host) -i svc1.example.com }

backend svc1
    server-template svc1_ 1 svc1.${NAMESPACE}.svc.${CLUSTERNAME}:80 resolvers clusterdns check init-addr none
```

* The `http` frontend redirects to https, except the ACME challenge path,
  which a small lua responder serves from the webroot the certificate renewal
  writes in.
* The `https` frontend loads every certificate of the `certs/` directory, and
  presents the one whose names match the server name the client asks for.
  Serving another domain is installing one more certificate there.
* `hard-stop-after` bounds a reload, as the one following a renewed
  certificate: the old process waits for the open connections to end, and a
  websocket can stay open for hours.

Save it as `haproxy.cfg`, and store it in the cfg, with the lua responder:

```bash
om igw/cfg/haproxy create
om igw/cfg/haproxy key add --name haproxy.cfg --from haproxy.cfg
om igw/cfg/haproxy key add --name acme-http01-webroot.lua \
  --from https://raw.githubusercontent.com/opensvc/opensvc_templates/main/igw_haproxy/common/acme-http01-webroot.lua
```

### The service

```ini
[DEFAULT]
nodes = *
orchestrate = ha

[volume#1]
type = shm
name = {name}
size = 1m
user = 99
group = 99
install = `
	/haproxy/haproxy.cfg from ./cfg/{name} key haproxy.cfg signal HUP:container#1
	/haproxy/acme-http01-webroot.lua from ./cfg/{name} key acme-http01-webroot.lua signal HUP:container#1
	/haproxy/certs/{name}.pem from ./sec/{name} key fullpem signal HUP:container#1
	/haproxy/acme-challenges/
`

[ip#1]
type = netns
network = default
netns = container#0
shared = true

[container#0]
image = ghcr.io/opensvc/pause
rm = true
shared = true

[container#1]
image = docker.io/haproxy:3.2-alpine
rm = true
environment = CLUSTERNAME={clustername} NAMESPACE={namespace}
volume_mounts = `
	volume#1:/haproxy:/usr/local/etc/haproxy
	volume#1:/haproxy/acme-challenges:/acme-challenges
`
netns = container#0
restart = 3
shared = true

[task#acme]
type = acme
secs = {name}
webroot = volume#1:/haproxy/acme-challenges
schedule = @1d
run_requires = container#1(up)
```

* `volume#1` is a small memory-backed volume holding the files haproxy reads,
  installed from the cfg and the sec. Nothing in it needs keeping or
  replicating: it is installed anew on every start, so the service fails over
  without any storage.
* The `signal` of the install lines makes haproxy reload when a key changes,
  on every node running it: a configuration edited, or a certificate renewed,
  takes effect without a restart.
* `user` and `group` are the ones haproxy runs as in its image. A `sec` key
  installs readable by its owner only.
* `ip#1` takes an address from a [cluster network](configure.networks.md),
  in the network namespace of the `container#0` pause container, which the
  haproxy container joins.
* `volume_mounts` names the paths of the volume by the rid of its resource.
  The lua responder reads the challenge tokens from `/acme-challenges`.
* `task#acme` renews the certificates, see [Certificates](#certificates).

Save it as `haproxy.conf`, and deploy:

```bash
# Use a network spanning the cluster nodes, if you have one, and make sure
# the cluster nameservers answer requests from it.
om igw/svc/haproxy deploy --config haproxy.conf --kw ip#1.network=default --wait
```

### Test

Deploy a web server as the `svc1` backend, saved as `svc1.conf`:

```ini
[DEFAULT]
nodes = *
orchestrate = ha

[ip#1]
type = netns
network = default
netns = container#0

[container#0]
image = ghcr.io/opensvc/pause
rm = true

[container#1]
image = docker.io/nginx:alpine
rm = true
netns = container#0
```

```bash
om igw/svc/svc1 deploy --config svc1.conf --kw ip#1.network=default --wait
```

The gateway answers on its backend address already, from a cluster node:

```bash
IP=$(om igw/svc/haproxy resource ls ip#1 --node $HOSTNAME -o json | jq -r '.items[].data.status.info.ipaddr')

# fake the dns resolution of svc1.example.com to the gateway address
curl -k --resolve svc1.example.com:443:$IP https://svc1.example.com
```

## Public address

For the clients outside the cluster, add a public address to the service, in
the network namespace of `container#0`, so it moves with the gateway:

```ini
[ip#2]
type = netns
name = 203.0.113.10
netmask = 24
gateway = 203.0.113.1
dev = br-prd
mode = bridge
netns = container#0
shared = true
```

`dev` is the bridge of the nodes on the public network. The dns records of the
domains served point to `name`. [Cluster Networks](configure.networks.md)
describes the other modes.

## Certificates

The https frontend presents the certificate of `igw/sec/haproxy`, self-signed
so far. Once the domain resolves to the public address, obtain it from Let's
Encrypt instead, trying the setup out against its staging directory first:

```bash
om igw/sec/haproxy set --kw acme.directory=letsencrypt-staging
om igw/svc/haproxy instance run acme --node <node running the gateway> --follow
```

The run proves the domain through the `http` frontend, stores the certificate
issued in the sec, and installs it, haproxy reloading. Once the staging
certificate is in place, switch to the directory browsers trust, and run
again:

```bash
om igw/sec/haproxy set --kw acme.directory=letsencrypt
om igw/svc/haproxy instance run acme --node <node running the gateway> --follow
```

From then on, the daily `task#acme` renews the certificate within 30 days of
its expiry.

To serve another domain, create a sec for it, install its `fullpem` in
`certs/`, add it to the task, and run the task:

```bash
om igw/sec/www create --kw cn=www.example.com --kw acme.directory=letsencrypt
om igw/svc/haproxy set \
  --kw volume#1.install+="/haproxy/certs/www.pem from ./sec/www key fullpem signal HUP:container#1" \
  --kw task#acme.secs+=www
om igw/svc/haproxy instance run acme --node <node running the gateway> --follow
```

    INF igw/sec/www: set key fullpem
    INF igw/svc/haproxy: volume#1: install key fullpem from igw/sec/www to /srv/haproxy.igw.vol.cluster1/haproxy/certs/www.pem with owner 99:99 perm -rw-------
    INF igw/svc/haproxy: container#1: send SIGHUP signal to container igw..haproxy.container.1 (pid 3869733)
    INF igw/svc/haproxy: task#acme: igw/sec/www: certificate issued for www.example.com: no certificate

A namespace administrator may configure every piece of this: the task writes
only in the volume of its service, and renews only the secs the namespace may
use. [Certificates](apps.design.certificates.md) has the details: when a
renewal is due, the secs of other namespaces, and the renewal from the
command line.
