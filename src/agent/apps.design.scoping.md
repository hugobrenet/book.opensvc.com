<!-- llms: Scoping, a keyword value set for a node or a group of nodes: its syntax, the supported scopes, precedence and examples. -->
# Scoping

One configuration is shared by every node running the object. Scoping is how a
keyword takes a different value depending on which node reads it, so the nodes
stay described by a single file.

## Syntax

A scoped keyword is written as:

```
<keyword>@<scope> = <value>
```

### Supported Scopes

The value applies:

- `<nodename>`: on that node alone.
- `nodes`: on all the object's nodes.
- `drpnodes`: on all its disaster recovery nodes.
- `encapnodes`: on all its encapsulated nodes.

## Examples

### Use a Different FS Type on DRP Nodes

```ini
[DEFAULT]
nodes = n1 n2
drpnode = n3

[fs#1]
type = ext4
type@drpnodes = xfs
```

### Use a Different Nodes List at Encapsulated Level

```ini
[DEFAULT]
nodes = n1 n2
encapnodes = vm1
nodes@encapnodes = vm1
```

### Disable a Resource on a Node

```ini
[DEFAULT]
nodes = n1 n2
drpnodes = n3

[ip#backup]
disable@n3 = true
```

## Precedence

The most specific definition wins. A node reading a keyword takes the first of
these that it finds:

1. `<keyword>@<its own nodename>`
2. `<keyword>@nodes`, if it is one of the object's nodes
3. `<keyword>@drpnodes`, if it is one of its DRP nodes
4. `<keyword>@encapnodes`, if it is one of its encapsulated nodes
5. `<keyword>`, unscoped

Where two definitions have the same rank, the last one wins.

### Examples

```ini
[DEFAULT]
drpnodes = n3

[share#1]
disable = true
disable@drpnodes = false
```

This resource is enabled on `n3` because the generic `disable` is overridden by the more specific `disable@drpnodes` scoped definition.

```ini
[DEFAULT]
drpnodes = n3

[share#1]
disable = true
disable@drpnodes = false
disable@n3 = true
```

This resource is disabled on `n3` because the generic `disable` and `disable@drpnodes` are overridden by the more specific `disable@n3` scoped definition.

```ini
[DEFAULT]
drpnodes = n3

[share#1]
disable@n3 = true
disable@n3 = false
```

This resource is **enabled** on `n3`. Both definitions have the same rank, so
the last one wins, and the last one is `false`.
