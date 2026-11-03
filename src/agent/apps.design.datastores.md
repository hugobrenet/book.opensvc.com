<!-- llms: Configs and secrets: the data of an application kept in a datastore and installed where the application reads it, shared across namespaces or rendered from templates. -->
# Configs and Secrets

An application needs configuration files, certificates and credentials. Baking
them into the image ties the image to one environment. Leaving them on the
nodes means every node has to be prepared identically, by something that is
not the agent.

OpenSVC stores them in objects of their own, `cfg` for configuration and `sec`
for secrets, and installs them as files into a service's storage when it
starts. `sec` keys are encrypted at rest with the cluster secret.

## Put the data in a datastore

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om myapp/cfg/app create
om myapp/cfg/app key add --name app.conf --from /tmp/app.conf
om myapp/cfg/app key list
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/octet-stream" --data-binary '[DEFAULT]' \
  "https://<node>:1215/api/object/path/myapp/cfg/app/config/file"
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "[{\"action\": \"add\", \"name\": \"app.conf\", \"string\": $(jq -Rs . < /tmp/app.conf)}]" \
  "https://<node>:1215/api/object/path/myapp/cfg/app/data"
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/object/path/myapp/cfg/app/data/keys"
```

</div>
</div>

The api tab above uses the `$TOKEN` and the listener endpoint set up in
[Cluster API](configure.api.md). `PATCH …/data` applies a batch of `add`,
`change`, `remove` and `rename` operations as one transaction, and a binary
value goes in the `bytes` field, base64 encoded, rather than in `string`.

Secrets work the same way, with `om myapp/sec/creds`.

## Install it where the application will look

The `install` keyword tells a resource to lay keys down inside the storage it
manages, as files:

```ini
[fs#1]
type = directory
path = /var/tmp/myapp
install = /etc/app.conf from ./cfg/app key app.conf

[app#1]
type = simple
start = /opt/myapp/bin/start
```

Starting the instance shows the order this happens in:

    INF myapp: fs#1: create directory /var/tmp/myapp
    INF myapp: fs#1: create directory /var/tmp/myapp/etc to host key app.conf
    INF myapp: fs#1: install key app.conf from myapp/cfg/app to /var/tmp/myapp/etc/app.conf with owner : perm -rw-r--r--
    INF myapp: app#1: run: /opt/myapp/bin/start

The file is in place before the application is launched. That is the point:
the resource holding the storage prepares the dataset, and only then do the
resources that consume it start.

`./cfg/app` is a [relative object path](apps.design.namespaces.md#relative-object-paths),
so the same configuration works in whatever namespace it is cloned to.

## Which resources can install

Any resource that manages a directory the agent can write into, in other words
any driver exposing a head, accepts `install`:

* `volume`
* `fs` (`fs.directory`, the host filesystem drivers, `fs.zfs`)

Resources start in driver group order, and both of those groups start before
`container` and `app`. So a volume or filesystem is always able to stage data
for the containers and applications that follow it, and never the other way
round.

## Sharing across namespaces

A datastore serves its own namespace and no other. An object elsewhere naming
it is refused, and the whole start is rolled back:

    ERR consumer: fs#1: start: unauthorized install /etc/pw from prod/sec/shared key pw
    INF consumer: rollback

The `share` keyword on the datastore names the namespaces allowed to decode its
keys:

```ini
[DEFAULT]
share = prod staging
```

The same install then succeeds:

    INF consumer: fs#1: install key pw from prod/sec/shared to .../etc/pw with owner : perm -rw-------

This is what keeps one certificate, licence or database password in one place
instead of copied into every namespace that needs it. The copies are the
problem: they drift, and rotating the original leaves them behind.

`*` shares with every namespace. The default is the datastore's own namespace,
so sharing is always a deliberate act.

> **Note:** sharing lets another namespace *decode* the keys. Who may read the
> datastore object at all is a separate question, answered by
> [Access Control](configure.rbac.md).

## Beyond plain files

The `install` keyword takes more than a source and a destination:

```ini
install = /etc/app.conf from ./cfg/app key app.conf mode 0600 user app group app signal HUP:container#1
```

* `mode`, `user`, `group` set the installed file's permissions and ownership.
  Without them a `sec` key installs `0600` and a `cfg` key `0644`, so a secret
  is not left world-readable by omission.
* `signal` sends a signal to another resource's processes when the content
  changes, so a running daemon reloads its configuration instead of being
  restarted.
* `template` treats the key as a Go template, rendered on each node at each
  install. See [Templates](#templates) below.
* `source` seeds the key from a URI or a local file during provisioning, if it
  does not exist yet. A template is stored as it is written, and rendered at
  each install.
* `required` stops the install if that item fails, rather than continuing.

A trailing `/` on the destination, or omitting `from`, makes it a directory
rather than a file. A globbing pattern in `key` installs every matching key.

The full syntax is in the `install` keyword reference.

## Templates

A `template` line keeps the key as it is written, a Go template, and renders
it into the installed file on each node, at each install. One key then serves
every node and every object, each file saying what its node knows when it is
installed:

```ini
[fs#1]
type = tmpfs
mnt = /srv/{fqdn}
install = /app.conf from ./cfg/app key app.conf mode 0600 template
```

with the `app.conf` key of `cfg/app`:

```
listen = {{ref "nodename"}}:{{.port}}
peers = {{ref "clusternodes"}}
password = {{key "./sec/app" "password"}}
```

The data is the `[env]` section of the object: `{{.port}}` is the evaluated
value of `env.port`. The functions are:

* `ref "<reference>"`: the value of a [reference](apps.design.references.md),
  written without its braces, evaluated for this node, as `{{ref "nodename"}}`
  or `{{ref "volume#1.mnt"}}`.
* `split <string>`: the words of a string, as a list:
  `{{range split (ref "clusternodes")}}{{.}} {{end}}`.
* `key "<path>" "<key>"`: the content of a key of another datastore, which
  shares its keys with the namespace of the object. The file holds what the key
  holds, so a file rendering a sec key wants a `mode` as tight as the key's.
* `network "<name>"`, `networks`, `tunnels`: the networks of the node, and the
  peers a [routed bridge](configure.networks.md#routed-bridge) reaches, with
  their addresses and the tunnel to each. `tunnels` lists each tunnel once:
  `{{range tunnels}}{{.Nodename}} {{.Local}} {{.Remote}}{{end}}`.

A template reading a key that does not exist, an `[env]` value not set or a
reference not known fails to render, and its file is not written rather than
written with a hole.

### When a file is rendered again

* At each install: a start, a provision, or a task with `install`.
* When the template key changes, on each node.
* When a key the template read with `key` changes, on each node: a file
  rendered from a sec follows the sec. The keys read are recorded at each
  render, so this follows the first render on the node.

A file rendered the same as the one installed is left as it is, so the
`signal` of the line is sent when the content changes only.

### Telling what reads the files

An install that wrote files publishes a `FileInstalled` event, naming the
resource and the files, whatever ran it. An install finding its files up to
date publishes nothing. A task can run on it, to have what reads the files
read them again:

```ini
[task#reload]
type = host
container = container#app
command = app reload
on = FileInstalled,rid=fs#1
```

A file rendered from what the node knows, as the networks, is installed again
by a task running on the event telling it changed. Both tasks are described in
[Event-triggered Runs](internals.daemon.scheduler.md#event-triggered-runs), and
the [strongSwan Mesh](../howtos/strongswan.mesh.md) howto puts them together.

> ➡️ See Also
> * [Namespaces](apps.design.namespaces.md) for the relative path notation.
> * [Provisioning](apps.deploy.provisioning.md) for when `source` seeding runs.
> * [Events](internals.daemon.events.md) for the `FileInstalled` event.
