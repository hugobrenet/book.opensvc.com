<!-- llms: The subsystems of the daemon, events, heartbeats, lifecycle, quorum and scheduler: their role and policies. -->
# Daemon

This chapter explores the role and policies of daemon subsystems, providing a detailed look at their function within the system architecture. You’ll also learn best practices for daemon administration, including configuration, monitoring, and troubleshooting.

---

- [Events](internals.daemon.events.md)
- [Heartbeats](internals.daemon.heartbeats.md)
  - [hb.unicast](internals.daemon.heartbeats.unicast.md)
  - [hb.multicast](internals.daemon.heartbeats.multicast.md)
  - [hb.disk](internals.daemon.heartbeats.disk.md)
  - [hb.relay](internals.daemon.heartbeats.relay.md)
- [Lifecycle](internals.daemon.lifecycle.md)
- [Quorum](internals.daemon.quorum.md)
  - [Quorum example 1](internals.daemon.quorum.example1.md)
  - [Quorum example 2](internals.daemon.quorum.example2.md)
- [Scheduler](internals.daemon.scheduler.md)

