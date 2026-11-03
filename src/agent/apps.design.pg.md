<!-- llms: Resource capping: the slice an object runs in, and capping an object, a resource or a namespace, running or not. -->
# Resource Capping

A misbehaving application should not be able to take a node down with it. The
agent puts every object it starts in its own cgroup, and the `pg_*` keywords
turn that into a limit.

## The slice an object runs in

Starting an instance builds a hierarchy under `opensvc.slice`, one level per
scope:

    opensvc.slice
    └ opensvc-ns.<namespace>.slice
      └ opensvc-ns.<namespace>-svc.<name>.slice
        └ opensvc-ns.<namespace>-svc.<name>-app.1.slice

A resource's processes live in its own leaf, inside its object, inside its
namespace. That nesting is what makes a limit set at any level apply to
everything below it.

## Capping an object

```ini
[DEFAULT]
pg_cpus = 0
pg_mem_limit = 256m
```

Starting the instance logs what it applied:

    INF myapp: applied pg /opensvc.slice/...-svc.myapp.slice: cpus=0 mem_limit=256m
    INF myapp: app#1: run: om exec --pg /opensvc.slice/...-svc.myapp-app.1.slice -- ...

And the kernel agrees:

```bash
$ cat /sys/fs/cgroup/opensvc.slice/.../opensvc-svc.myapp.slice/memory.max
268435456
$ cat /sys/fs/cgroup/opensvc.slice/.../opensvc-svc.myapp.slice/cpuset.cpus
0
```

The keywords are the usual cgroup controls:

| Keyword | Caps |
| :--- | :--- |
| `pg_cpus` | the cpus the object may run on, as a list or range: `0,1,2` or `0-2` |
| `pg_mems` | the memory nodes it may allocate from, same syntax |
| `pg_cpu_shares` | its share of cpu **when the node is cpu-bound**, relative to other objects |
| `pg_cpu_quota` | its cpu time whether or not the node is busy: `50%` is half of one cpu, `50%@all` half of every cpu the node has, `10%@2` a tenth of two |
| `pg_cpu_burst` | cpu time banked while under the quota and spent above it in a short spike, in the `pg_cpu_quota` notation. It cannot exceed the quota. Unified hierarchy only |
| `pg_mem_limit` | resident memory, in bytes. Exceeding it wakes the OOM killer |
| `pg_mem_high` | resident memory above which the kernel reclaims and throttles, without killing. Set it below `pg_mem_limit`. Unified hierarchy only |
| `pg_vmem_limit` | memory plus swap |
| `pg_pids_max` | processes and threads running at once. A fork beyond it fails |
| `pg_mem_oom_control` | `0` lets the OOM killer run, `1` freezes the group instead. v1 hierarchy only |
| `pg_mem_swappiness` | how readily its pages are swapped. v1 hierarchy only |
| `pg_blkio_weight` | its share of block io, between `10` and `1000` |

`pg_cpu_shares` and `pg_cpu_quota` are the pair worth telling apart: shares only
arbitrate a contended cpu, whereas a quota caps the group on an idle node too.

`pg_mem_high` and `pg_mem_limit` are the other pair: past the first, the group
runs slower while the kernel reclaims its memory, and past the second it is
killed. A memory claim counts `pg_mem_limit`, the one that bounds the group.

systemd has no property for the cpu burst, so it neither keeps it nor resets
it. The agent writes it every time it applies the caps, which is before each
container starts in the group.

The two marked *v1 hierarchy only* cap nothing on a node running the unified
hierarchy, which has neither `memory.swappiness` nor `memory.oom_control`.
Setting one there is warned about, and ignored.

## Capping a resource

The same keywords set on a resource cap that resource alone, which is how a
sidecar is kept from starving the process it assists:

```ini
[app#1]
type = simple
start = /opt/myapp/bin/server

[app#2]
type = simple
start = /opt/myapp/bin/indexer
pg_cpu_shares = 128
```

## Changing the caps of a running object

Editing the keywords changes the configuration, not the running instances: the
new caps apply at the next start. `cap` changes both at once. It sets the
keywords, then applies them to every instance running, on every node, without
a restart:

<div class="tabs">
<div class="tab" data-title="CLI">

```
om test/svc/myapp cap --set pg_cpu_quota=60% --set app#2.pg_cpu_shares=128
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/object/path/test/svc/myapp/action/cap?set=pg_cpu_quota%3D60%25&set=app%232.pg_cpu_shares%3D128"
```

</div>
</div>

