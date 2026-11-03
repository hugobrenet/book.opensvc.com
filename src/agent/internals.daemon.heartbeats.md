<!-- llms: Heartbeats: their configuration and reconfiguration, timeouts, dropping one, monitoring, and their transmit and receive threads. -->
# Heartbeats

Heartbeats serve the following purposes:

- Exchange data between cluster nodes.
- Detect stale nodes.
- Execute the quorum race when a peer becomes stale.

OpenSVC supports multiple parallel running heartbeats. Exercising different code paths and infrastructure data paths (network and storage switches and site interconnects) helps limit split-brain situations.

## Configuration

Heartbeats are declared in `/etc/opensvc/cluster.conf`, each in a dedicated section named `[hb#<n>]`. A heartbeat definition should work on all nodes, using scoped keywords if necessary, as the definitions are served by the joined node to the joining nodes.

### Reconfiguration

Any command that changes the timestamp of the following configuration files triggers a reconfiguration of heartbeats:

- `/etc/opensvc/node.conf`
- `/etc/opensvc/cluster.conf`

### Actions Taken During Reconfiguration:

- Any updated parameters are applied to the heartbeats.
- Heartbeats removed from the configuration are stopped.
- Heartbeats newly defined in the configuration are started.

### Set a Heartbeat Timeout

To set a timeout for the `hb#1` heartbeat, use this command:

```
om cluster config update --set hb#1.timeout=20
```

### Drop a Heartbeat

To delete the `hb#1` heartbeat from the configuration:

```
om cluster config update --delete hb#1
```

## Monitoring

Each heartbeat runs two threads: `tx` and `rx`.

The `om mon` command display the heartbeats status, statistics, and each peer state.

<head>
<style type="text/css">
.ansi2html-content { display: inline; white-space: pre-wrap; word-wrap: break-word; }
.body_foreground { color: #AAAAAA; }
.body_background { background-color: #000000; }
.inv_foreground { color: #000000; }
.inv_background { background-color: #AAAAAA; }
.ansi1 { font-weight: bold; }
.ansi32 { color: #00aa00; }
.ansi33 { color: #aa5500; }
.ansi90 { color: #7f7f7f; }
.ansi91 { color: #ff0000; }
.ansi92 { color: #00ff00; }
.ansi93 { color: #ffff00; }
.ansi94 { color: #5c5cff; }
</style>
</head>
<pre class="ansi2html-content">
<code class="hljs">
Threads                                <span class="ansi1">n1</span>        <span class="ansi1">n2</span>        <span class="ansi1">n3</span>        
 <span class="ansi1">...</span>
 <span class="ansi1">hb</span>                                  |                                           <span class="ansi1">
  hb#1.rx</span>          <span class="ansi32">running</span> unicast   | <span class="ansi90">/</span>         <span class="ansi32">O</span>         <span class="ansi32">O</span>             <span class="ansi1">
  hb#1.tx</span>          <span class="ansi32">running</span> unicast   | <span class="ansi90">/</span>         <span class="ansi32">O</span>         <span class="ansi32">O</span>             <span class="ansi1">
  hb#2.rx</span>          <span class="ansi32">running</span> relay     | <span class="ansi90">/</span>         <span class="ansi32">O</span>         <span class="ansi32">O</span>             <span class="ansi1">
  hb#2.tx</span>          <span class="ansi32">running</span> relay     | <span class="ansi90">/</span>         <span class="ansi32">O</span>         <span class="ansi32">O</span>             
<span class="ansi1"> ...</span>
                                                                                 
</code>
</pre>                                                                                 

For the per-peer detail behind those markers, including which address or device
each heartbeat uses and when it last changed state:

```bash
om daemon hb status
```

    RUNNING  BEATING  ID        NODE    PEER    TYPE       DESC                          CHANGED_AT
    O        O        hb#1.rx   dev2n1  dev2n2  unicast    10.29.1.11:9994 ← 10.29.1.12  2026-08-28T21:23:43
    O        O        hb#1.tx   dev2n1  dev2n2  unicast    → 10.29.1.12:9994             2026-08-28T21:23:43
    O        O        hb#12.rx  dev2n1  dev2n2  multicast  224.3.29.71:9996 ← *          2026-08-28T21:23:43
    O        O        hb#4.rx   dev2n1  dev2n2  disk       ← /dev/dm-21[9]               2026-08-28T21:23:47

`RUNNING` is whether the thread is alive, `BEATING` whether data is actually
flowing. A heartbeat can run and not beat, which is what you see when the peer
is gone or the path between them is broken.

Every node's view is reported, not just the local one, so a heartbeat beating
in one direction only is visible from either end.

The agent daemon automatically restarts heartbeat threads if they exit unexpectedly.

## Heartbeat Thread Pair

### Tx (Transmit)

The Tx thread handles the transmission of the node data:

- Regularly transmit data or send it as soon as changes occur.
- Data is encrypted.

### Rx (Receive)

The Rx thread manages data reception and integration into cluster data:

- Regularly read data from disk or receive it in response to transmissions (unicast/multicast).
- Update peer data in the cluster.
- Timeout if no heartbeat is received within the configured {{#include ../inc/kw}}`<hb#n>.timeout`. The default timeout is 15 seconds.

The configured timeout is a floor rather than the last word. A timeout shorter than
the beats it has to cover would declare a peer stale that is merely one beat late,
so the unicast, disk and relay drivers raise it when it is too short for their
interval:

| Driver | Minimum timeout | Missed beats tolerated |
| :--- | :--- | :--- |
| `hb.unicast`, `hb.disk` | `interval * 2 + 1s` | 1 |
| `hb.relay` | `interval * 4 + 1s` | 3 |

The relay is the one reached over a network the cluster does not own, and the one
whose beats are paced to the interval rather than sent on every change, so it is
given the wider margin. The adjustment, when it happens, is logged as the heartbeat
is configured:

    daemon: hb: relay: hb#2: configure: reajust timeout: 15s => 4m1s (<interval>*4+1s)

Actions Performed by Rx:

- On receive data:
  - Merge updated peer data to maintain accurate cluster data.
  - Publish the received events on the local event bus.
- On receive timeout:
  - Publish a `HbStale` event 
  - Purge stale peer data if:
    - **No Maintenance Advertised:** Immediately purge stale peer data.
    - **Maintenance Advertised:** Wait for the `node.maintenance grace_period` before purging.

