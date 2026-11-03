<!-- llms: The scheduler of the agent: schedule definitions, policies, the node and service schedules, event-triggered runs, and examples. -->
# Scheduler

The OpenSVC agent includes a scheduler that manages jobs for both the node and each individual service.

## Basic Schedule Definition

The schedule constraints are defined by allowed time ranges and minimum execution interval. An example schedule definition is `00:00-02:00@121m`. In this example:

- **Time Range:** From midnight to 2:00 AM.
- **Interval:** 121 minutes.

Multiple schedule definitions can be specified using the syntax:

```json
["00:00-02:00@121", "12:00-14:00@121"]
```

Execution is permitted if any one of the defined constraints is satisfied.

## Policies

If an allowed time range is longer than the interval, multiple executions happen in the time range.

If not specified, the default interval is the duration of the time range, so there is only one execution of the job during the time range.

If not specified, the default time range is unrestricted. In this case a period must be specified.

If the definition begins with a `~`, the execution is delayed randomly in the allowed time range. The probability of execution increases linearly as time progresses within the allowed time range. For instance:

- At the beginning of the time range (`00:00` in `00:00-02:00`), the probability might be around 10%.
- Near the end of the time range (`01:50`), the probability reaches 100%.

This behavior ensures that the execution of job reporting information to the collector is spread across all nodes throughout the entire time range, leveling the load on the central collector. This approach prevents sudden spikes in load.

## Node Scheduler

    $ om node schedule list -o +KEY:data.key
    NODE  ACTION           LAST_RUN_AT                NEXT_RUN_AT           SCHEDULE      KEY                       
    n1    pushasset        2025-01-27T05:57:06+01:00  0001-01-01T00:00:00Z  ~00:00-06:00  asset.schedule            
    n1    checks           2025-01-27T01:54:15+01:00  0001-01-01T00:00:00Z  ~00:00-06:00  checks.schedule           
    n1    compliance_auto  2025-01-27T02:00:00+01:00  0001-01-01T00:00:00Z  02:00-06:00   compliance.schedule       
    n1    pushdisks        2025-01-27T04:56:30+01:00  0001-01-01T00:00:00Z  ~00:00-06:00  disks.schedule            
    n1    pushpkg          2025-01-27T18:59:54+01:00  0001-01-01T00:00:00Z  @1m           packages.schedule         
    n1    pushpatch        2025-01-27T04:58:22+01:00  0001-01-01T00:00:00Z  ~00:00-06:00  patches.schedule          
    n1    sysreport        0001-01-01T00:00:00Z       0001-01-01T00:00:00Z  ~00:00-06:00  sysreport.schedule        
    n1    dequeue_actions  0001-01-01T00:00:00Z       0001-01-01T00:00:00Z                dequeue_actions.schedule  
    n2    pushasset        2025-01-29T00:35:49+01:00  0001-01-01T00:00:00Z  ~00:00-06:00  asset.schedule            
    n2    checks           2025-01-29T00:10:39+01:00  0001-01-01T00:00:00Z  ~00:00-06:00  checks.schedule           
    n2    compliance_auto  2025-01-29T02:00:00+01:00  0001-01-01T00:00:00Z  02:00-06:00   compliance.schedule       
    n2    pushdisks        2025-01-29T05:14:15+01:00  0001-01-01T00:00:00Z  ~00:00-06:00  disks.schedule            
    n2    pushpkg          2025-01-29T05:33:22+01:00  0001-01-01T00:00:00Z  ~00:00-06:00  packages.schedule         
    n2    pushpatch        2025-01-29T00:42:55+01:00  0001-01-01T00:00:00Z  ~00:00-06:00  patches.schedule          
    n2    sysreport        2025-01-29T03:08:18+01:00  0001-01-01T00:00:00Z  ~00:00-06:00  sysreport.schedule        
    n2    dequeue_actions  0001-01-01T00:00:00Z       0001-01-01T00:00:00Z                dequeue_actions.schedule  
    n3    pushasset        2025-01-29T04:50:18+01:00  0001-01-01T00:00:00Z  ~00:00-06:00  asset.schedule            
    n3    checks           2025-01-29T05:17:24+01:00  0001-01-01T00:00:00Z  ~00:00-06:00  checks.schedule           
    n3    compliance_auto  2025-01-29T02:00:00+01:00  0001-01-01T00:00:00Z  02:00-06:00   compliance.schedule       
    n3    pushdisks        2025-01-29T05:10:43+01:00  0001-01-01T00:00:00Z  ~00:00-06:00  disks.schedule            
    n3    pushpkg          2025-01-29T03:07:57+01:00  0001-01-01T00:00:00Z  ~00:00-06:00  packages.schedule         
    n3    pushpatch        2025-01-29T05:36:14+01:00  0001-01-01T00:00:00Z  ~00:00-06:00  patches.schedule          
    n3    sysreport        2025-01-29T00:34:02+01:00  0001-01-01T00:00:00Z  ~00:00-06:00  sysreport.schedule        
    n3    dequeue_actions  0001-01-01T00:00:00Z       0001-01-01T00:00:00Z                dequeue_actions.schedule  

