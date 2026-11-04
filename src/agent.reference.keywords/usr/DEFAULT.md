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
	convert:     list

**Example:**

	alt_names=www.opensvc.com opensvc.com

**Description:**

Certificate Signing Request Alternative Domain Names.


## Keyword `app`

	required:    false
	scopable:    false
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
	default:     4kib
	convert:     size

**Example:**

	bits=8192

**Description:**

Certificate Private Key Length.


## Keyword `c`

	required:    false
	scopable:    true

**Example:**

	c=FR

**Description:**

Certificate Signing Request Country.


## Keyword `ca`

	required:    false
	scopable:    true
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

**Example:**

	email=test@opensvc.com

**Description:**

Certificate Signing Request Email.


## Keyword `env`

	required:    false
	scopable:    false
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

  Create a new namespace. 

* `prioritizer`

  Set the `priority` keyword of an object.

* `blacklistadmin`

  Clear the blacklist of daemon listeners clients.

* `scraper`

  Read every metric of the nodes, at `/metrics`, `/metrics/<subsystem>` and
  through the api, and nothing else of the api. The role of a prometheus.

* `<per-namespace role>:<namespace selector>`
 
Per-namespace roles:

* `admin`

  Create, delete objects in the namespace.

* `operator`

  Start, stop, provision, unprovision, freeze, unfreeze objects in the
  namespace.

* `guest`

  List and read configuration and status of the objects in the namespace.
 
A `namespace selector` is a glob pattern applied to existing namespaces.


## Keyword `id`

	required:    false
	scopable:    false
	recorded:    written when what it names is made, and reset when the object is cloned

**Default:**

A random generated UUID.

**Description:**

A rfc4122 random uuid generated by the agent.


## Keyword `l`

	required:    false
	scopable:    true

**Example:**

	l=Gouvieux

**Description:**

Certificate Signing Request Location.


## Keyword `nodes`

	required:    false
	scopable:    true
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

**Example:**

	o=OpenSVC

**Description:**

Certificate Signing Request Organization.


## Keyword `ou`

	required:    false
	scopable:    true

**Example:**

	ou=Lab

**Description:**

Certificate Signing Request Organizational Unit.


## Keyword `st`

	required:    false
	scopable:    true

**Example:**

	st=Oise

**Description:**

Certificate Signing Request State.


## Keyword `uxuser`

	required:    false
	scopable:    true
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
	default:     1y
	convert:     duration

**Example:**

	validity=10y

**Description:**

Certificate Validity duration.


