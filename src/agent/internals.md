<!-- llms: Why the agent did something: where it installs its files, the ids it names its work with, and the daemon behind every cluster-wide behavior. -->
# Internals

This chapter is for when you want to know why the agent did something, not how
to ask it to do something.

* [Installed Files](internals.installed_files.md) — where the agent puts
  binaries, configurations, state and logs.
* [Daemon](internals.daemon.md) — the long-running process behind every
  cluster-wide behaviour:
  * [Events](internals.daemon.events.md) — the bus the daemon publishes to, and
    which `om node events` lets you watch.
  * [Heartbeats](internals.daemon.heartbeats.md) — how nodes decide their peers
    are alive.
  * [Lifecycle](internals.daemon.lifecycle.md) — startup, shutdown, and what
    survives a daemon restart.
  * [Quorum](internals.daemon.quorum.md) — what happens when the cluster splits.
  * [Scheduler](internals.daemon.scheduler.md) — the jobs the agent runs on its
    own, and how to reschedule them.