The scheduled jobs can be configured in `/etc/opensvc/node.conf` with a configlet like:

	[<section>]
	<parameter> = <definition>

The `KEY` column in the above command output is formatted as:

	<section>.<parameter>

And the current definition, explicit or implicit, is visible in the `SCHEDULE` column. Empty means never scheduled.

The `om node` command action executed when the job fires is displayed in the `ACTION` column.

The node supports the following jobs:

* Node inventoring tasks : `pushasset` `pushpatch` `pushpkg` `pushdisks`
* Node performance metrics inventoring : `pushstats`
* Node performance metrics collection : `collect_stats`
* Node file content tracking task : `sysreport`
* Node configuration audit and/or remediation task : `compliance_auto`
* Health checking task : `checks`
* Scheduled node reboot task : `auto_reboot`
* Scheduled root password rotation task : `auto_rotate_root_pw`
* Execution of node actions queued by the collector : `dequeue_actions`
* SAN switches inventoring tasks : `pushswitch`, one per `switch#<name>` section
* Storage arrays inventoring tasks : `pusharray`, one per `array#<name>` section
* Backup servers saves index inventoring tasks : `pushnsr`


## Service Scheduler

    $ om tflex schedule list
    OBJECT  NODE    ACTION           KEY              LAST_RUN_AT                NEXT_RUN_AT                SCHEDULE    
    tflex   dev2n1  status           status_schedule  2025-01-30T11:54:55+01:00  2025-01-30T12:04:55+01:00  @10m        
    tflex   dev2n1  compliance_auto  comp_schedule    2025-01-27T00:09:18+01:00  0001-01-01T00:00:00Z       ~00:00-06:00
    tflex   dev2n1  run              task#1.schedule  2025-01-28T16:27:16+01:00  2025-01-30T16:27:16+01:00  @2d         
    tflex   dev2n1  run              task#2.schedule  2025-01-29T16:27:08+01:00  2025-01-30T16:27:08+01:00  @1d         
    tflex   dev2n1  run              task#3.schedule  2025-01-29T16:27:08+01:00  2025-01-30T16:27:08+01:00  @1d         
    tflex   dev2n1  info             info_schedule    2025-01-27T18:56:47+01:00  0001-01-01T00:00:00Z       @60m        

The scheduled jobs can be configured in the service configurations with a configlet like:

	[<section>]
	<parameter> = <definition>

The `KEY` column in the above command output is formatted as:

	<section>.<parameter>

And the current definition, explicit or implicit, is visible in the `SCHEDULE` column. Empty means never scheduled.

The `om <path>` command action executed when the job fires is displayed in the `ACTION` column.

The supported jobs are:

* Service configuration audit and/or remediation : `compliance_auto`
* Service resources key-values inventoring : `info`
* Service resources monitoring : `resource_monitor`
* Service status evaluation : `status`
* Service tasks execution : `run`
* Service data sync and snapshots : `update`

The `info` job only refreshes a cache local to the instance. Reporting the
key-values to the collector is the collector speaker's job, done on its own
schedule, so this job does not talk to the collector itself.

## Event-triggered Runs