A `--set` names a keyword of the object, as `pg_cpu_quota=60%`, or of a
subset or a resource, as `app#2.pg_cpu_shares=128`, and takes a
[scope](apps.design.scoping.md) as any keyword does:
`pg_cpu_quota@node2=60%`. Only the `pg_*` keywords are accepted, and only
with `=`. The command help lists them, and `om <path> config doc --kw
pg_cpu_quota` prints the full text of one.

`cap` needs the admin grant on the namespace of the object. The caps are
checked as any configuration change is: a value the keyword does not take, a
keyword the rbac policy does not grant, or a cap beyond the [compute
claims](apps.design.namespaces.md#compute-claims) of the namespace is refused,
and nothing is written.

`cap` is an orchestration, so it is refused while another one is in progress
on the object, and nothing is written then either. Like the other
orchestrations, it returns once the daemon queues it, and `--wait` holds it
until every node has applied the caps. An instance not running has nothing to
apply them to, and gets them when it starts.

With no `--set`, `cap` applies the caps the configuration already holds, which
puts back a cap lifted or changed by hand:

<div class="tabs">
<div class="tab" data-title="CLI">

```
om test/svc/myapp cap
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/object/path/test/svc/myapp/action/cap"
```

</div>
</div>

The api answers the `orchestration_id` of the queued orchestration, which is
waited for as the [other actions'](apps.operate.action.md) are.

## Capping a namespace

An `nscfg` object holds the defaults of its namespace, the `pg_*` keywords among
them:

```bash
om test/nscfg/namespace create --kw pg_mem_limit=4g
```

Every object in `test` is then capped by it, no matter who created it, which is
how a namespace is handed to a team without handing them the node.

A [rootless container](apps.design.rootless.md) is the exception. It runs in
the cgroup tree of its user, outside `opensvc.slice`, and the namespace and
node caps are not copied there. To bound what a namespace takes wherever its
containers run, use [compute claims](apps.design.namespaces.md#compute-claims),
which count the caps of the objects.

## Caps that systemd keeps

podman asks systemd to start the group of a container, and systemd writes a
slice's cgroup files from the unit properties whenever it starts that slice.
A cap written only to the files would be reset to "no cap" the next time a
container started. So the agent also sets the caps as runtime properties of
the slice, on the system manager, or on the user's manager for a rootless
container:

```bash
$ systemctl show -p CPUQuotaPerSecUSec,MemoryMax 'opensvc-svc.myapp.slice'
CPUQuotaPerSecUSec=500ms
MemoryMax=268435456
```

They are runtime properties: they are lost at reboot, and the next start
applies them again from the configuration.

## Rootless containers

The `pg_*` keywords of a rootless container, and those of its object and
subset, cap groups the agent makes in the tree systemd delegates to the user:

    user.slice/user-<uid>.slice/user@<uid>.service
    └ opensvc.slice
      └ opensvc-svc.<name>.slice
        └ opensvc-svc.<name>-container.1.slice

The cap files stay owned by root, so the user cannot lift them. A cap whose
controller the user's tree is not delegated is reported as not applied. By
default that is `pg_cpus`, `pg_mems` and `pg_blkio_weight`. See [Rootless
Containers](apps.design.rootless.md#delegating-more-controllers) for how to
delegate them.

## Lifting a capping

Removing a `pg_*` keyword does not lift what it capped. What was written stays
written, because the agent has no way of telling a capping it wrote from one
systemd or an operator wrote, and silently undoing the second would be worse
than leaving the first.

So lifting a capping is asked for, and there are two ways of asking.

The keyword set to `default` puts that one capping back where a node that never
capped anything leaves it:

```ini
[DEFAULT]
pg_cpu_quota = default
```

This is the one to reach for. It is the configuration, so every node converges
to it: a peer taking the object over, or a node provisioned tomorrow, lifts the
capping too. `om test/svc/myapp cap --set pg_cpu_quota=default` writes it and
lifts the capping on the running instances at once.

The command lifts every capping of an instance at once, whatever the keywords
say:

```bash
om test/svc/myapp instance pg reset
```

That one is for a capping the configuration knows nothing about — left by an
older agent, by systemd, or by hand. It is not a lasting decision: a capping
the keywords do name comes back at the next `pg update`, and at the next start.

## Turning it off

```ini
[DEFAULT]
create_pg = false
```

Grouping is on by default. Turning it off leaves the processes ungrouped and
uncapped, and is worth doing only where the cgroup itself causes the problem.

> ➡️ See Also
> * [Namespaces](apps.design.namespaces.md)
> * [Rootless Containers](apps.design.rootless.md)
