<!-- llms: The cluster API: how it is reached, its authentication methods, basic, X.509 certificates and JWT from an OpenID server, and its local users. -->
# Cluster API

The Cluster API provides remote access to the OpenSVC cluster management and monitoring functionality. It is accessible through the **agent listener** on any running cluster node.

## Access and Network Resolution

The Cluster API URL (server name) can be configured to resolve to various network endpoints to ensure high availability and redundancy.

Possible Resolutions:

  * **Single Floating IP**

    A single virtual IP (VIP) address, typically managed by a failover service like `system/svc/vip`. This is the most common and robust approach.

  * **Multiple Floating IP Addresses**

    A set of VIPs for complex network routing or multi-site setups.

  * **All Cluster Node IPs**

    Every physical or virtual IP address of all nodes in the cluster.

  * **Subset of Cluster Node IPs**

    A selection of node IP addresses, often used in large clusters or specific network segments.


## Authentication Methods

The agent listener supports several industry-standard authentication methods to secure access to the API.

### Basic Authentication

  * **Mechanism:** The client provides the **username** and **password** in the request header of every API call and the password is compared to the `password` key of the `system/usr/<username>` object.
  * **Authorization:** The RBAC grants are read from the `system/usr/<username>` `grant` key.
  * **User Object:** The `system/usr/<username>` object **must exist** on the cluster.

### X.509 Certificate Authentication

  * **Mechanism:** Authentication is based on a client-side X.509 certificate.
  * **Trust:** The certificate must be signed by one of the Certificate Authorities listed in the cluster `ca` keyword, `system/sec/ca` by default, and carry the **TLS client authentication** extended key usage. A certificate signed by any other authority is refused, whatever its `cn`.
  * **Username:** The username is derived from the **Common Name (`cn`)** field of the client certificate. A certificate with an empty `cn` is refused.
  * **Authorization:** The RBAC grants are read from the `system/usr/<username>` `grant` key.
  * **User Object:** The `system/usr/<username>` object **must exist** on the cluster.

### JSON Web Token (JWT)

  * **Mechanism:** Authentication is based on a JWT passed as a bearer token.
  * **Username:** The username is derived from the `sub` token claim.
  * **Authorization:** The RBAC grants are derived from the `grant` claim of a token the cluster issued itself, or from the `entitlements` claim of a token issued by an OIDC server.
  * **User Object:** The `system/usr/<username>` object **does not need to exist** on the cluster **if** the tokens are issued and managed by an external OpenID Connect (OIDC) server.
  * **Issuance:** A token is obtained from the `POST /api/auth/token` endpoint, which accepts only the requests authenticated by the **unix socket** (a local `om` command) or by **Basic Authentication**. A request authenticated by a token or by a certificate is refused with `403 not allowed to create token`. A remote client therefore presents its password once to obtain a token, and asks for a refresh token at the same time if it needs to renew without presenting the password again.
  * **Availability:** This method was **added in OpenSVC v3** agents.

### Local Accounts and Sidecars (User Socket)

  * **Mechanism:** A process of the node connects to the **user socket**, `/run/opensvc-ux/http.sock`, and presents no credential: the daemon reads who connected from the connection, as the kernel recorded it, which the process can not choose. `ox` uses this socket when it runs as a user other than root with no context set.
  * **Access:** The socket is mode `0660`, in a directory of mode `0750`, both owned by root and the group the `listener.ux_owner_group` keyword names, `opensvc` by default. A node that does not know the group serves no socket, and logs why.
  * **Local accounts:** The grants are the union of the `grant` keyword of the `[uxgroup#<group>]` sections of the cluster configuration naming the unix groups of the account, as the name service lists them, and of the `grant` keyword of the `system/usr/<name>` object whose `uxuser` keyword names the login or the uid of the account. A `usr` object without `uxuser` is no local account, even one of the same name.
  * **Sidecars:** A process of a container started by the agent, the socket bind mounted into it, gets the grants of the `uxgrant` keyword of its container resource. The container is told by its cgroup, under the process group of the resource, never by its uid: root in a container is root on the cluster only if `uxgrant = root` says so. This needs a kernel giving the pidfd of the peer of a unix socket (Linux 6.5 and later).
  * **Root:** Root is **not** root on the user socket: a local `om` command uses the root socket.
  * **Writes:** Setting `uxuser`, a `[uxgroup#<group>]` section, or `uxgrant` requires the root grant.
  * **Name service:** The login and the groups of an account are looked up with a deadline of 3 seconds, at most 8 lookups at once, and cached. A directory server not answering refuses the accounts it is asked about, never the root socket nor the sidecars, and a `uxuser` naming a uid keeps working without the name service.
  * **Availability:** This method was **added in OpenSVC v3** agents.

