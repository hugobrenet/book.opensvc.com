<!-- llms: Running podman containers and tasks as an unprivileged user: what to expect, and how to set up the nodes for it. -->
# Rootless Containers

A podman container, or a podman task, can run as an unprivileged unix user
instead of root. The agent still drives it, but every podman command runs as
that user, so the container, its image and its store belong to the user, and
the processes of the container run under the user's subordinate ids. Root
inside the container is the user on the host, not root.

This is the podman driver's rootless mode. The docker and oci drivers have no
equivalent.

## What to expect

A rootless container is managed like any other: it starts, stops, fails over
and reports its status through the same commands. What changes is on the node:

* **The processes are the user's.** Root in the container is the user on the
  host, and ids from 1 are the user's subordinate ids. A process escaping the
  container has the rights of that user, no more.
* **The store is the user's.** Images are pulled into
  `~/.local/share/containers` of the user, on each node. An image root pulled
  is not seen, and the user pulls it again.
* **The container lives in the user's cgroup tree.** podman places it under
  `user.slice/user-<uid>.slice/user@<uid>.service`, the subtree systemd
  delegates to the user, not under `opensvc.slice`. The agent makes the groups
  of the object there and caps them. The files holding the caps stay root's,
  so the user cannot lift them.
* **It outlives the daemon.** The containers run under the user's systemd
  instance, not under the agent, so restarting the daemon or the
  `opensvc-server` unit leaves them running, with their caps.
* **The resolver is written where the user can read it.** The `resolv.conf`
  of the container is written under `/run/user/<uid>/opensvc/`, rewritten on
  every start.
* **Networking works as for a rootful container.** An `ip.netns` resource
  can plumb an address in the network namespace of a rootless container, as
  in the example below.
