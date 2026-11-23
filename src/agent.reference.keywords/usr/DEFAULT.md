# Section `DEFAULT`

**Supported keywords:**

- alt_names
- app
- bits
- c
- ca
- cn
- comment
- drpnodes
- email
- env
- grant
- id
- l
- nodes
- o
- ou
- st
- uxuser
- validity

## Keyword `alt_names`

	required:    false
	scopable:    true
	group:       subject
	convert:     list

**Example:**

	alt_names=www.opensvc.com opensvc.com

**Description:**

Certificate Signing Request Alternative Domain Names.


## Keyword `app`

	required:    false
	scopable:    false
	group:       identity
	default:     default

**Description:**

A user-defined code linking to:

* who is responsible for this service.
* who is billable.

This code thus provides a most useful object grouping and filtering key.

Short and simple codes, like ERP, are easier to work with.


## Keyword `bits`

	required:    false
	scopable:    true
	group:       certificate
	default:     4kib
	convert:     size

**Example:**

	bits=8192

**Description:**

Certificate Private Key Length.


## Keyword `c`

	required:    false
	scopable:    true
	group:       subject

**Example:**

	c=FR

**Description:**

Certificate Signing Request Country.


## Keyword `ca`

	required:    false
	scopable:    true
	group:       certificate
	default:     system/sec/ca

**Example:**

	ca=ca

**Description:**

The name of the secret containing a certificate to use as a Certificate
Authority. This secret must be in the same namespace.

It defaults to the cluster certificate authority. The listener accepts a
client certificate signed by any authority of the cluster `ca` keyword, and
refuses one signed by anything else, so a certificate created with another
value here is not for the api.


## Keyword `cn`

	required:    false
	scopable:    true
	group:       subject
	default:     {name}

**Example:**

	cn=usr1

**Description:**

Certificate Signing Request Common Name.

The api reads this common name as the username of the client presenting the
certificate, and looks its grants up in the usr object of that name. It
defaults to the name of this object, which is what makes a generated
certificate authenticate as this user.


## Keyword `comment`

	required:    false
	scopable:    false
	group:       identity

**Description:**

A free form text describing the role of the object, of the node, or of the
section it is set in.

The keyword is accepted in any section, so the DEFAULT section can document a
configuration as a whole, and a resource, pool, heartbeat, array or network
section can document itself.

The agent does not interpret the value.


## Keyword `drpnodes`

	required:    false
	scopable:    true
	group:       nodes
	convert:     peers

**Example:**

	drpnodes=n1 n2

**Description:**

A node selector expression specifying the list of cluster nodes hosting
object instances when all primary `nodes` are unavailable, like in a
DRP situation.

If not specified or left empty, the node evaluating the keyword is
assumed to be the only instance hosting node.

Labels can be used to define a list of nodes by an arbitrary property.
For example `cn=fr cn=kr` would be evaluated as `n1 n2 n3` if `n1` and
`n2` have the `cn=fr` label and `n3` has the `cn=kr` label.

The glob syntax can be used in the node selector expression. For
example `n1 n[23] n4*` would be expanded to `n1 n2 n3 n4` in a
`n1 n2 n3 n4 n5` cluster.

The drpnodes can be data synchronization targets for `sync` resources.


## Keyword `email`

	required:    false
	scopable:    true
	group:       subject

**Example:**

	email=test@opensvc.com

**Description:**

Certificate Signing Request Email.


## Keyword `env`

	required:    false
	scopable:    false
	group:       identity
	aliases:     service_type

**Default:**

The same as the node `env`.

**Description:**

A code like PRD, DEV, etc... the agent can use to enforce data protection policies:

* A non-PRD object instance can not be started on a PRD node, unless the node `allow_envs` keyword allows its env
* A PRD object instance can be started on a non-PRD node (typically in a DRP situation)
* A PRD object instance running on a non-PRD node does not sync its data to its peers
* A non-PRD node does not sync data to a PRD node

The default value is read from the node `env` keyword.



## Keyword `grant`

	required:    false
	scopable:    true
	group:       grants
	convert:     listlowercase

**Example:**

	grant=admin:test* guest:*

**Description:**

Grant roles to the user.

A whitespace-separated list of pervasives role or per-namespace roles.

Pervasive roles:

* `root`

  Add resource triggers, non-containerized resources (non-root users can only
  add container.docker, container.podman task.docker, task.podman and volume)

