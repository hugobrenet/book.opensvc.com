<!-- llms: The events of the daemon: the commands reading them, filters, event kinds, the events a task runs on, and templating. -->
# Events

* The daemon runs an event bus.
* The daemon subsystems can publish events and subscribe to events.
* Some events are relayed to peer nodes via the heartbeat links.
* Events are exposed as a SEE feed via the daemon API.

🛈 The cluster dataset is maintained by assembling received events.

🛈 The webapp, terminal user interface and monitor in watch mode all use events to render live data.

## Commands

Print the event stream of a node:

<div class="tabs">
<div class="tab" data-title="CLI">

```bash
om daemon events [--filter <expression>]
ox daemon events [--filter <expression>]
```

</div>
<div class="tab" data-title="API">

```bash
curl -s -N -H "Authorization: Bearer $TOKEN" \
  "https://<node>:1215/api/node/name/<node>/daemon/event?filter=<expression>"
```

</div>
</div>

`node events` is the former name of the command.

## Filtering

Receive only events matching the filtering expression formatted as:

    <element>[,...]
    where:
      <element> is one of:
        <kind>                keep events of this kind
        <key>=<value>         discard events of matching kinds not thus labeled
        <jsonpath><op><value> discard events of matching kinds that don't pass
                              this data assertion
        where:
          <jsonpath> starts with a dot and is relative to .data
          <op> can be
            = or !=
            > or <
            >= or <=

### Event Kinds

#### Cluster
 
     ClusterConfigUpdated, ClusterStatusUpdated
     JoinError, JoinIgnored, JoinRequest, JoinSuccess
     LeaveError, LeaveIgnored, LeaveRequest, LeaveSuccess
     ArbitratorError, ForgetPeer

#### Config File Updates

     ConfigFileRemoved, ConfigFileUpdated, RemoteFileConfig

#### Daemon

     DaemonCollectorUpdated, DaemonCtl, DaemonDataUpdated
     DaemonDnsUpdated, DaemonHeartbeatUpdated, DaemonListenerUpdated
     DaemonRunnerImonUpdated, DaemonSchedulerUpdated, DaemonStatusUpdated
     WatchDog
     
#### DNS

     ZoneRecordDeleted, ZoneRecordUpdated

#### Execs

     Exec, ExecFailed, ExecSuccess

####  Heartbeat

    HeartbeatMessageTypeUpdated, HeartbeatAlive, HeartbeatStale
    HeartbeatRotateRequest, HeartbeatRotateSuccess, HeartbeatRotateError, HeartbeatSecretUpdated

#### Instance

     FileInstalled
     InstanceConfigDeleted, InstanceConfigManagerDone, InstanceConfigUpdated
     InstanceFrozenFileRemoved, InstanceFrozenFileUpdated
     InstanceMonitorAction, InstanceMonitorDeleted, InstanceMonitorUpdated
     InstanceStatusDeleted, InstanceStatusPost, InstanceStatusUpdated
     ProgressInstanceMonitor, SetInstanceMonitorRefused
     RunFileUpdated, RunFileRemoved
     SetInstanceMonitor

#### Node

     NodeAlive, NodeStale
     NodeConfigUpdated, NodeDataUpdated, NodeFrozen
     NodeFrozenFileRemoved, NodeFrozenFileUpdated
     NodeMonitorDeleted, NodeMonitorUpdated
     NodeOsPathsUpdated
     NodePoolStatusUpdated, NodePoolStatusDeleted
     NodeRejoin, NodeSplitAction
     NodeStatsUpdated
     NodeStatusUpdated
     NodeStatusArbitratorsUpdated, NodeStatusGenUpdates, NodeStatusLabelsUpdated
     SetNodeMonitor
     
#### Network

     NetworkPeersUpdated

#### Object

     ObjectOrchestrationAccepted, ObjectOrchestrationEnd, ObjectOrchestrationRefused
     ObjectStatusDeleted, ObjectStatusDone, ObjectStatusUpdated

#### Event Subscription

     ClientSubscribed, ClientUnsubscribed, SubscriptionError, SubscriptionQueueThreshold

#### Misc

     Log

### Example filters
    path=svc1,node=n1
    InstanceStatusUpdated
    InstanceStatusUpdated,ObjectOrchestrationEnd
    InstanceStatusUpdated,path=svc1,ObjectOrchestrationEnd
    InstanceStatusUpdated,path=svc1,node=n1
    InstanceStatusUpdated,path=svc1,node=n1,.instance_status.frozen_at="0001-01-01T00:00:00Z"
    InstanceStatusUpdated,path=svc1,node=n1,.instance_status.frozen_at>"0001-01-01T00:00:00Z"
    InstanceStatusUpdated,path=svc1,node=n1,.instance_status.avail="up"
    InstanceStatusUpdated,path=svc1,node=n1,.instance_status.resources."fs#1".avail="up"
    FileInstalled,path=svc1,rid=fs#1
    NetworkPeersUpdated,name=backend1