* **Some caps need the controller delegated.** A default `user@.service` is
  delegated the `cpu`, `memory` and `pids` controllers. `pg_cpus`, `pg_mems`
  and `pg_blkio_weight` need `cpuset` and `io`, and are reported as not
  applied until those are delegated too. See [Delegating more
  controllers](#delegating-more-controllers).
* **Namespace and node caps do not reach it.** The groups of the namespace
  and of the node are not copied into the user's tree. Copying them would give
  each user tree its own full budget, which caps nothing. The object caps and
  the resource caps apply. What the namespace consumes is accounted for by
  its [compute claims](apps.design.namespaces.md#compute-claims).

## Setting up the nodes

Do this once per user, on every node the object can run on.

### 1. The user and its subordinate ids

```sh
useradd --create-home webapp
grep webapp /etc/subuid /etc/subgid
```

`useradd` grants subordinate ids on most distributions. If the `grep` prints
nothing, grant a range yourself:

```sh
usermod --add-subuids 200000-265535 --add-subgids 200000-265535 webapp
```

Give the user the **same uid, the same subordinate ranges, and the same
home** on every node: the host ids of the container's files depend on them,
and a volume failing over to another node has to be read there the same way.

### 2. A systemd instance that runs without a login

```sh
loginctl enable-linger webapp
ls -d /run/user/$(id -u webapp)
```

Without linger, the user's systemd instance, and every container under it,
stops when the user's last session ends. It also does not run at boot, so the
agent cannot start the container there.

### 3. Delegating more controllers

This step is optional. It is needed only for `pg_cpus`, `pg_mems` or
`pg_blkio_weight` on a rootless container:

```sh
mkdir -p /etc/systemd/system/user@.service.d
cat >/etc/systemd/system/user@.service.d/delegate.conf <<EOF
[Service]
Delegate=cpu cpuset io memory pids
EOF
systemctl daemon-reload
```

The change applies when the user's systemd instance next starts.

### What happens if a step is missing

The container refuses to start and names what is missing. The instance status
shows the same messages as warnings on the resource, for example:

```
the systemd instance of webapp is not running, /run/user/1001 does not exist: run 'loginctl enable-linger webapp' so it runs without a login session
webapp has no subordinate ids in /etc/subuid: podman cannot map the users of a rootless container
```

### 4. Allowing the account in the namespace

The account a container runs as reaches everything else that account owns
on the node, including the containers of other objects. So a namespace may
use only the accounts its configuration lists, and only the squatter writes
that list:

<div class="tabs">
<div class="tab" data-title="CLI">

```sh
om test/ config update --set rootless_users=webapp
```

</div>
<div class="tab" data-title="API">

```sh
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'set=rootless_users=webapp' \
  "https://<node>:1215/api/object/path/test/nscfg/namespace/config"
```

</div>
</div>

* `rootless_users` lists accounts by name or uid. An allowed account's
  primary group is allowed too.
* `rootless_groups` lists any other group a container may run as, through
  `rootless_group`. A group reaches every file it owns, so a group like
  `docker` or `disk` reaches the node itself.
* The root account and the root group are never allowed.

A namespace admin setting `rootless_user` or `rootless_group` to anything
else is refused. The check reads the value as it evaluates, through
references and on each node:

```
[403] denied: container#0 runs as daemon on n1: the test namespace does not allow rootless_user daemon (uid 1): it allows webapp
```

Root is not bound by the list. A container running as an account its
namespace does not allow shows the reason as a status warning. That happens
when root set it up, or when the squatter removed the account afterwards.

Allowing one account in two namespaces lets each reach the other's
containers. That is allowed but warned about, both in the daemon log when the
namespace config is written and in the status of every container running as
that account. Give each namespace an account of its own.

## Configuring a rootless container

Set `rootless_user` on the container. `rootless_group` replaces the user's
primary group when needed. Leaving `rootless_user` unset runs the container
as root, which is the default.

```ini
[DEFAULT]
nodes = n1 n2

[container#0]
type = podman
image = ghcr.io/opensvc/pause
rm = true
netns = none
rootless_user = webapp

[container#1]
type = podman
image = docker.io/library/nginx:latest
rm = true
netns = container#0
rootless_user = webapp
pg_mem_limit = 256m
pg_cpu_quota = 50%
volume_mounts = web-vol-1/html:/usr/share/nginx/html:ro

[ip#0]
type = netns
netns = container#0
network = backend

[volume#1]
pool = shm
size = 1m
install = /html/index.html from ./cfg/web key index.html mode 0640 user {container#1.uid.101} group {container#1.gid.101}
```

All the containers of a pod run as the same user: a container joining another
one's network namespace has to be able to enter it.

A `task.podman` takes the same `rootless_user` and `rootless_group` keywords,
with the same requirements.

Create the object as usual:

<div class="tabs">
<div class="tab" data-title="CLI">

```sh
om test/svc/web create --config web.conf
om test/svc/web start
```

</div>
<div class="tab" data-title="API">

```sh
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/octet-stream" --data-binary @web.conf \
  "https://<node>:1215/api/object/path/test/svc/web/config/file"
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/object/path/test/svc/web/action/start"
```

</div>
</div>

## Files the container reads

A process of the container reads files as its own ids, and those map to other
ids on the host. nginx runs as uid 101 in its image, which is not uid 101 on
the host but a subordinate id of `webapp`. A file installed for it must be
owned by that host id, or nginx cannot read it.

The `{<rid>.uid.<id>}` and `{<rid>.gid.<id>}` references answer the host id
that a container id runs as. `{<rid>.uid}` alone is the container's root,
which is the user itself:

| Reference | Rootless, `webapp` = 1001, subuid `200000:65536` | Rootful |
| :--- | :--- | :--- |
| `{container#1.uid}` | `1001` | `0` |
| `{container#1.uid.101}` | `200100` | `101` |

The references answer the right ids in either mode. An `install` that names
its owners by reference therefore keeps working when the container switches
between rootful and rootless. A container given a `userns` mapping answers no
id, because podman makes that mapping only when the container starts.

The directories on the way to a mounted file must also let the user through.
A `pool.shm` volume head is `700` by default, which only root can enter. Give
the pool, or the volume's `fs` resource, a `mode` that lets the user in, such
as `711`.

## Looking inside

The containers are in the user's store, so podman shows them only when it
runs as the user:

```sh
sudo -u webapp XDG_RUNTIME_DIR=/run/user/$(id -u webapp) podman ps
```

The caps the agent applied are in the user's tree:

```sh
cat /sys/fs/cgroup/user.slice/user-1001.slice/user@1001.service/opensvc.slice/*/*container.1.slice/cpu.max
50000 100000
```

> ➡️ See Also
> * [Resource Capping](apps.design.pg.md)
> * [Namespaces](apps.design.namespaces.md)
> * [References](apps.design.references.md)
