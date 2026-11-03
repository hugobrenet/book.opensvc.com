<!-- llms: References, the markers a keyword value carries and evaluation replaces: within a configuration or a section, hard coded, capacity, arithmetic and env. -->
# References

A reference is a marker in the value of a configuration keyword, replaced during evaluation.

A reference is formatted as `{<expression>}`.

References can be used to:

* Abstract changing parts of a configuration, so this configuration can be used as a template
  Example: The object name, object id, the devices that hosts the data

* Factorize information, so changing it is easier and safer
  Example: A project name used to format the name of different resources (volume group, filesystem path, ...)

* Contextualize part of a configuration with information known to the agent
  Example: The cluster nodes, cluster dns ip addresses, ...

## Intra-Configuration References

The reference format is `{[<section>.]<option>}`, where

* `<section>` is a configuration file section name
* `<option>` is the option name in the pointed section.

If `<section>` is omitted, the referencing keyword's section is implicitly used if the reference can be found locally, or the `DEFAULT` section is implicitly used.

## Intra-Section References

These references can be used inside a configuration section, and their evaluated value depends on the section.

| Reference     | Description                                                               | Node Configuration File | Service Configuration File |
|---------------|---------------------------------------------------------------------------|-------------------------|----------------------------|
| `{rid}`       | The name of the section the reference is under                            | No                      | Yes                        |
| `{rindex}`    | The part after the dash of the name of the section the reference is under | No                      | Yes                        |
| `{<keyword>}` | Reference to another keyword's value inside the same section              | Yes                     | Yes                        |

## Hard Coded References

| Reference                   | Description                                                                                                                                                                             | Node Configuration File | Service Configuration File |
|-----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------|----------------------------|
| `{nodename}`                | The running node fqdn                                                                                                                                                                   | Yes                     | Yes                        |
| `{short_nodename}`          | The running node base name (without domain)                                                                                                                                             | Yes                     | Yes                        |
| `{#nodes}`                  | Number of nodes                                                                                                                                                                         | No                      | Yes                        |
| `{namespace}`               | The name of the hosting namespace                                                                                                                                                       | No                      | Yes                        |
| `{kind}`                    | The object kind, ie "svc", "vol", "sec", "cfg", "ccfg"                                                                                                                                  | No                      | Yes                        |
| `{name}`                    | The object name                                                                                                                                                                         | No                      | Yes                        |
| `{path}`                    | The object path, ie `<namespace>/<kind>/<name>`                                                                                                                                         | No                      | Yes                        |
| `{short_name}`              | The object base name (name with domain suffix stripped)                                                                                                                                 | No                      | Yes                        |
| `{fqdn}`                    | The object fully qualified name, as registered in the cluster DNS, ie `<name>.<namespace>.<kind>.<clustername>`                                                                         | No                      | Yes                        |
| `{scaler_name}`             | The scaler name (because `{name}` resolves to the slice name)                                                                                                                           | No                      | Yes                        |
| `{scaler_short_name}`       | The scaler base name (name with domain suffix stripped)                                                                                                                                 | No                      | Yes                        |
| `{id}`                      | The object id                                                                                                                                                                           | No                      | Yes                        |
| `{safe://<id>}`             | Substitute the reference with the content of the safe file identified by `<id>`. Usually passwords or private keys. The content is cached locally so the collector dependency is loose. | Yes                     | Yes                        |
| `{clustername}`             | The `cluster.name` node keyword value                                                                                                                                                   | Yes                     | Yes                        |
| `{clusterid}`               | The `cluster.id` node keyword value                                                                                                                                                     | Yes                     | Yes                        |
| `{clusternodes}`            | The `cluster.nodes` node keyword value                                                                                                                                                  | Yes                     | Yes                        |
| `{clusterdrpnodes}`         | The `cluster.drpnodes` node keyword value                                                                                                                                               | Yes                     | Yes                        |
| `{dns}`                     | The `cluster.dns` node keyword value (ip adressses)                                                                                                                                     | Yes                     | Yes                        |
| `{dnsnodes}`                | The `cluster.dns` node keyword value (resolved names)                                                                                                                                   | Yes                     | Yes                        |
| `{dnsuxsock}`               | The path to the dns thread unix socket                                                                                                                                                  | Yes                     | Yes                        |
| `{dnsuxsockd}`              | The path to the directory hosting the dns thread unix socket                                                                                                                            | Yes                     | Yes                        |
| `{collector_api}`           | The uri of the collector Rest API                                                                                                                                                       | Yes                     | Yes                        |
| `{nodemgr}`                 | The om node command, ie `/usr/bin/om node`                                                                                                                                               | Yes                     | Yes                        |
| `{svcmgr}`                  | The om svc command, ie `/usr/bin/om svc`                                                                                                                                                 | Yes                     | Yes                        |
| `{etc}`                     | The agent `etc/` directory path: `/etc/opensvc/` for agents installed through the packages, `/opt/opensvc/etc/` for an agent installed via git pull in `/opt`                           | Yes                     | Yes                        |
| `{var}`                     | The agent var/ directory path `/var/lib/opensvc/` for agents installed through the packages, `/opt/opensvc/var/` for an agent installed via git pull in `/opt`                          | Yes                     | Yes                        |
| `{initd}`                   | The object init directory path. ex: `/etc/opensvc/etc/<name>.d`                                                                                                                         | Yes                     | Yes                        |
| `{private_var}`             | The object private directory under `{var}`                                                                                                                                              | Yes                     | Yes                        |
| `{<rid>.exposed_devs}`      | The whitespace-separated list of devpaths exposed by `<rid>`                                                                                                                            | No                      | Yes                        |
| `{<rid>.exposed_devs[<n>]}` | The `<n>`-th element of the list of devpaths exposed by `<rid>`                                                                                                                           | No                      | Yes                        |
| `{<rid>.exposed_devs[#]}`   | The length of the list of devpaths exposed by `<rid>`                                                                                                                                   | No                      | Yes                        |
| `{<rid>.capacity}`          | How big `<rid>` is now, in bytes, asked of the resource itself                                                                                                                          | No                      | Yes                        |