* `squatter`

  Create and write the namespace configuration objects, `nscfg`, the
  namespaces themselves: what each namespace may take of the resources the
  cluster shares, its claims, its process group caps, the accounts it runs
  rootless containers as. They ration the cluster between the namespaces,
  so they are not the namespace administrator's to write. The squatter gets
  no role on the namespaces it creates: the objects of a namespace are the
  ones its `admin` role creates.

* `prioritizer`

  Set the `priority` keyword of an object.

* `blacklistadmin`

  Clear the blacklist of daemon listeners clients.

* `scraper`

  Read every metric of the nodes, at `/metrics`, `/metrics/<subsystem>` and
  through the api, and nothing else of the api. The role of a prometheus.

* `inspector`

  Read how the networks are set up on the nodes: the networks, their
  addresses, and the setup status of each on each node, with the addresses
  the nodes reach each other at, the devices, ports and tunnels, through
  `GET /api/network`, `/api/network/ip` and `/api/network/node`, and
  nothing else of the api. The cluster status and the events leave the
  network setup status out for the other roles, `root` aside: held with a
  guest role, `inspector` keeps it there.

* `<per-namespace role>:<namespace selector>`
 
Per-namespace roles:

* `admin`

  Create, delete objects in the namespace.

* `operator`

  Start, stop, provision, unprovision, freeze, unfreeze objects in the
  namespace.

* `guest`

  List and read configuration and status of the objects in the namespace.

A per-namespace role with no selector, as `guest`, holds the role on every
namespace, present and to come.

A `namespace selector` is a namespace name, or a glob pattern matched
against the namespace of each request: `*` matches any number of
characters, `?` one, and `[...]` one of a set. A pattern holds the role on
every namespace it matches, the ones created after the grant was written
among them, and the `system` namespace when it matches it, as `*` does. It
does not hold the role granted with no selector, which some requests about
the whole cluster need.

Examples:

* `guest:*` reads the objects of every namespace.
* `operator:prod*` operates the objects of `prod`, `prod1`, `prod-eu`...

A grantor gives only what its grants hold: `admin:prod*` may give
`admin:prod1`, not `admin:*`.


## Keyword `id`

	required:    false
	scopable:    false
	group:       identity
	recorded:    written when what it names is made, and reset when the object is cloned

**Default:**

A random generated UUID.

**Description:**

A rfc4122 random uuid generated by the agent.


## Keyword `l`

	required:    false
	scopable:    true
	group:       subject

**Example:**

	l=Gouvieux

**Description:**

Certificate Signing Request Location.


## Keyword `nodes`

	required:    false
	scopable:    true
	group:       nodes
	default:     *
	convert:     nodes

**Description:**

A node selector expression specifying the list of cluster nodes hosting
object instances.

If not specified or left empty, the node evaluating the keyword is
assumed to be the only instance hosting node.

Labels can be used to define a list of nodes by an arbitrary property.
For example `cn=fr cn=kr` would be evaluated as `n1 n2 n3` if `n1` and
`n2` have the `cn=fr` label and `n3` has the `cn=kr` label.

The glob syntax can be used in the node selector expression. For
example `n1 n[23] n4*` would be expanded to `n1 n2 n3 n4` in a
`n1 n2 n3 n4 n5` cluster.


## Keyword `o`

	required:    false
	scopable:    true
	group:       subject

**Example:**

	o=OpenSVC

**Description:**

Certificate Signing Request Organization.


## Keyword `ou`

	required:    false
	scopable:    true
	group:       subject

**Example:**

	ou=Lab

**Description:**

Certificate Signing Request Organizational Unit.


## Keyword `st`

	required:    false
	scopable:    true
	group:       subject

**Example:**

	st=Oise

**Description:**

Certificate Signing Request State.


## Keyword `uxuser`

	required:    false
	scopable:    true
	group:       grants
	convert:     list

**Example:**

	uxuser=alice 1001

**Description:**

The local logins, or uids, this user is on the user socket of the nodes:
a process of one of them connected to the socket gets the grants of this
user, as a client presenting the certificate named by `cn` does.

A user without it is no local login, even one of the same name: a user
made for the api does not grant the account of that name on every node.

A uid is matched without asking the name service, which keeps the user
working while a directory server does not answer.

Setting it requires the root grant.


## Keyword `validity`

	required:    false
	scopable:    true
	group:       certificate
	default:     1y
	convert:     duration

**Example:**

	validity=10y

**Description:**

Certificate Validity duration.


