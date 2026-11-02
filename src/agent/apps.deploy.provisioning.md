<!-- llms: How the resources of an object are provisioned and unprovisioned: provisioners, shared resources, and resources provisioned by hand. -->
# Provisioning

Creating an object writes a configuration. It does not create anything the
configuration describes. Provisioning is the step that does: allocate the
disks, create the volume group and its logical volumes, format the
filesystems, plumb the ip address, pull the container image.

The reverse, unprovisioning, destroys them again. That distinction matters:
deleting an object removes its configuration, unprovisioning destroys its
data.

> The **API** tabs assume the `$TOKEN` and the listener endpoint set up in
> [Cluster API](configure.api.md). An object is addressed by the three
> segments of its path, so `myapp` is `/api/object/path/root/svc/myapp`.

## Provisioners

A resource driver may implement a provisioner, and most of the drivers that
represent something allocatable do: the `disk`, `fs`, `ip`, `volume`,
`container`, `share` and `app` families.

A provisioner often needs keywords the resource does not need in order to run,
such as a size or a pool. Those are listed with the driver in the keyword
reference.

A provisioner may also write back into the configuration. Most ip provisioners
set the resource's `ipname` once they know the address they obtained.

## Provisioning an object

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om myapp provision
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/object/path/root/svc/myapp/action/provision"
```

</div>
</div>

This is orchestrated. The daemon provisions the placement leader first and
leaves the instance `up`, so that later provisioners can rely on what the
earlier ones produced: a disk must stay attached for a filesystem provisioner
to format it. Once the leader is provisioned, the other instances are
provisioned in parallel and rolled back, leaving the object in its optimal
state.

`om myapp deploy` does the same in one step, creating the object and
provisioning it.

To act on the local instance only, without involving the daemon:

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om myapp instance provision --leader
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/instance/path/root/svc/myapp/action/provision?leader=true"
```

</div>
</div>

The provisioners run in the resource start order.

`--leader` matters here. Driving this by hand, you are telling the agent which
node provisions the resources that only one node may provision. Without
it, the local instance is treated as a follower: its own resources are
provisioned and the shared ones are silently skipped. Pass `--leader` on the
node that should own them, and omit it on the others.

The orchestrated `om myapp provision` above works this out for you, which is
the reason to prefer it whenever the daemon is available.

## Shared resources

A SAN disk visible from several nodes, or the filesystem on it, must be
provisioned once, not once per node. Flag those resources:

```ini
[disk#1]
type = vg
name = datavg
shared = true
```

The provisioned state of a shared resource is synchronized across the object's
nodes. The state of a non-shared resource is node-affine, and each node
provisions its own.

Which node provisions them is the leader question above: the orchestrator
picks the placement leader, and a manual provision needs `--leader` to say so.

## Resources you provisioned yourself

Resources that already existed when the object was created are reported as not
provisioned, which `om mon` marks with a `P`.

Successfully starting such a resource marks it provisioned: if it starts, it
is sane to consider it provisioned. When starting it is not possible or not
wanted, flag it without touching the system:

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om myapp instance provision --state-only --rid disk#1
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/instance/path/root/svc/myapp/action/provision?state_only=true&rid=disk%231"
```

</div>
</div>

This only sets the flag. Nothing is formatted, allocated or created. The flag
matters because unprovision skips resources that were never provisioned, so an
unflagged resource survives an unprovision that should have destroyed it.

## Unprovisioning

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om myapp unprovision
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/object/path/root/svc/myapp/action/unprovision"
```

</div>
</div>

This destroys the resources, and it is the dangerous half of the pair. Shared
resources are unprovisioned once, by the leader, in reverse order.

> ➡️ See Also
> * [Create, Deploy](apps.deploy.create.md)
> * [Purge, Delete](apps.deploy.delete.md)