A task can also run on events of its node, rather than at a time. The `on`
keyword lists the events, each one an event kind and the values of the fields
it requires, as an [event filter](internals.daemon.events.md#filtering) does:

```ini
[task#refresh]
type = host
install = fs#1
on = NetworkPeersUpdated
pace = @30s backoff @1m
```

The kinds are:

* `NetworkPeersUpdated`, with the fields `node` and `name`: a node joined or
  left a network of the node, the address of a node changed, or the tunnel to
  it. `NetworkPeersUpdated,name=backend1` runs on the changes of `backend1`
  only.
* `FileInstalled`, with the fields `node`, `path` and `rid`: an install of a
  resource of the object wrote files, whatever ran it, a start, a provision, a
  task or a change of a key. An install finding its files up to date publishes
  none. The events of the other objects are not the task's.

`pace` paces the runs, as `@<interval>[ backoff @<max>]`, `@10s` when unset.
The task runs at the first event, then once at most each interval: the events
coming during an interval run it once, at its end. With `backoff`, each
interval ending with such a run doubles the next one, up to `<max>`, and each
interval passing without an event halves it back. A node joining publishes one
`NetworkPeersUpdated` per network, and the task runs twice, not once per
network.

The event runs require what the scheduled runs require, the instance
provisioned and `run_requires`, and run whether the instance is frozen or not,
as the scheduled runs do. A task can have both a `schedule` and `on`.

A run the events asked for is the last run of the task, as a scheduled one is:
`schedule list` shows it in `LAST_RUN_AT`, with the events and the pace in
`ON` and `PACE`, and the scheduled run is planned from it, the work it would
do being done. A `schedule` then is the net catching the events missed: with
`@1h`, the task runs at most an hour after its last run, whatever ran it. A run
the events asked for and skipped, the instance not provisioned for example, is
no run.

### Installing files again

A task's `install` keyword installs the files of volumes and filesystems again
before the task's own work, as the `install` action does for them. A task of
any type may set it, and a host task setting it needs no `command`. A failed
install is a failed run, the task's own work not done.

With `on = NetworkPeersUpdated`, the files a [template](apps.design.datastores.md#templates)
renders from the networks of the node follow them. The install publishes a
`FileInstalled` event when it wrote files, on which a second task has what
reads them read them again:

```ini
[task#reload]
type = host
container = container#app
command = app reload
on = FileInstalled,rid=fs#1
```

A host task's `container` keyword runs its command in a container resource of
the service, whatever its runtime, rather than on the node. A container not up
is not run in: what the command acts on reads the files when it starts.

Splitting the work in two tasks keeps the reload for the installs that changed
something, whatever ran them: a change of a key the template read, a start, or
the refresh.

## Advanced Schedule Definition

	[!] <timeranges> [<days> [<weeks> [<months>]]]
	
	!
	  desc: exclusion pattern. ommiting the ! implies an inclusion
	
	<timeranges> := <timerange>[,<timerange>]
	  <timerange> := <begin>:<end>@<interval>
	    <begin> <end> := <hour>:<minute>
	    <interval>
	      type: integer
	      unit: minutes
	
	<days> := <day>[-<day>][,<day>[-<day>]]
	  <day> := <day_of_week>[:<day_of_month>]
	    <day_of_week>
	       * iso week day format
	         type: integer between 0 and 6
	       * literal format
	         type: string in ("mon", "tue", "wed", "thu", "fri", "sat",
	               "sun", "monday", "tuesday", "wednesday", "thursday",
	               "friday", "saturday", "sunday")
	    <day_of_month> := <literal> | +<nth> | -<nth> | <nth>
	       <nth>
	         type: integer
	       <literal>
	         type: string in ("first", "1st", "second", "2nd", "third",
	               "3rd", "fourth", "4th", "fifth", "5th", "last")
	
	<weeks> := <week>[-<week>][,<week>[-<week>]]
	  <week>
	    type: integer between 1 and 53
	
	<months> := <monthrange>[,<monthrange>]
	  <monthrange> := <month>[-<month>] | <month_filter>
	    <month>
	      * numeric month format
	        type: integer between 1 and 12
	      * literal format
	        type: string in ("jan", "feb", "mar", "apr", "may", "jun",
	              "jul", "aug", "sep", "oct", "nov", "dec", "january",
	              "february", "march", "april", "may", "june", "july",
	              "august", "september", "october", "november",
	              "december")
	    <month_filter> := %<modulo>[+<shift>]
	      <modulo>
	        type: integer
	      <shift>
	        type: integer

## Examples

* Never schedule

  Either ` `, or `@0`

* Always schedule

  `*`

* Schedule every 60 minutes

  `@60`

* Schedule at first occasion after 9am

  `09:00`

* Schedule every hour between midnight and 6am, every day

  `00:00-06:00@60`

* Schedule once between midnight and 2am, every day

  `00:00-02:00`

* Schedule once between midnight and 2am every last day of month

  `00:00-02:00@121 *:last` or `00:00-02:00@121 *:-1`

* Schedule once between midnight and 2am every last friday of month

  `00:00-02:00@121 fri:last` or `00:00-02:00@121 fri:-1`

* Schedule once between midnight and 2am every week day

  `00:00-02:00@121 mon-fri`

* Schedule once between midnight and 2am every week day from january to february

  `00:00-02:00@121 mon-fri * jan-feb`

* Schedule once between midnight and 2am every odd day (1, 3, 5)

  `00:00-02:00@121 *:%2+1`

* Schedule once between midnight and 2am every monday of even weeks

  `00:00-02:00@121 mon %2`