Grant the members of the `ops` unix group the operator role on the `ns1` namespace:

<div class="tabs">
<div class="tab" data-title="CLI">

```
om cluster config update --set uxgroup#ops.grant=operator:ns1
```

</div>
<div class="tab" data-title="API">

```
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" \
  --data-urlencode 'set=uxgroup#ops.grant=operator:ns1' \
  -G "https://<node>:1215/api/cluster/config"
```

</div>
</div>

Let a sidecar act as root, the socket directory bind mounted into its container:

<div class="tabs">
<div class="tab" data-title="CLI">

```
om ns1/svc/app config update \
  --set container#sidecar.volume_mounts=/run/opensvc-ux:/run/opensvc-ux:ro \
  --set container#sidecar.uxgrant=root
```

</div>
<div class="tab" data-title="API">

```
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" \
  --data-urlencode 'set=container#sidecar.volume_mounts=/run/opensvc-ux:/run/opensvc-ux:ro' \
  --data-urlencode 'set=container#sidecar.uxgrant=root' \
  -G "https://<node>:1215/api/object/path/ns1/svc/app/config"
```

</div>
</div>

> **Note:** A `sudo` rule letting a user run `om` is a root grant, whatever arguments the rule allows: om runs commands as root by design, as the start command of an app, the editor of `om <path> config edit`, or a task. Give the user a group mapped by a `[uxgroup#<group>]` section, and `ox`, instead.


### Hypervisor to Guest (vsock)

  * **Mechanism:** A kvm guest serves the API on a vsock port. The master reaches it from its hypervisor, with no network in the guest.
  * **Authorization:** A connection of the hypervisor from a reserved source port gets the `root` grant, the hypervisor being root on its guests anyway, when it holds a token signed with the key of the cluster. The guest verifies it with the public key the start of the domain writes in its firmware, and for its own uuid, so a process of the hypervisor that binds a reserved port but can not read the key of the cluster gets nothing. The guest drops any other peer. A guest gets the key at its next start.
  * **Availability:** This method was **added in OpenSVC v3** agents, for `container.kvm` guests.

The master prefers this way for the status, the config and the provision, unprovision, start, stop, shutdown and startstandby actions of the encap instances. When the guest daemon does not answer, it uses `qga` or `rcmd`.

The guest needs a vsock device. A provision adds it to a `virtinst` running a `virt-install` that knows `--vsock`. On an existing guest, add it to the domain definition, for the next start:

```xml
<vsock model='virtio'>
  <cid auto='yes'/>
</vsock>
```

libvirt allocates the context id, and a start or a live migration may change it, so nothing needs configuring and nothing should store it. The running value is the `vsock_cid` of the resource status info.

A hypervisor with no `/dev/vhost-vsock` starts such a guest without the device, with a warning, and reaches it through `qga` or `rcmd`: its definition keeps the device, for the other nodes. A guest running with the device can not be moved live to such a hypervisor: stop it to move it.

Then have the guest daemon serve the port, in the guest, and restart its daemon. Leave it unset on the hypervisors.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om cluster config update --set listener.vsock_port=1215
```

</div>
<div class="tab" data-title="API">

```
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" \
  --data-urlencode 'set=listener.vsock_port=1215' \
  -G "https://<guest>:1215/api/cluster/config"
