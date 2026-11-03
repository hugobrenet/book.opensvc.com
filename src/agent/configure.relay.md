<!-- llms: The relay, a standalone OpenSVC server on a third site serving relay heartbeats and quorum votes: v2 and v3 compatibility, and its setup. -->
# Cluster Relay

A relay is typically installed on a third site to provide two services to clusters:

* Act as a key-value store for relay-type heartbeats to exchange their encrypted datasets using different network paths.
* Act as a voter in quorum votations.

## Compatibility

A relay is a simple standalone OpenSVC server.

* A v2 server can serve as a relay for v2 clusters
* A v3 server can serve as a relay for v3 clusters.
* A v2 server can not serve as relay for v3 clusters
* A v3 server can not serve as relay for v2 clusters

Changes:

* The v2 server relay API handlers require the cluster nodes communicate with the relay node secret, granting `root` privilege.
* The v3 server relay API handlers require the cluster nodes communicate with a user account with the `heartbeat` privilege.
* The v3 server relay API handlers store the cluster nodes datasets in per-user namespaces, so a single relay can serve multiple client populations.

## Configure a v3 relay server

> The **API** tabs assume the `$TOKEN` and the listener endpoint set up in
> [Cluster API](configure.api.md). A user is an object of kind `usr`, so
> `system/usr/relay` is `/api/object/path/system/usr/relay`.

Install the opensvc-server package, then create the user account the clusters will use:

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om system/usr/relay create --kw grant=heartbeat
```

</div>
<div class="tab" data-title="API">

Creating an object through the api is posting its configuration file:

```bash
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/octet-stream" \
  --data-binary $'[DEFAULT]\ngrant = heartbeat\n' \
  "https://<node>:1215/api/object/path/system/usr/relay/config/file"
```

</div>
</div>

Set a password for the user. Example with a random generated password:

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om system/usr/relay key add --name=password --from /dev/urandom
om system/usr/relay key decode --name=password
```

</div>
<div class="tab" data-title="API">

```bash
head -c 32 /dev/urandom |
curl -s -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @- \
  "https://<node>:1215/api/object/path/system/usr/relay/data/key?name=password"

curl -s -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/object/path/system/usr/relay/data/key?name=password"
```

The key value is the request body, so the bytes are read where the caller
runs: `--from /dev/urandom` is the cli doing the same read for you. The decode
is the same endpoint read back, which answers the value as the response body.

</div>
</div>

> ➡️ See Also
> * [How to install the agent](install.md)
> * [How to add a relay heartbeat to a cluster](internals.daemon.heartbeats.relay.md)
> * [How to add an arbitrator to a cluster](configure.quorum.md)

