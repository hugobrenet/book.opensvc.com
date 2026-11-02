<!-- llms: How to create an object: from scratch, from another object, or from a manifest, and what a clone resets. -->
# Create, Deploy

The following actions only modify files in `/etc/opensvc`. No operating system configuration file is modified, so they are safe to experiment with.

The agent support object creation via two commands:

* ``create``
  The object is created but not provisioned nor started.

* ``deploy``
  The object is created, provisioned and started.

Both actions support the same arguments. The following examples use only create commands.

> The **API** tabs assume the `$TOKEN` and the listener endpoint set up in
> [Cluster API](configure.api.md). Creating an object through the api is
> posting its configuration file: `POST …/config/file` creates the object,
> `PUT …/config/file` replaces the configuration of an object that already
> exists, and both answer the `OM-Last-Modified` timestamp the written
> configuration now carries.

## From Scratch, non Interactive

Create a new object with minimal configuration. No resources are described.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> create
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/octet-stream" \
  --data-binary '[DEFAULT]' \
  "https://<node>:1215/api/object/path/<ns>/<kind>/<name>/config/file"
```

</div>
</div>

Resources and default keywords can be set right from the create command, using ``--kw <keyword>=<value>`` options

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> create \
	--kw container#0.type=oci \
	--kw orchestrate=ha \
	--kw nodes={clusternodes}
```

</div>
<div class="tab" data-title="API">

```
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/octet-stream" \
  --data-binary $'[DEFAULT]\norchestrate = ha\nnodes = {clusternodes}\n\n[container#0]\ntype = oci\n' \
  "https://<node>:1215/api/object/path/<ns>/<kind>/<name>/config/file"
```

</div>
</div>

Scripts should describe the object as completely as possible in this single command. The keywords given to ``create`` are part of the first and only commit, so the object is never announced to the cluster in a half-configured state. Creating a bare object then completing it with a series of ``config update`` commands publishes every intermediate state to the peers, and the orchestrator acts on them as soon as ``orchestrate`` is set.

The api has the same property: one `POST …/config/file` carrying the whole
configuration is one commit, where a bare create followed by `PATCH …/config`
calls is several.

## From Another Object

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <dst path> create --config=<src path>
```

</div>
<div class="tab" data-title="API">

```
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/object/path/<ns>/<kind>/<src name>/config/file" |
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/octet-stream" --data-binary @- \
  "https://<node>:1215/api/object/path/<ns>/<kind>/<dst name>/config/file"
```

</div>
</div>

> The api writes the configuration it is given, as given. The reset of the
> recorded keywords described below is the client's work, so a clone driven
> straight through the api has to drop them from the body itself.

## From Manifest

The manifest must be ini formatted, like the output of ``om <path> config show``.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om <path> create --config=<manifest uri>
```

</div>
<div class="tab" data-title="API">

```
curl -s <manifest uri> |
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/octet-stream" --data-binary @- \
  "https://<node>:1215/api/object/path/<ns>/<kind>/<name>/config/file"
```

</div>
</div>

This method can also be used to clone objects

```
om <dst path> create --config=<src path>
```

or

```
om <src path> config show | om <dst path> create --config=-
```

## What a Clone Resets

A clone is another object, so what the source recorded of itself does not come
with it. Those keywords are marked in the keyword reference:

```
recorded:    written when what it names is made, and reset when the object is cloned
```

The object id is one of them, and the clone is given a new one. The uuid of an
md array is another: it is written when the array is created, and is what
assembles that array again afterwards, so a clone keeping it would assemble
the source's array rather than create one of its own.

They are written again, for the clone, when the clone makes what they name.

`--restore` keeps them, which is what restoring a saved configuration means:
the object being created is the one the configuration was saved from, not
another like it.

```
om <path> create --config=<backup> --restore
```

> ➡️ See Also
> * [Provisioning](apps.deploy.provisioning.md)
> * [Batching configuration changes](apps.deploy.update.md#batching)