```

</div>
</div>

The `vsock_port` keyword of the `container.kvm` resource names the port on the master side, `1215` by default. Set it to `0` to not use this way.

The next port, `1216` by default, serves the console of the guest. `om <path> container enter` opens a root shell in the guest through it, with no network and no key, and uses `rcmd` when the guest does not serve it. `ox` reaches the same shell through the master. A session is a process of its own in the guest, so restarting the agent from it does not end it. Only the hypervisor can ask for such a shell: a `root` grant over the network can not.

## Managing API Users

### Using an OpenID server

The OpenID server will need to be configured to provide tokens with an
`entitlements` claim, holding the grant expressions this cluster is to give the
user. The claim is not named `grant`: that is the claim of the tokens the
cluster issues itself.

```
[listener]
openid_issuer = https://auth.mycorp.com/realms/clusters
openid_client_id = om3
```

The daemon reads `<openid_issuer>/.well-known/openid-configuration` to discover
the provider, and fetches the signing keys from the `jwks_uri` it advertises. A
token is accepted only if:

  * Its `aud` claim contains the `openid_client_id` value.
  * Its `iss` claim equals the `issuer` value **advertised by the discovery
    document**, which is not necessarily the `openid_issuer` url used to reach
    it.
  * Its signature verifies against a key of the `jwks_uri` key set, named by the
    token `kid` header.

> ➡️  See Also
> * [The cluster `listener.openid_client_id` keyword](../agent.reference.keywords/cluster/listener.html#openid_client_id)
> * [The cluster `listener.openid_issuer` keyword](../agent.reference.keywords/cluster/listener.html#openid_issuer)
> * [The user `grant` keyword](../agent.reference.keywords/usr/DEFAULT.html#grant) 

### Creating Local Users (`system/usr/`)

Skip this step if you plan to use only OIDC-issued tokens for a user. Local user objects define the user's cluster grants for Basic and X.509 authentication.

```bash
# Create a cluster-wide administrator user
om system/usr/root create --kw grant=root

# Create user `usr1` with
#  `admin` rights on namespace `ns1`
#  `guest` (read-only) rights on namespace `ns2`
om system/usr/usr1 create --kw grant="admin:ns1 guest:ns2"
```


### Generating X.509 Certificates for Users

This step is only necessary if you require X.509 authentication for the user.

The certificate is named after the object and signed by the cluster
certificate authority, which is what the api expects of it. The `cn` and `ca`
keywords hold those two and rarely need to be set.

```bash
# Generate Certificate:
om system/usr/root certificate create
om system/usr/usr1 certificate create

# Download Keys (for client use):
om system/usr/usr1 key decode --name certificate_chain
om system/usr/usr1 key decode --name certificate
om system/usr/usr1 key decode --name private_key
```

These commands will print the PEM-encoded keys to standard output.


## Testing the API

The API manifest (documentation) is exposed by a demonstration agent for reference.

A practical test using a JWT:

```bash
# Generate a Temporary Token:
$ TOKEN=$(sudo om daemon auth token --subject usr1 --duration 10m)

