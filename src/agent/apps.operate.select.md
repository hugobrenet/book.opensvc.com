<!-- llms: How to select the objects a command acts on: all objects, all services, one path, a list of paths or a pattern. -->
# Select Objects

Commands use the `om <selector> <action>` syntax to operate on a selection of objects.
The `om <selector> ls` command can test a selector before submitting a dangerous action.

> Note the selector expression may need to be **quoted** for the shell not to interpret the `!` and `*` characters.

> The **API** tabs assume the `$TOKEN` and the listener endpoint set up in
> [Cluster API](configure.api.md). The selector expression is the same on
> both sides: `GET /api/object/path?path=<selector>` answers the paths it
> matches, and `GET /api/object?path=<selector>` answers what `om ls`
> renders. The examples below show the cli form only where the point is the
> expression itself.

## All Objects

List all cluster objects (services, volumes, etc.).

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om '**' ls
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'path=**' \
  "https://<node>:1215/api/object/path"
```

</div>
</div>

## All Services

List all service objects.

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om '*' ls
om '*/svc/*' ls
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'path=*/svc/*' \
  "https://<node>:1215/api/object/path"
```

</div>
</div>

## Single Object

List a specific object.

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om <path> ls
om ns1/svc/web1 ls
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'path=ns1/svc/web1' \
  "https://<node>:1215/api/object/path"
```

</div>
</div>

## List of objects

With a `/tmp/svc.list` containing:
```bash
# Ignored object paths
; svc1
;svc2

# Ignored empty lines

# Honored object paths
# Leading and trailing whitespaces are trimmed
svc3
  svc4
```

An action can be executed using:
```bash
cat /tmp/svc.list | om - ls
```
or
```bash
om - ls </tmp/svc.list
```

The `template` output renderer of many `om` command can produce lists of object paths matching criteria.

```bash
# Start all objects in avail=down state
om svc ls -o 'template={{ range . }}{{ if ne .data.avail "up" }}{{println .meta.object}}{{ end }}{{ end }}' | om - start

# Freeze all objects not frozen
om svc ls -o 'template={{ range . }}{{ if ne .data.frozen "frozen" }}{{println .meta.object}}{{ end }}{{ end }}' | om - freeze

```



## Unions

List multiple specific objects.

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om <path1>,<path2> ls
om ns1/svc/web1,ns1/vol/web1 ls
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'path=ns1/svc/web1,ns1/vol/web1' \
  "https://<node>:1215/api/object/path"
```

</div>
</div>

## Intersections

List objects matching multiple criteria.

```bash
om 'ns1/*/web1+*/svc/*' ls
```
is equivallent to
```bash
om ns1/svc/web1 ls
```

## Mixing Unions and Intersections

The unioned expressions are evaluated from comma to comma, intersections are evaluated in the context of the current union.

For example,
```bash
om 'ns1/svc/*+ns1/*/web1,ns2/svc/web2'
```
is parsed as:
```
(ns1/svc/* intersected with ns1/*/web1) unioned with (ns2/svc/web2)
```

and evaluates as:
```bash
ns1/svc/web1
ns2/svc/web1
```

## Negation

The negation marker is `!`. This symbol needs quoting for the shell not to interpret it.

Example:
<div class="tabs">
<div class="tab" data-title="CLI">

```bash
# All object of namespace `ns1` except those named `web1`:
om 'ns1/**+!**/web1' ls
```

</div>
<div class="tab" data-title="API">

```bash
# All object of namespace `ns1` except those named `web1`:
curl -s -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'path=ns1/**+!**/web1' \
  "https://<node>:1215/api/object/path"
```

</div>
</div>

## Services by State

Filter services based on their overall status.

  * List all services in the **`down`** state:
    ```bash
    om '*' ls --status down
    ```
  * List all services in **`up`** and **`warn`** states:
    ```bash
    om '*' ls --status up,warn
    ```


The api has no `--status` filter. `GET /api/object?path=<selector>` carries
the availability of each object, and the client keeps the rows it wants.

## Service Selector Expressions

Use powerful expressions to filter objects based on configuration parameters.

```bash
om <expr> ls
```

Where `<expr>` is a pattern or condition, either a `<path glob pattern>` or
`[!]<param><op><value>`.

| Parameter (`<param>`) | Description |
| :--- | :--- |
| `<rid>.<key>` | A key within a specific resource ID in the service config. |
| `<group>.<key>` | A key within a driver group (e.g., `disk`, `fs`, `app`). |
| `<key>` | A key in the service configuration file header. |

| Operator (`<op>`) | Description |
| :--- | :--- |
| `<` `>` `<=` `>=` `=` | Standard comparison operators. |
| `:` | **Existence test** operator (value is empty). |
| `~` | **Regular expression** operator. |

| Separators / Modifiers | Description |
| :--- | :--- |
| `!` | **Negation** operator. |
| `+` | **AND** expression separator. |
| `,` | **OR** expression separator. |

> **Note:** Matching is **case-sensitive**, except for boolean values.

### Examples

1.  Services with name ending with `dns` OR starting with `ha`, **AND** which have an `app` resource with a `timeout` greater than 1:
    ```bash
    om '*dns,web*' config get -o 'template={{range .}}{{if and (hasPrefix .keyword "app#") (hasSuffix .keyword ".timeout") (ge .value 1)}}{{end}}'
    ```
2.  Services with at least one `ip` resource **AND** one `task` resource:
    ```bash
    om 'ip:+task:' ls
    # ha1, ha2, ha3, registry
    ```
3.  Services with at least one monitored resource **AND** with `monitor_schedule` not set:
    ```bash
    om '!monitor_schedule+.monitor=true' ls
    # ha1, ha4
    ```


