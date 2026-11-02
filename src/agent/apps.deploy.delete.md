<!-- llms: How to remove an object: a purge stops, unprovisions and deletes it on every node; a delete removes its configuration only. -->
# Purge, Delete

> The **API** tabs assume the `$TOKEN` and the listener endpoint set up in
> [Cluster API](configure.api.md). An object is addressed by the three
> segments of its path, so `svc1` is `/api/object/path/root/svc/svc1`.

## Purge

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> purge
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/object/path/<ns>/<kind>/<name>/action/purge"
```

</div>
</div>

This command asks the cluster to orchestrate a stop, unprovision and delete. Non-leader instances are sequenced first.

Purging a service does not purge its referenced volumes.

Purging a volume actually removes all volume data.

The api answers the `orchestration_id` of the queued orchestration. See
[Follow an Action](apps.operate.sessions.md) for waiting on it.

## Delete

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> delete
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/object/path/<ns>/<kind>/<name>/action/delete"
```

</div>
</div>

This command does not stop nor unprovision the object, so it can leave unreferenced mounts, containers and processes on the nodes.

This command should be used by administrators only.
