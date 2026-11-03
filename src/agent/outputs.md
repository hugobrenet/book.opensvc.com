<!-- llms: The output formats of the om query commands: human-readable, custom tables, machine-readable, flat key-values and templates. -->
# Outputs

The `om` query commands display the data using a human-readable renderer by default. The `-o` command flag can be used to select another renderer.

```
$ om svc resource list
OBJECT      NODE    RID     TYPE       STATUS  IS_MONITORED  IS_DISABLED  IS_STANDBY  RESTART  RESTART_REMAINING  
stonith8    dev2n2  fs#1    fs.flag    down    false         false        false       0        0                  
testsched   dev2n2  fs#1    fs.flag    down    true          false        false       0        0                  
testsched   dev2n2  task#1  task.host  n/a     false         false        false       0        0                  
...
```

## Custom tables

**Custom column selection, with header**

```
$ om svc resource ls -o tab=OBJ:.meta.object,NODE:.meta.node,RID:.meta.rid,STATUS:.data.status.status
OBJ         NODE    RID     STATUS       
cva1        dev2n2  fs#1    down        
cva1        dev2n2  sync#1  n/a         
testflex    dev2n2  fs#1    down        
stonith236  dev2n2  fs#1    down        
...
```

**Add a column to the default table**

A `+` prefix extends the command's own columns instead of replacing them,
which saves respelling a table just to see one more field.

```
$ om svc resource ls -o +PROV:data.status.provisioned.state
OBJECT  NODE    RID     ...  RESTART_REMAINING  PROV
cva1    dev2n1  sync#1  ...                     true
cva1    dev2n1  fs#1    ...                     true
...
```

**Single column selection, without header**

```
$ om svc resource ls -o tab=.meta.rid
fs#1
sync#1
fs#1
fs#1
...
```

## Machine-readable

```
$ om svc resource ls -o json
{
    "items": [
        {
            "data": {
                "config": {
                    "is_disabled": false,
                    "is_monitored": false,
                    "is_standby": false,
                    "restart": 0,
                    "restart_delay": 500000000
...
```

```
$ om svc resource ls -o yaml
items:
- data:
    config:
      is_disabled: false
      is_monitored: false
      is_standby: false
      restart: 0
      restart_delay: 500000000
    monitor:
      restart:

```

Add `-o jsonline` for the same json unindented on a single line, which suits
line-oriented tooling.

## Flat key-value

The `flat` renderer prints the same data as `json`, one leaf per line, as the
jsonpath of the value and the value. It is the format to reach for when
grepping for a field, or when you want the path to pass to `-o tab=`.

```
$ om svc resource ls -o flat
items[0].data.config.is_disabled = false
items[0].data.config.is_monitored = false
items[0].data.config.is_standby = false
items[0].data.config.restart_delay = 500000000
items[0].data.status.label = "flag /dev/shm/opensvc/test/svc/svc1/fs#0.flag"
items[0].data.status.provisioned.mtime = "2026-06-04T22:20:43.238087911+02:00"
items[0].data.status.provisioned.state = "true"
items[0].data.status.status = "down"
items[0].data.status.type = "fs.flag"
items[0].kind = "ResourceItem"
items[0].meta.node = "dev2n1"
...
```

## Template

This output uses the golang template syntax, with the following extra functions:

| Function                  | Result        |
| :---                      | :---          |
| `drvName "ip.host"`       | `"host"`      |
| `drvGroup "ip.host"`      | `"ip"`        |
| `resName "container#db"`  | `"db"`        |
| `resGroup "container#db"` | `"container"` |
| `objKind "svc1"`          | `"svc"`       |
| `objName "svc1"`          | `"svc1"`      |
| `objNamespace "svc1"`     | `"root"`      |
| `hasPrefix "foo" "f"`     | `true`        |
| `hasSuffix "foo" "o"`     | `true`        |
| `contains [a b] a`        | `true`        |
| `reMatch "f.*" "foo"`     | `true`        |
| `fnMatch "f*" "foo"`      | `true`        |

Example:
```
$ om svc resource ls -o template='{{range .}}{{if eq (resName .meta.rid) "hdoc"}}{{printf "%s@%s\n" .meta.object .meta.node}}{{end}}{{end}}'
test/svc/hdoc@dev2n2
test/svc/hdoc@dev2n3
test/svc/hdoc@dev2n1
```