# Call the `whoami` Endpoint:
$ curl -o- -k -s -H "Authorization: Bearer $TOKEN" https://localhost:1215/api/auth/whoami
```

Example Output:

```json
{"auth":"jwt","grant":{"guest":["ns2"], "admin": ["ns1"]},"name":"usr1","namespace":"system","raw_grant":"admin:ns1 guest:ns2"}
```


## Configuring the Listener TLS Certificate

The agent listener requires a TLS certificate to accept remote connections securely.

Upon initial agent installation and daemon startup:

* A self-signed Certificate Authority (CA) is automatically created as `system/sec/ca`, valid 10 years.
* A listener certificate, signed by this internal CA, is automatically created as `system/sec/cert`.

The daemon renews both before they expire: see
[Cluster Certificate Lifecycle](#cluster-certificate-lifecycle). The
following steps are only required if you need to **re-sign the internal CA**
or **switch to an external PKI**.

### Option 1: Using the Internal PKI

The initial configuration is done automatically upon agent installation and daemon startup, creating:

  * The CA certificate at `system/sec/ca`.
  * The listener certificate at `system/sec/cert`.

1. **Import a valid certificate in `system/sec/ca`:**
    ```bash
    om system/sec/ca key change certificate --from ~/$CLUSTERNAME.pem
    om system/sec/ca key change certificate_chain --from ~/$CLUSTERNAME.chain
    om system/sec/ca key change private_key --from ~/$CLUSTERNAME.key
    ```
2. **Recreate the listener certificate:**
    ```bash
    om system/sec/cert certificate create
    ```

### Option 2: Using an External PKI

1.  **Adjust the Listener Certificate Subject:**

    Only the `cn` is strictly required by OpenSVC, but the signing certificate authority will surely require more.

    ```bash
    om system/sec/cert config update --set cn=vip.$CLUSTERNAME.mycorp \
        --set alt_names="node1.$CLUSTERNAME.mycorp node2.$CLUSTERNAME.mycorp" \
        --set c=FR \
        --set o=MyCorp \
        --set ou=Support \
        --set l=Paris \
        --set st=IDF \
        --set email=support@mycorp
    ```
2.  **Create the Listener Certificate Request:**
    ```bash
    om system/sec/cert certificate signing-request
    ```
3.  **Perform External Signing:** *(This is an external procedure to be done with your PKI tool using the generated csr.)*
4.  **Load the Signed Certificate:**
    ```bash
    om system/sec/cert key change certificate_chain --from ~/$CLUSTERNAME_crt_chain.pem
    ```
    The certificate is always first, then the CA certificate chain.
5.  **Configure Certificate Revocation List (Optional):**
    ```bash
    om cluster config update --set cluster.crl=http://crl.mycorp
    ```
6. **Restart the Daemons**
    ```bash
    om daemon restart --node="*"
    ```

### Option 3: A Public Certificate from an ACME Directory

`system/sec/cert` certifies the names the nodes reach each other by, which no
public authority certifies. A name of the cluster published on the internet,
as the name of its virtual address, can have a second certificate, which
browsers and remote clients trust, obtained and renewed from an ACME directory
like Let's Encrypt. The listener presents it to the clients asking that name,
and `system/sec/cert` to the others.

1.  **Create the sec of the public certificate:**

    ```bash
    om system/sec/public create --kw cn=vip.mycorp.com --kw email=support@mycorp.com \
        --kw acme.directory=letsencrypt-staging
    ```

2.  **Have the listener present it, and answer its challenges:**

    ```bash
    om cluster set --kw listener.tls_secs=system/sec/public --kw listener.acme_port=80
    ```

    `listener.tls_secs` lists the secs whose certificates the listener
    presents to the clients asking one of their names. `listener.acme_port`
    has every node answer the http-01 challenges of these certificates in
    plain http, on a port the nodes must leave free for it, `80` being the
    one an ACME directory reads them from. The listener answers
    `/.well-known/acme-challenge/<token>` there, and nothing else.

3.  **Obtain the certificate:**

    ```bash
    om system/sec/public certificate renew
    ```

    The renewal stores the challenge token in the sec, which the daemon
    replicates, and waits for every node to answer it before the directory
    reads it. The name may resolve to any node, or to a virtual address that
    moves between them. Once issued, the listener presents the certificate
    from the next connection, on every node, without a restart.

4.  **Switch to the trusted directory** once the staging certificate is in
    place, keeping the ACME keys of the sec, which record the directory its
    certificate comes from:

    ```bash
    om system/sec/public set --kw acme.directory=letsencrypt
    om system/sec/public certificate renew
    ```

5.  **Schedule the renewal**, daily, from a cron of a node for example: it
    does nothing until the certificate expires within 30 days.

The http-01 challenge certifies a name, not a wildcard: a `*.mycorp.com`
certificate needs the dns challenge, which is not supported.
[Certificates](apps.design.certificates.md) describes the renewal.

## Cluster Certificate Lifecycle

Every node verifies the certificate a peer presents with the cluster
authorities: `system/sec/ca`, and the secs the cluster `ca` keyword lists. A
certificate that expired, or that no cluster authority signed, is refused,
and the nodes stop exchanging configurations, as a CA that expired makes
every certificate it signed refused at once.

### Automatic Renewal

The daemon speaker renews the certificates of the internal PKI, at its start,
daily, and when they change:

* `system/sec/ca`, with the same key, a fifth of its validity before it
  expires, a year at most: the certificates it signed are verified by the
  renewed one. A CA created before its validity was set, valid 1 year, is
  given `validity = 10y` first.
* `system/sec/cert`, 30 days before it expires, when the cluster nodes
  change, and when `system/sec/ca` is renewed, as its chain holds the
  certificate of the CA.

A certificate installed from elsewhere, as one of an external PKI, is not
renewed. Every node installs the renewed certificates as soon as it receives
them, with no restart.

### Watching the Expiry

A node warns, in its log and in the issues of its configuration, when the
certificate of `system/sec/cert` expires within 14 days, or the one of
`system/sec/ca` within 90: the renewal failed, or the certificate was
installed from elsewhere. It warns too when a CA the cluster `ca` keyword
keeps, as a former one, expires within 90 days: the certificates it signed
are refused once it does. `om mon` marks a node with issues.

<div class="tabs">
<div class="tab" data-title="CLI">

```
om cluster status -o json | jq '.cluster.node[].config.issues'
```

</div>
<div class="tab" data-title="API">

```
curl -s -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/cluster/status" | jq '.cluster.node[].config.issues'
```

</div>
</div>

To renew one at once:

```
om system/sec/cert certificate renew
om system/sec/ca certificate renew --force
```

The renewal runs on the node the command runs on, and has no api
counterpart. The CA is renewed with its key, its certificate only being
replaced.

### Rotating the CA Key

A CA key disclosed, or too weak, is replaced, with no node refusing another
meanwhile:

```
om cluster ca rotate
```

1. A new CA is created as `system/sec/ca-next`, and the certificate of the
   current one kept, without its key, as `system/sec/ca-former-<yyyymmdd-hhmm>`. The
   cluster `ca` keyword lists both, until every node has them.
2. `system/sec/ca` takes the key and the certificate of the new CA, and
   `system/sec/cert` is issued again by it, until every node has them.
3. `system/sec/ca-next` is deleted.

Every cluster node is waited for at each step, a node down among them: a node
that would come back trusting the former CA alone could reach no peer. A wait
that expires, after `--timeout` (5 minutes by default), interrupts the
rotation, which is resumed by running the command again.

The former CA stays trusted, for the certificates it signed, as the ones of
the users created by `om system/usr/<name> certificate create`, and the api
tokens it signed stay valid until they expire. The end of the rotation says,
of each former CA the cluster `ca` keyword lists, the certificates it signed
still in use:

```
system/sec/ca-former-20261014-1741: trusted still, as it signed the certificate of system/usr/cva: renew them with 'om <path> certificate create', then stop trusting it
system/sec/ca-former-20261014-1841: signed no certificate in use, stop trusting it with:
  om cluster config update --set cluster.ca-=system/sec/ca-former-20261014-1841
  om system/sec/ca-former-20261014-1841 delete
