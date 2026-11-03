<!-- llms: The lifecycle of the agent daemon: enable, boot, shutdown, stop, restart, rejoin, run, and its watchdog. -->
# Agent Daemon Lifecycle

## Enable

    sudo systemctl enable --now opensvc-server

🛈 Newly installed daemons are not enabled by default.

## Boot

    om daemon start

* Executed on server boot.
* After reaching the multi-user target.

Side Effects:

* HA services in down state start a local instance.
* Standby resources of all services are started.

🛈 Administrators can prevent these side effects on boot setting the `osvc.freeze` option in the kernel boot command line.

## Shutdown

    om daemon shutdown

* Executed on server shutdown.
* The daemon drains all service instances running on the node.
* The peer nodes are free to takeover a HA service as soon as its local instance is drained.

## Stop

    om daemon stop

* Announces a maintenance period.
* The service instances running on the node are not stopped.
* Peer nodes wait for `node.maintenance_grace_period` before taking over, expecting the daemon to restart.

🛈 The mainteance period ends as soon as the daemon restarts.

## Restart

    om daemon restart

A restart is a simple stop-start sequence:

* Maintenance period is announced
* Peer nodes wait for the daemon to restart without taking over.

A restart does not freeze the node, nor its peers, even when the daemons of
all the nodes restart at once, as with `om daemon restart --node='*'`: the
maintenance period is what keeps the peers from acting while a restart rolls.

## Rejoin

A starting daemon waits for its peers, `node.rejoin_grace_period` at most,
before orchestrating. It freezes the node on its own in two cases only, both
saying something went wrong:

* A peer is still out of reach when the rejoin grace period expires: the node
  may be split from the others, and does not orchestrate blind.
* The server booted with the `osvc.freeze` option on the kernel command line.

A node that was down misses the freezes asked meanwhile. When it comes back,
it adopts a freeze of the whole cluster, `om cluster freeze`, and of a whole
object, `om <path> freeze`, if a peer took it while the node was down:

    the cluster was frozen while this daemon was down (peer n1 frozen): local node has been frozen

It adopts no other freeze. A peer frozen alone, with `om node freeze` or
`om <path> instance freeze --node <peer>`, stays the only one frozen, as does a
peer the daemon froze on its own, for a drain, at boot, or at the end of its
rejoin grace period.

The node and instance statuses say which a freeze is, next to `frozen_at`:
`frozen_scope` is `cluster` or `node` for a node, `object` or `instance` for an
instance. A freeze adopted is a freeze of the node or of the instance: it is
not adopted again from there.

🛈 OpenSVC v2 adopted any freeze a peer took while the node was down, so a
node frozen for maintenance froze its peers as they rebooted.

## Run

    om daemon run

* Runs a daemon in foreground
* Logs are printed on the console
* Stacks are printed on the console

🛈 Useful for debugging.

## Watchdog

* The daemon sends a periodic probe to systemd.
* If the daemon hangs, the probe flow stops, and systemd kill-restart the daemon.

🛈 The daemon event bus hangs are detected internally and cause the watchdog probe flow to stop.


