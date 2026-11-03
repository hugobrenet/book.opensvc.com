<!-- llms: Namespaces: object paths within them, cloning into a namespace, and the claims of a namespace on pools, networks and compute. -->
# Namespaces

Namespaces allow users to create objects with the same name in different naming spaces.

The `<namespace>/<kind>/<name>` notation is called a path.

The object selector (`--service` option for `svcmgr` and `svcmon`, first argument for `om`) accepts the path notation.

Namespaced objects have their config stored in `/etc/opensvc/namespaces/<namespace>/<kind>/`.

This feature is available since version 1.9-2748.

## Operations with namespaces

> A namespace configuration is an object of kind `nscfg`, named `namespace`,
> so `test/` is `/api/object/path/test/nscfg/namespace`. The **API** tabs
> assume the `$TOKEN` and the listener endpoint set up in
> [Cluster API](configure.api.md).

### The object path

The namespace is part of the path, so naming the object names its namespace.
This is the way to create an object in a namespace, and it works for every
command:

<div class="tabs">
<div class="tab" data-title="CLI">

```sh
om test/svc/svc1 create
om test/svc/svc1 start
om 'test/**' ls
```

</div>
<div class="tab" data-title="API">

```sh
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/octet-stream" --data-binary '[DEFAULT]' \
  "https://<node>:1215/api/object/path/test/svc/svc1/config/file"
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/object/path/test/svc/svc1/action/start"
curl -s -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'path=test/**' \
  "https://<node>:1215/api/object/path"
```

</div>
</div>

### OSVC_NAMESPACE environment variable

`OSVC_NAMESPACE` narrows which objects a command sees, so a selector that would
match the whole cluster is confined to one namespace:

```sh
$ export OSVC_NAMESPACE=test
$ om '**' ls
test/svc/svc1
test/svc/svc2
```

```sh
$ unset OSVC_NAMESPACE
$ om '**' ls
svc0
test/svc/svc1
test/svc/svc2
```

It selects among the objects that exist. It does not decide where a new one is
created: with `OSVC_NAMESPACE=test` exported, `om svc1 create` still creates
`svc1` in the root namespace, because the path it was given says root. Name the
namespace in the path instead.

### Cloning into a namespace

When creating an object from another one, `--namespace` overrides the
destination namespace, which saves rewriting the path:

```sh
om svc2 create --config=svc1 --namespace=test
```

This creates `test/svc/svc2` from the configuration of `svc1`.