Deprecated references:

| Reference         | Description                  | Node Configuration File | Service Configuration File |
|-------------------|------------------------------|-------------------------|----------------------------|
| `{svcname}`       | Deprecated by `{name}`       | No                      | Yes                        |
| `{svcpath}`       | Deprecated by `{path}`       | No                      | Yes                        |
| `{short_svcname}` | Deprecated by `{short_name}` | No                      | Yes                        |

## Capacity

`{<rid>.capacity}` is how big a resource is, asked of the resource. It is not
that resource's `size` keyword: the keyword says what the resource was asked
to be, and the capacity says what it holds now. The two differ wherever a
driver rounds, keeps metadata of its own, or has been grown since.

A resource answers it if it can say how big it is: volume groups, zpools, md
arrays, logical volumes, zvols, loop and rados disks, and the filesystems that
hold their own size.

It is resolved when the resource exists. A reference to a resource of the same
object that is configured but not built yet waits for it to be built, which is
what lets a configuration naming one validate before anything is provisioned.

## Arithmetic

A reference can be computed on. An expression is written `$(...)`, and what it
computes replaces it:

```ini
[disk#1]
type = lv
vg = {disk#vg.name}
size = $(50% * {disk#vg.capacity})
```

The references are resolved first, so what the arithmetic reads is numbers.

| Operator | Meaning                | Example      | Result |
| :--- | :--- | :--- | :--- |
| `+` `-` | sum and difference     | `$(10g - 1g)`  | 9663676416 |
| `*` | product                | `$(2 * 512m)`  | 1073741824 |
| `/` | division               | `$(10g / 2)`   | 5368709120 |
| `//` | division, whole part   | `$(5 // 2)`    | 2 |
| `%` | what a division leaves | `$(5 % 2)`     | 1 |
| `<n>%` | a share of something   | `$(50% * 10g)` | 5368709120 |

Numbers are written the way every other size in a configuration is written, so
`10g`, `10GB` and `1ki` are numbers here. Parentheses group, and a leading `-`
negates.

A percent sign means one of two things, told apart by what follows it. A
number follows a remainder, and an operator or the end of the expression
follows a share, so `9 % 4` is 1 and `50% * 10g` is half of ten gibibytes.
The spaces around the sign make no difference.

The result is a whole number: a half of an odd number of bytes is one of them
or the other, not an error. The drivers round it again to what their storage
takes, so a filesystem asked for a third of a volume group lands on the
nearest extent below it.

**Arithmetic is computed only on keywords that convert to a number** — a size,
an integer. `$(...)` is also how a shell substitutes a command, and keywords
hold shell commands, so a trigger or the start of an app keeps what it was
written with:

```ini
[app#1]
type = forking
start = /bin/echo $(date +%s)   # a command, left alone

[disk#0]
type = loop
size = $(2 * 512m)              # a size, computed
```

## References and `env` Section

The `env` section can be used to store arbitrary factorized information to make available as references in other parts of the configuration.

Example:

```ini
[disk#0]
name = {id}
pvs = {env.devs}

[env]
devs = /dev/vdb
```

These values can be overridden when creating a new object from this configuration file or template.

```
om <path> create --config <template> --env devs=/dev/vdc
```