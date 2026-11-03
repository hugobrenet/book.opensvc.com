<!-- llms: How to read the state of the cluster and its services: om mon and its status and alert markers, the machine-readable outputs, and the ox terminal UI. -->
# Services Status

> The **API** tabs assume the `$TOKEN` and the listener endpoint set up in
> [Cluster API](configure.api.md).

## Cluster Overview (`om mon`)

The `om mon` command provides a real-time, human-readable overview of the cluster and service states.

### Human Readable

```bash
om monitor
```

> **Requirements:**
>
>   * The agent daemon must be **up and running**.
>   * The displayed information is **near synchronous**.

### Status and Alert Markers

Markers are used to optimize information density.

| Heartbeat Markers | On `hb.tx` Target | On `hb.rx` Source |
| :--- | :--- | :--- |
| **`O`** | Data has been sent in time | Data has been received in time |
| **`X`** | Data has not been sent in time | Data has not been received in time |
| **`/`** | Not applicable | Not applicable |

| General Markers | On Service Instance | On Service | On Node Status |
| :--- | :--- | :--- | :--- |
| **`O`** | `up` | | |
| **`o`** | `standby up` instance | | |
| **`X`** | `down` instance or heartbeat failure | | |
| **`x`** | `standby down` instance | | |
| **`/`** | Not applicable, undefined | | |
| **`^`** | Placement leader | Placement alert | |
| **`!`** | Warning | Warning raised by any instance | |
| **`!!`** | Not fully available instance | | |
| **`*`** | Frozen instance | | Frozen node |
| **`P`** | Not fully provisioned instance | | |

### Machine Readable

Use the `--output` option for structured data output.

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om cluster status --output json
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/cluster/status"
```

</div>
</div>

### Watch

Continuously refresh the status display. The api counterpart is the event
stream the display is fed by: a `text/event-stream` the daemon keeps open,
which the `filter` and `selector` query parameters narrow.

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om monitor --watch
```

</div>
<div class="tab" data-title="API">

```bash
curl -sN -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/daemon/event"
```

</div>
</div>

## Interactive (`ox tui`)

`om monitor` prints and returns, or redraws with `--watch`. To move around the
cluster instead of reading it, the `ox` client carries a terminal interface:

```bash
ox tui
```

It shows the same data, and lets you select an object or an instance and act on
it without leaving the view, which suits watching a service move between nodes
while you drive it.

`ox` is the client command. It talks to the API rather than the local node, so
the same session can watch a remote cluster:

```bash
ox tui --server https://mycluster.example.com:1215
```

### Contexts

On an admin station watching several clusters, passing the server on every
command gets old, and says nothing about who you are. A context bundles an
endpoint, a user and an optional default namespace under a name, in
`~/.config/opensvc/contexts`.

Declare the cluster, the user, and the context tying them together:

```bash
ox context cluster add --name prod --server https://prod.example.com:1215
ox context user add --name alice --username alice   --client-certificate ~/.opensvc/alice.crt --client-key ~/.opensvc/alice.key
ox context add --name prod --cluster prod --user alice --namespace myapp
```

Then select it with `OSVC_CONTEXT`, and every `ox` command follows:

```bash
$ export OSVC_CONTEXT=prod
$ ox tui
$ ox '**' ls
```

Switching clusters is switching the variable, so two terminals can watch two
clusters at once without either forgetting who it is.

```bash
ox context list     # the configured contexts, and whether each is authenticated
ox context show     # the resolved endpoint, user and namespace
ox context login    # request and cache tokens
ox context logout   # drop them
```

> **Requirements:**
>
>   * `ox` is packaged in `opensvc-client`.
>   * The daemon must be reachable, and your user needs at least the `guest`
>     grant on what you want to see. See [Access Control](configure.rbac.md).

