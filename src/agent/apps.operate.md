<!-- llms: Operating applications: assessing the cluster and service states, reading resource info, selecting objects, running actions and following them. -->
# Operate Apps

Usual operator actions covered in this chapter are:

* Assess the state of the cluster and its hosted applications, troubleshoot warnings, post-mortem analysis.
* Start, stop, relocate one service or a selection of services to fix warning causes, prepare hardware or operating system maintenance

The chapter follows that order:

* [Assess](apps.operate.status.md) — reading cluster and service state, and the
  markers `om mon` uses to pack it densely.
* [Resource Info](apps.operate.info.md) — the key-values each resource
  publishes about what it is made of.
* [Select](apps.operate.select.md) — naming the objects you want to act on,
  from one path to an expression matching many.
* [Action](apps.operate.action.md) — running the action, and what to do when it
  fails.