### Events a task runs on

A task's `on` keyword runs it on some events of its node, described in
[Event-triggered Runs](internals.daemon.scheduler.md#event-triggered-runs):

* `FileInstalled` is published when an install of a resource of a local
  instance wrote files, whatever ran it, and not when it found them up to date.
  `files` are the files written, relative to the head of the resource:

      {"kind":"FileInstalled","data":{"node":"dev2n1","path":"system/svc/strongswan","rid":"fs#1","files":["/swanctl.conf"],"at":"2026-10-11T21:11:04.544314706+02:00"}}

* `NetworkPeersUpdated` is published after the setup of a network of the node,
  when its peers changed: a node joined or left it, the address of a node
  changed, or the tunnel to it:

      {"kind":"NetworkPeersUpdated","data":{"node":"dev2n1","name":"backend1"}}

## Templating

The template syntax follows the go template standard, with a few custom extra functions.

### Custom Functions

* `hasNodeLabel(labels []pubsub.Label, expected ...string) bool`

* `hasPathLabel(labels []pubsub.Label, expected ...string) bool`

* `hasInstanceLabel(labels []pubsub.Label, expected ...string) bool`

* `passSet(s string, b bool)`

  Add s to passed if b else remove s from passed.
  Return true when passed items has been changed.

* `passCount() int`

  Return count of passed items.

* `setSuccess(b bool)`

  Set success to b.
  When b is true and 'om node --wait' exit with 0 exit code.

* `toInst(p path, node string) string`

  Return instance id from path and nodeaaa.

* `stringsContains(s string, substr string) bool`

  Alias of strings.Contains.

* `stringsHasPrefix(s string, prefix string) bool`

  Alias of strings.HasPrefix.

* `stringsHasSuffix(s string, suffix string) bool`

  Alias of strings.HasSuffix.

### Useful templates

#### Simple event formatting:

    --filter InstanceMonitorUpdated --template \
      '{{printf "instance %s@%s monitor state is %s\n" .data.path .data.node .data.instance_monitor.state}}'


#### Label filtering:

* By node:

      --filter InstanceMonitorUpdated,path=foo --template \
        '{{if hasNodeLabel .data.labels "dev1n1" "dev1n2" -}}
            {{printf "instance %s@%s monitor state is %s\n" .data.path .data.node .data.instance_monitor.state}}{{end}}'

* By path:

      --filter InstanceMonitorUpdated,node=dev1n1 --template \
        '{{if hasPathLabel .data.labels "foo001" "foo002" -}}
            {{printf "instance %s@%s monitor state is %s\n" .data.path .data.node .data.instance_monitor.state}}{{end}}'

* By instance:

      --filter InstanceMonitorUpdated --template \
        '{{if hasInstanceLabel .data.labels "foo001@dev1n1" "foo002@dev1n2" -}}
            {{printf "instance %s@%s monitor state is %s\n" .data.path .data.node .data.instance_monitor.state}}{{end}}'


#### Wait templates:

* Object is avail up and provisioned true:

      --wait --filter ObjectStatusUpdated,path=foo --template \
          '{{if setSuccess (and (eq .data.instance_status.avail "up")
                           (eq .data.instance_status.provisioned "true"))}}{{end}}'

* Instance is avail up and provisioned true:

      --wait --filter InstanceStatusUpdated,path=foo,node=dev1n1 --template \
          '{{if setSuccess (and (eq .data.instance_status.avail "up")
                                (eq .data.instance_status.provisioned "true"))}}{{end}}'

* Node is frozen:

      --wait --filter NodeStatusUpdated,node=dev1n1 --template \
        '{{if setSuccess (eq .data.instance_status.frozen_at "0001-01-01T00:00:00Z")}}{{end}}'

* All cluster nodes are frozen:

      --wait --filter ClusterStatusUpdated --template \
        '{{if setSuccess .data.cluster_status.is_frozen}}{{end}}'

* All cluster nodes are unfrozen:

      --wait --filter ClusterStatusUpdated --template \
        '{{if setSuccess (not .data.cluster_status.is_frozen)}}{{end}}'

* Object avail is up on 3 objects:

      --wait --filter ObjectStatusUpdated --template \
        '{{if passSet (toInst .data.path .data.node) (eq .data.object_status.avail "up") -}}
              {{with setSuccess (eq passCount 3)}}{{end}}{{end}}'

* Object avail is up on 3 objects that starts with "foo":

      --wait --filter ObjectStatusUpdated --template \
        '{{if eq (slice .data.path 0 3) "foo" -}}
              {{if passSet .data.path (eq .data.object_status.avail "up") -}}
                  {{with setSuccess (eq passCount 3)}}{{end}}{{end}}{{end}}'