A configuration that refers to other objects survives the clone only if those
references are relative. See [Relative object paths](#relative-object-paths).

## Claims on cluster resources

The objects of a namespace consume things the cluster owns and its peers share:
the space of a pool, the addresses of a network, the cpu and memory of the
nodes. A namespace can be capped on what it takes of one, so that it cannot
drain a resource the others are meant to share. A cap is declared in the
namespace configuration, as a `claim` section naming the kind of resource, the
resource when there are several of that kind, and the limit:

```ini
[claim#1]
type = pool
name = tank
limit = 250m

[claim#2]
type = network
name = backend2
limit = 10
```

Edit it like any other object configuration, naming the namespace with a
trailing `/`:

<div class="tabs">
<div class="tab" data-title="CLI">

```sh
om test/ config update --set claim#1.type=pool --set claim#1.name=tank --set claim#1.limit=250m
om / config show
```

</div>
<div class="tab" data-title="API">

```sh
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'set=claim#1.type=pool' \
  --data-urlencode 'set=claim#1.name=tank' \
  --data-urlencode 'set=claim#1.limit=250m' \
  "https://<node>:1215/api/object/path/test/nscfg/namespace/config"
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/object/path/root/nscfg/namespace/config/file"
```

</div>
</div>

A namespace declaring no claim on a resource is not capped on it. A claim
naming no limit says the namespace uses the resource, not that it is capped on
it.

### Pool claims

A pool claim counts the size each volume of the namespace was created or
resized with, cluster-wide. An allocation or a resize taking the namespace over
its limit is refused, and the pool is reported as one that does not match, with
the reason:

```
$ om test/svc/app provision
... no pool matching criteria: [tank] the test namespace may claim 250mi of it
and already claims 200mi, so it cannot claim 100mi more
```

It counts what was asked for, not what is written: a pool hands out what it
promised, and that promise is what is being rationed. So a namespace can be at
its limit on a pool that is nearly empty, and a pool can be full while every
namespace is under its limit.

### Network claims

A network claim counts the addresses the namespace holds in the network,
cluster-wide. An allocation taking the namespace over its limit is refused:

```
$ om test/svc/app start
... ip#1: start: network backend2: the test namespace may hold 10 address(es)
of it and already holds 10
```

Addresses are counted, not reservations: a failover object holds the same
address on every node it is configured on, and that is one address taken from
the network, while the instances of a flex each hold one of their own.

The limit is checked when an address is allocated, not when one already held is
asked for again, so a namespace that reached its limit still restarts what it
already runs. Lowering a limit below what a namespace already holds is
therefore allowed, and takes effect on the next allocation rather than by
taking addresses back.

### Compute claims

A `cpu` or `memory` claim bounds what the objects of the namespace may be
capped to, cluster-wide. It names no resource, because the cluster has only
one compute:

```ini
[claim#3]
type = cpu
limit = 800%
default = 50%

[claim#4]
type = memory
limit = 16g
default = 512m
```

The cpu `limit` uses the `pg_cpu_quota` notation: `800%` or `100%@8` is eight
cpus. `@all` is refused, because it depends on the size of a node. The memory
`limit` is a size.

<div class="tabs">
<div class="tab" data-title="CLI">

```sh
om test/ config update --set claim#3.type=cpu --set claim#3.limit=800% --set claim#3.default=50%
```

</div>
<div class="tab" data-title="API">

```sh
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'set=claim#3.type=cpu' \
  --data-urlencode 'set=claim#3.limit=800%' \
  --data-urlencode 'set=claim#3.default=50%' \
  "https://<node>:1215/api/object/path/test/nscfg/namespace/config"
```

</div>
</div>

**What an object claims.** An object claims what its processes are capped to
(`pg_cpu_quota`, `pg_mem_limit`), counted on every instance it can run at
once:

* A resource is bounded by its own cap. A subset or an object cap bounds the
  sum of the caps under it.
* A failover object counts one started instance. A flex object counts
  `flex_target` of them. Any node might run a started instance, so each one
  is counted on the node where its caps are highest.
* Every other node counts the object's standby resources, which run there too.

So a flex object with a target of 2 and a 50% cpu container claims 1 cpu,
however many nodes it lists. The daemon publishes each object's claim in its
instance configuration, as `claims`.

**Default caps.** A container, or a podman, docker or oci task, whose
resource, subset and object all say no cap is given the claim's `default`. It
runs with that cap, and is counted for it. The processes of `app` resources
never get the default: capping them is up to the object.

**Uncapped processes.** A process that nothing caps can take the whole node,
so it cannot be counted. An object running one in a claimed namespace cannot
grow its claim until it is capped:

```
$ om test/svc/web config update --set app#1.type=simple --set app#1.start="/bin/sleep 1000"
Error: test/svc/web: [403] Forbidden: claim overrun: ... runs a process capped by nothing on it: cap it with pg_cpu_quota on its resource or its object (the default of a claim caps the containers only)
```

**When it is checked.** The claim is weighed when a configuration is written,
before anything runs. A write that raises an object's claim past the limit is
refused:

```
$ om test/svc/web config update --set container#2.pg_cpu_quota=60%
Error: test/svc/web: [403] Forbidden: claim overrun: test/svc/web claims cpu 1.1 cpu, memory 384mi, and cpu: the test namespace may claim 1 cpu of it and already claims 0.75 cpu, so it cannot claim 0.35 cpu more
```

A write that leaves an object's claim unchanged, or lowers it, is always
accepted. An object created before the namespace had a claim can therefore
still be edited.

**Starting more instances than counted.** Starting an instance on top of the
ones its claim counts, such as a second instance of a failover object, is
refused to users other than root:

```
[403] Forbidden: claim overrun: the test namespace claims the compute of 1 started instance(s) of test/svc/web, and 1 already run(s)
```

Root is let through, and the daemon logs a warning.

Compute claims are how a namespace is bounded when its containers run
[rootless](apps.design.rootless.md). Those run in their users' cgroup trees,
which the namespace `pg_*` caps do not reach.

### Where the limit is read

The limit is read from the namespace configuration on the node doing the
allocation, never over the api. A namespace configuration is present on every
cluster node, and most namespaces claim nothing, so the common case asks
nothing of the daemon. Only a namespace that is actually capped needs the
cluster-wide count of what it already holds, and failing to reach the daemon
for that count leaves the claim unchecked rather than refused: a cap is
something the cluster brokers, and where no daemon answers there is nothing
brokering.

## References

A `{namespace}` reference is available in service configuration.

## Cgroups

Services in an explicit namespace have the namespace name inserted in their cgroup path:
```
opensvc.slice/<namespace>.slice/<name>.slice
```

## The "root" pseudo namespace

Services created before namespace support, and services created without an explicit namespace, are assigned to a pseudo namespace named `root`. Their configs are stored in `/etc/opensvc/`.

The root pseudo namespace name is used in cluster DNS names (`<name>.root.svc.<clustername>`) and DNS search paths, but is not embedded in Docker container names or cgroup paths.

The `{namespace}` reference evaluates to `root`.

### Select objects in the root namespace
```sh
$ om 'root/**' ls
$ OSVC_NAMESPACE=root om '**' ls
```

### Create objects in the root namespace
```sh
$ unset OSVC_NAMESPACE
$ om svc1 create
```

## Relative object paths

An object referring to another one can name it with a path relative to its own
namespace, by replacing the namespace with a `.`:

```ini
[DEFAULT]
parents = ./svc/db

[fs#1]
install = /etc/app.conf from ./cfg/app key app.conf
```

`./svc/db` reads as "the `db` service, in whatever namespace I am in". For
`test/svc/app` it resolves to `test/svc/db`, and for `prod/svc/app` to
`prod/svc/db`, with no change to the configuration.

That is the point of the notation: a set of objects designed together can be
cloned from a development namespace to a production one, and keeps referring to
its own members rather than reaching back into the namespace it came from. A
fully qualified `test/svc/db` would follow the clone and still point at `test`.

Node configuration is not namespaced, so the same notation in `node.conf`
resolves in the `system` namespace: `./sec/relays` is `system/sec/relays`.

## Relations

Children and parents relations use object paths or object names.

- If a name is declared in the parents, slaves, or children lists, the related objects are searched in the same namespace. `svc2` and `./svc/svc2` are the same relation, the second stating it explicitly.
- A relation to an object in another namespace must be declared using its path instead of its name.
- Relations to objects in the root pseudo namespace must be defined as `root/<kind>/<name>` to avoid ambiguity.