```

Once the certificates it signed are renewed, stop trusting a former CA:

```
om cluster config update --set cluster.ca-=system/sec/ca-former-<yyyymmdd-hhmm>
om system/sec/ca-former-<yyyymmdd-hhmm> delete
```

`om cluster ca rotate --drop-former` does it at the end of the rotation, and
is refused while the former CA signed a certificate in use. The command
runs on a cluster node, and has no api counterpart.

### Recovering from an Expired CA

A CA that expired before it was renewed, as one created before the automatic
renewal, makes every node refuse its peers: the configurations do not reach
the other nodes, so a renewal on one node does not either. Renew on one
node, copy the two secs to the others, and restart the daemons:

1. On one node, renew the CA, then the listener certificate it signs:

    ```bash
    om system/sec/ca config update --set validity=10y
    om system/sec/ca certificate renew --force
    om system/sec/cert certificate renew
    ```

2. Copy their configuration files to the other nodes, as they are: their
   values are encrypted with the cluster secret, which every node shares.

    ```bash
    for node in node2 node3; do
        scp /etc/opensvc/namespaces/system/sec/ca.conf \
            /etc/opensvc/namespaces/system/sec/cert.conf \
            $node:/etc/opensvc/namespaces/system/sec/
    done
    ```

3. Restart the daemon of every node, which installs the certificate files
   from the secs at its start:

    ```bash
    om daemon restart
    ```

The renewal keeps the key of the CA, so the certificates of the users it
signed are valid again too. None of this has an api counterpart: the api of
the other nodes is the one the expired CA keeps out of reach.

> ➡️  See Also
> * [Access Control](configure.rbac.md) for roles and grant management.
