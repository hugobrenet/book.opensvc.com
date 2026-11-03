<!-- llms: How to bootstrap a cluster: its heartbeats and stonith methods, enrolling and evicting nodes, and registering on a collector. -->
# Cluster Configuration

Upon agent installation, the node is considered part of its own 1-node cluster.

In `/etc/opensvc/cluster.conf`:

* {{#include ../inc/kw}}`cluster.secret` is initialized to a random value.
* {{#include ../inc/kw}}`cluster.name` is initialized to a random value.

## Bootstrap a new cluster

If the node is to be enrolled in an existing cluster, skip this section.

### Add Heartbeats

If the cluster seed node has no heartbeat setup, a `unicast` heartbeat with default settings is automatically added on daemon start.

This default heartbeat requires every nodename to be resolved to an ip address reachable on 1215/tcp.

If these requirements are not met, you can setup one or more custom heartbeats on the seed node before enrolling nodes.

For example, a custom heartbeat configuration would be:

        om cluster config update --set hb#2.type=unicast --set hb#2.port=10002

The heartbeats status is summarized in the top section of the monitoring command output:

        om mon

And the detailed status is shown by:

        om daemon hb status

> ➡️ See Also
> * [Heartbeats](internals.daemon.heartbeats.md)
> * [Roles](configure.rbac.md)

### Add Stonith methods

Stonith is optional. Skip to the next section if not concerned.

On a new cluster, the stonith configuration can be applied on the first node. The enrolled nodes fetch this configuration from the cluster.

For example, a dummy stonith configuration would be

```
om cluster config update --set stonith#node2.command=/bin/true
```

This configuration will execute {{#include ../inc/cmd}}`/bin/true` on the node taking over a service which was previously running on the now stalled {{#include ../inc/node}}`node2`.

Good, isolated fencing packages are freely available. For one, https://github.com/ClusterLabs/fence-agents

## Enroll a Node

A node is added to the cluster from the cluster side: a cluster node enrolls the new node, which leaves its own 1-node cluster and joins.

The node to enroll must be a 1-node cluster. A node that is still a member of a cluster with peers is refused, because its peers would keep it in their `cluster.nodes`.

> The **API** tabs assume the `$TOKEN` and the listener endpoint set up in
> [Cluster API](configure.api.md). That token is a cluster token: it speaks to
> {{#include ../inc/node}}`node1` only. The node to enroll is not a member of
> this cluster yet, so the calls addressed to it carry credentials of its own.

<div class="tabs">
<div class="tab" data-title="CLI">

On the node to enroll {{#include ../inc/node}}`node2`, create a token with the `join` role, and store it in a file:

```bash
sudo om daemon auth --role join --duration 10m >/root/node2.token
```

The token is valid for 60 seconds by default, so `--duration` gives time to copy the file to a cluster node.

On any cluster node, for example {{#include ../inc/node}}`node1`, enroll {{#include ../inc/node}}`node2` using the copied token file:

```bash
sudo om cluster enroll --node node2 --token /root/node2.token --wait
```

    Node node2 accepted the join order
    Cluster nodes updated
    Waiting for node2 to beat
    Node node2 is alive

* `--node` is the location of the node to enroll, in the `[<scheme>://]<addr>[:<port>]` format.
* `--token` is the path of the token file. The `OSVC_JOIN_TOKEN` environment variable is used when the flag is not set.
* `--join-addr` is the location {{#include ../inc/node}}`node2` must use to reach {{#include ../inc/node}}`node1`, in the same format. By default, a name the cluster certificate is valid for is used. Set it when this name does not resolve to an address reachable from {{#include ../inc/node}}`node2`.
* `--wait` waits for the {{#include ../inc/node}}`node2` heartbeat to beat in the cluster. Without it, follow the join with `om daemon events --filter 'NodeAlive,.node=node2'`.
* `--timeout` is the maximum duration of the join, `1h` by default.

The enroll requires the `root` grant.

</div>
<div class="tab" data-title="API">

The same enroll, driven from a host that is a member of neither cluster.

**1. Create a user on the node to enroll**

`POST /api/auth/token` only accepts the requests authenticated by the unix socket or by Basic Authentication, and a node freshly installed has no api user yet. So this first step is run locally on {{#include ../inc/node}}`node2`, once:

```bash
om system/usr/enroller create --kw grant=join
om system/usr/enroller key add --name=password --from /dev/urandom
om system/usr/enroller key decode --name=password
```

**2. Ask that node for a token with the `join` role**

```bash
curl -sSk -u enroller:$ENROLLER_PASSWORD -X POST \
  "https://node2:1215/api/auth/token?role=join&access_duration=10m" \
  | jq -r .access_token >/root/node2.token
```

* `role=join` is filtered against the grants of the user: the token carries the `join` role only if the user holds it.
* `access_duration` defaults to 60 seconds, which gives little time for the next call.
* `-k` is needed here: {{#include ../inc/node}}`node2` is still its own cluster, so its listener certificate is signed by its own certificate authority, which nothing outside of it trusts yet. That is also why the `join` role token carries a `ca` claim: it is what lets the cluster trust that certificate for the rest of the enroll.

**3. Post the enroll order to a cluster node**

```bash
curl -s -H "Authorization: Bearer $TOKEN" -X POST \
  "https://node1:1215/api/cluster/enroll" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --rawfile t /root/node2.token '{node:"node2", token:($t|rtrimstr("\n")), timeout:"1h"}')"
```

    {"node":"node2"}

* `node` is the location of the node to enroll, in the `[<scheme>://]<addr>[:<port>]` format. The scheme defaults to `https` and the port to the daemon listener port.
* `token` is the token obtained at the previous step.
* `join_addr` is the location {{#include ../inc/node}}`node2` must use to reach {{#include ../inc/node}}`node1`, in the same format. By default, a name the cluster certificate is valid for is used. Set it when this name does not resolve to an address reachable from {{#include ../inc/node}}`node2`.
* `timeout` is the lifetime of the `join` role token the cluster hands to {{#include ../inc/node}}`node2`, `1h` by default. It must outlive the node drain.

The requester must be granted the `root` role.

The response is sent as soon as {{#include ../inc/node}}`node2` has accepted the join order, and carries the nodename it reads from its own configuration. The join itself runs asynchronously.

**4. Follow the join**

```bash
curl -s -N -H "Authorization: Bearer $TOKEN" \
  "https://node1:1215/api/node/name/node1/daemon/event?duration=1h&filter=JoinSuccess,added_node=node2&filter=JoinIgnored,candidate_node=node2&filter=JoinError,candidate_node=node2&filter=NodeAlive,.node=node2"
```

* `JoinSuccess` says the api node has added {{#include ../inc/node}}`node2` to its `cluster.nodes`. The node has not drained, reconfigured, or restarted yet at this point.
* `JoinIgnored` says {{#include ../inc/node}}`node2` already was a cluster node.
* `JoinError` says the cluster nodes update failed.
* `NodeAlive` says the {{#include ../inc/node}}`node2` heartbeat beats in the cluster: it has fully joined. This is what `om cluster enroll --wait` waits for.

</div>
</div>

<div class="warning">

The enrolled node is drained before it leaves its cluster. As a 1-node cluster has nowhere to relocate its instances, they are stopped, stay down, and their configurations are removed.

Its configuration directory is moved to the backup directory, then the cluster, heartbeat and certificate configurations are fetched from the cluster.

</div>

### Collector Registration

The collector registration id of the enrolled node, its {{#include ../inc/kw}}`node.uuid` keyword, is in the configuration directory moved aside. When the node was registered on the collector, the join keeps it registered:

* Before its daemon starts, the enrolled node asks the cluster node it joins through to register it on the collector, with the registration id it held before the join.
* That cluster node, authenticated on the collector by its own registration id, registers it. The collector moves the enrolled node to the app and the cluster of that node, and hands it a new registration id, which the enrolled node stores in its {{#include ../inc/kw}}`node.uuid`.
* Once its daemon has started, the enrolled node pushes the inventory `om node register` pushes: asset, packages, disks, sysreport and checks.

This requires a collector server api 1.0.4 or later, allowing a node to register another one (the collector `allow_node_enroll` setting, on by default), and a cluster node registered on it.

The join does not depend on the collector: a node that was not registered is left unregistered, and a node the collector refuses to register is warned. Register it with:

	om node register --credential /root/collector.cred

> ➡️ See Also
> * [Register on a Collector](configure.base.md#register-on-a-collector)

## Evict a Node

A node is removed from the cluster by another cluster node. The evicted node leaves the cluster, then restarts its daemon alone, in a new 1-node cluster.

The node to evict must be drained: frozen, with no running instance. Else its instances would stay up on a node the cluster no longer knows about, free to start a second time elsewhere.

<div class="tabs">
<div class="tab" data-title="CLI">

On any other cluster node, for example {{#include ../inc/node}}`node1`, drain then evict {{#include ../inc/node}}`node2`:

```bash
sudo om node drain --node node2 --wait
sudo om cluster evict --node node2 --credential /root/node2.cred --wait
```

    Node node2 accepted the leave order
    Cluster nodes updated
    Node node2 is restarting alone, its instances stay down

* `--node` is the name of the cluster node to evict. It can not be the local node: run the command on one of its peers.
* `--credential` is the path of a file holding the `<username>:<password>` of a user to create on the evicted node, in the `system` namespace with the `root` grant. The `OSVC_CREDENTIAL` environment variable is used when the flag is not set.
* `--wait` waits for the cluster nodes to be updated. Without it, follow the eviction with `om daemon events --filter 'LeaveSuccess,removed_node=node2'`.
* `--timeout` is the maximum duration of the leave, `1h` by default.

The evict requires the `root` grant.

</div>
<div class="tab" data-title="API">

**1. Drain the node to evict**

```bash
curl -s -H "Authorization: Bearer $TOKEN" -X POST \
  "https://node1:1215/api/node/name/node2/action/drain"
```

    {"orchestration_id":"e2ba0d0e-...."}

The drain is asynchronous, and the eviction is refused with a `409` while {{#include ../inc/node}}`node2` is not drained, so wait for the drain to end before the next call. A drained node is frozen and runs no instance, which `GET /api/cluster/status` reports.

**2. Post the evict order to another cluster node**

```bash
curl -s -H "Authorization: Bearer $TOKEN" -X POST \
  "https://node1:1215/api/cluster/evict" \
  -H "Content-Type: application/json" \
  -d '{"nodename":"node2","credential":"admin:secret","timeout":"1h"}'
```

    {"detail":"node node2 is leaving the cluster","status":200,"title":"background cluster leave has been called"}

* `nodename` is the cluster node to evict. It can not be the node serving the request: post this to one of its peers.
* `credential` is the `<username>:<password>` of a user to create on the evicted node, in the `system` namespace with the `root` grant. It is optional, and checked before anything is ordered.
* `timeout` is the maximum duration of the leave forked on the evicted node, `1h` by default.

The requester must be granted the `root` role.

The response is sent as soon as {{#include ../inc/node}}`node2` has accepted the leave order. The leave itself runs asynchronously.

**3. Follow the eviction**

```bash
curl -s -N -H "Authorization: Bearer $TOKEN" \
  "https://node1:1215/api/node/name/node1/daemon/event?duration=1h&filter=LeaveSuccess,removed_node=node2&filter=LeaveIgnored,candidate_node=node2&filter=LeaveError,candidate_node=node2"
```

* `LeaveSuccess` says the cluster has dropped {{#include ../inc/node}}`node2` from its `cluster.nodes`. This is what `om cluster evict --wait` waits for.
* `LeaveIgnored` says {{#include ../inc/node}}`node2` was not a cluster node.
* `LeaveError` says the cluster nodes update failed.

The daemon restart and the user creation happen after `LeaveSuccess`, on a node this cluster no longer observes, so no event reports them.

</div>
</div>

<div class="warning">

The evicted node ends up with a cluster secret of its own, so no user, token or certificate of the cluster can reach its api anymore. Without a credential, its api is only reachable locally, as root.

Its configuration directory is moved to the backup directory.

</div>

> ➡️ See Also
> * [Scheduler](internals.daemon.scheduler.md)
> * [Heartbeats](internals.daemon.heartbeats.md)
> * [Roles](configure.rbac.md)
