<!-- llms: The roles of the users of the cluster API, per namespace, guest, operator and admin, and cluster-wide, such as root, and what each allows. -->
# Role-Based Access Control

A cluster reached over its API requires authentication, and every request is
checked against the privileges of the authenticated user.

Privileges live in the `grant` keyword of a `usr` object, as a
whitespace-separated list of grant expressions. A grant is a role, optionally
scoped to namespaces:

```ini
[DEFAULT]
grant = guest:prod* admin:test*
```

That user is a guest in every namespace whose name starts with `prod`, and an
admin in those starting with `test`.

A role given without a scope applies cluster-wide:

```ini
[DEFAULT]
grant = operator
```

## Namespace roles

These roles are the ones you scope to namespaces. Each inherits the previous.

### guest

Read-only. List objects, read their configuration, status, schedule, resource
info and logs.

### operator

Inherits `guest`, and may change the state of what already exists: start,
stop, restart, freeze, unfreeze, shutdown, switch, giveback, abort, run,
clear, refresh status and resource info.

An operator runs services. An operator does not create, delete or provision
them.

### admin

Inherits `operator`, and may change what exists: create and delete objects,
edit their configuration, provision and unprovision their resources, purge
them, and manage the keys of `cfg` and `sec` objects.

## Cluster roles

These roles are not namespace-scoped.

### root

All privileges. A user granted `root` can read and change the system's files
and run commands as the root system user, so it is the grant to give last and
audit first.

### squatter

May create namespaces, and may write a namespace configuration. The creator is
automatically granted `admin` on the namespace it creates.

A namespace configuration says what the objects of that namespace may take of
what the cluster shares: how much of a pool, how many addresses of a network,
how much of the node the slice they all run under may use. That is given from
outside the namespace, which is why it is this role and not `admin`.
Administering the objects of a namespace and rationing the cluster between
namespaces are two jobs, and holding the first does not give the second: no
`admin` grant, scoped or not, writes a namespace configuration.

```bash
$ om ns1/ config update --set claim#1.limit=500m   # as admin:ns1
403 need one of [squatter root] grant
```

### prioritizer

May set object priority. Priority arbitrates between objects across namespace
boundaries, which is why it is a cluster role rather than something an admin
holds in its own namespace.

### blacklistadmin

Reserved for clearing the client blacklist. The role is accepted in a grant,
but no v3 endpoint requires it yet, so granting it currently confers nothing.

### heartbeat

May use the relay handlers. A relay heartbeat authenticates on a foreign
OpenSVC daemon with a user holding this role.

    om daemon relay status

### join, leave

May add a node to the cluster, or remove one from it, plus the reads a node
performs while joining, and the collector registration of the joining node
by the node it joins through. These back the token minted on a node to
enroll, which `om cluster enroll --token` uses to reach it:

    om daemon auth --role join --duration 10m

`om cluster enroll` and `om cluster evict` themselves require the `root`
grant.

## Keyword rules

A role says which objects a user may write. Some keywords ask for more than
the role, whatever the object, because of what setting them does to the node
rather than to the object.

`om <path> config doc` says so, keyword by keyword:

```bash
$ om <path> config doc --kw container#1.run_args
	rbac:        Requires the root grant.

$ om <path> config doc --kw fs#1.type
	rbac:        Requires the root grant, except for the values flag.
```

The shape of the rules:

* **A trigger requires `root`**, on every driver. `pre_start` and its siblings
  run a command of the user's choosing on the node.
* **A driver group whose resources take something from the node requires
  `root`**, opening only the keywords that say what the object does with what
  it was given. An `ip` resource is the example: which address and which link
  are the node administrator's, while `network`, `netns` and `expose` are the
  object's.
* **A driver group the policy says nothing about requires `root`.** A driver
  added to om later is refused until a rule allows it, rather than allowed
  until someone remembers to refuse it.
* **Some rules read the value.** A container's `type` is open for the types
  that run an image under the container engine, and `root` for the ones that
  run on the node itself. A volume's `install` is `root` only when its source
  is a file of the server.
* **A keyword can mean different things on different kinds.** A `pg_` limit on
  a namespace caps every object of that namespace and needs `squatter`; the
  same keyword on a service caps that service alone and is the object
  administrator's.

### A volume belongs to root, except its size

A volume object is the storage itself, where a service is what consumes it. Its
resources were written when the volume was served — which pool served it, which
device it exposes, what filesystem is on it — so none of it is the namespace
administrator's to edit, not even the flag filesystems that are open on a
service.

`DEFAULT.size` is the exception. A namespace grows its own volume within the
claim it holds on the pool, and rationing that growth is what the claim is for,
so the size is written by the namespace and bounded by the claim.

Asking for different storage is a keyword of the service that consumes the
volume, not of the volume.

### A write answers for what it changes

A configuration you may not have written is not a configuration you may not
change. The keywords already in it were written by whoever was allowed to
write them, and only what a write changes is checked against the policy.

An object administrator can therefore fix a comment on a service that mounts a
filesystem, without holding the `root` grant that mounting one asks for.

Creating an object has nothing to compare against, so every keyword of it is a
change and answers for itself. Unsetting a keyword is a change like setting
one: a user who may not set a keyword may not unset it either.

What counts as a change is what the value evaluates to, not what is written.
A keyword can hold a reference, and moving what it refers to rewrites it
without touching it:

```ini
[env]
cmd = /bin/evil          # written by the namespace administrator

[app#1]
pre_start = {env.cmd}    # written by root, and now running something else
```

That write is refused. References are followed however deep they go, and on
every node the object runs on, because a keyword is written once per node and a
reference that resolves the same here can resolve to something else on a peer.

> ➡️ See Also
> * [Cluster API](configure.api.md)
> * [Cluster Configuration](configure.cluster.md) for the enroll and evict procedures.
