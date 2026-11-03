<!-- llms: How quorum breaks the tie when every heartbeat to a peer goes stale: arbitrators vote, and a node without a majority stops. -->
# Quorum

When every heartbeat to a peer goes stale, a node cannot tell whether that peer
died or is merely isolated from it. Both look identical from where it stands,
and the two call for opposite reactions: take the services over, or leave them
alone because the peer is still running them.

Quorum is the tie-breaker. Arbitrators, sitting outside the cluster
interconnect, are asked who they can still see, and a node that finds itself in
the smaller half stops rather than risk running a service its peer is also
running.

Enabling quorum, sizing the arbitrators and testing them is covered in
[Cluster Quorum](configure.quorum.md). The two examples below work through the
arithmetic on real cluster shapes:

* [Example 1: Odd-nodes cluster](internals.daemon.quorum.example1.md)
* [Example 2: Even-nodes cluster](internals.daemon.quorum.example2.md)
