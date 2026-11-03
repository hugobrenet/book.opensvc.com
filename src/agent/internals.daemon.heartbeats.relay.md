<!-- llms: The hb.relay driver, heartbeats exchanged through a relay agent: its configuration, authentication, requirements, pacing, timeouts and retries. -->
# hb.relay

This driver implements a heartbeat mechanism by reading and writing on the memory of a dedicated OpenSVC agent relay host.

## Purpose

The `hb.relay` heartbeat is designed to prevent split-brain scenarios in a cluster by establishing a neutral, off-site communication check.

  * A relay should ideally be located in a **third site** that hosts **no other node** of the cluster.
  * This setup allows the cluster to make a correct quorum decision when the sites hosting the cluster nodes become disconnected from each other, but can still independently reach the relay's site.
  * The same relay host can be shared and used as a heartbeat mechanism by multiple different clusters.

## Configuration

The heartbeat is defined in the cluster configuration file (`cluster.conf`) within a `[hb#N]` section.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| **`type`** | String | Must be set to `relay`. |
| **`relay`** | String | The hostname or IP address of the remote OpenSVC relay agent. |
| **`timeout`** | Duration | The delay after which a peer that has not been read is declared stale. Raised when it is short for the interval, see below. Defaults to `9s`. |
| **`interval`** | Duration | The delay between two posts to the relay, and between two reads of a peer. Defaults to `4s`. |
| **`username`** | String | The username for authentication with the relay host. |
| **`password`** | String | A datastore key reference to a password used to authenticate with the relay API. (e.g., `from system/sec/relay key password`). |
| **`insecure`** | Boolean | Accept the relay certificate without verifying it. |

### Example

```ini
[hb#2]
type = relay
relay = relay3.opensvc.com
timeout = 15
username = relay
password = from system/sec/relay key password
```

### Authentication Note

The OpenSVC v3 relay configuration **no longer supports** the `secret` keyword. Authentication credentials must be specified exclusively using the `username` and `password` keywords.

## Requirements

  * **Reachability:** The relay listener (typically at `<address>:<port>`) must be **reachable** from all cluster nodes during normal operations.
  * **Version Compatibility:** OpenSVC v3 clusters **must** use an OpenSVC v3 relay agent.
  * **Arbitration:** The relay host **can** also be configured and used as a cluster arbitrator.

## Key Operations

The driver utilizes two primary threads for communication:

  * **The Transmission Thread (TX):**
      * This thread is responsible for **sending** the local cluster node's heartbeat data to the remote relay agent, updating its status in the relay's memory.
  * **The Reception Thread (RX):**
      * This thread constantly **loops** over all peer nodes in the cluster and for each one, **requests** its current heartbeat data from the relay agent. This data retrieval determines the peer's reachability.

## Pacing

The relay is a mailbox, not a bus. It holds **one message per node**, overwritten by
each post, and each peer reads it on its own schedule. Two consequences:

  * The transmitter posts once per `interval`, carrying the freshest data it has at
    that moment. Posting on every local change would overwrite mail no peer has read
    yet, at a cost the relay pays again for every cluster using it.
  * A change reaches a peer within two intervals at worst: up to one waiting for the
    local post, up to one more waiting for the peer to read it. A change that follows
    a quiet interval is posted at once, so a node that just started does not stay
    invisible for a whole interval.

The cluster data does not drift apart in the meantime. Every heartbeat message
carries all the changes the least advanced peer has not acknowledged yet, so a
message that supersedes another loses nothing, and a peer that finds a gap in the
sequence asks for a full resynchronization.

## Timeouts and retries

The receiver marks a peer alive when it reads a message the relay timestamped since
its last read. So a peer is seen alive once per `interval` at best, and a post that
fails costs a whole beat.

  * A failed post is retried a quarter of an interval later, or after the delay the
    relay asked for in a `Retry-After` header, whichever is longer. A transient
    refusal is repaired before the beat it would have cost.
  * `timeout` is raised to `interval * 4 + 1s` when it is configured shorter, so
    three missed beats are tolerated and the fourth declares the peer stale. A relay
    is reached over a network the cluster does not own, where one lost post is not
    news. The adjustment is logged when the heartbeat is configured:

        daemon: hb: relay: hb#2: configure: reajust timeout: 15s => 4m1s (<interval>*4+1s)

With the default interval of `4s`, the effective timeout is `17s` and a peer is
declared stale after three missed beats. With `interval = 60s`, it is `4m1s`.

## Rate Limiting on the Relay

A relay is an ordinary OpenSVC listener, and its rate limiter applies to the relay
API like to any other: it counts the requests of a client **address**, so all the
nodes of a cluster reaching it through one NAT share a bucket, as do several
clusters behind one address.

A refused request is answered `429 Too Many Requests` with a `Retry-After` header,
and the heartbeat waits at least that long before posting again. A relay serving
many clusters is worth watching through the listener metrics of the relay host:

```bash
om node metrics --node <relay> | grep rate_limiter
```

    opensvc_listener_rate_limiter_denied_total 0

That is the count of every refusal the listener made. The breakdown by route, and
the requests themselves, are on the relay host at `/metrics/api`, which is scraped
apart from `/metrics`.

