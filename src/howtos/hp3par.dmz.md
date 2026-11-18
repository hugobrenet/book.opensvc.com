<!-- llms: HPE 3PAR Remote Copy failover for a cluster in a DMZ, through an ssh bastion whose forced command passes on only the Remote Copy commands, the array credentials kept on the bastion. -->
HPE 3PAR Remote Copy from a DMZ
---

# Introduction

A cluster whose nodes sit in a DMZ fails over a service replicated by a 3PAR Remote Copy group, with a `disk.hp3par` resource, while the array lives in an inner zone the DMZ nodes must not reach, and whose credentials they must not hold.

The `proxy` method of v2 answered this with a node of the inner zone serving the commands of the DMZ nodes. OpenSVC v3 does not port it: the `ssh` method does the same with standard tools. The `manager` the DMZ nodes reach is a bastion of the inner zone, whose authorized key forces a command, a gate, which passes on to the array the Remote Copy commands it allows, and nothing else.

```text
DMZ node ──ssh, port 22──▶ bastion ──ssh──▶ 3PAR array
          key of the node   forced command  key of the bastion
                            gate: allow-list
```

What the DMZ node holds is a key the bastion accepts from its address only, for the gate only. The array credentials stay on the bastion.

# The commands OpenSVC sends

A failover, a takeover, a start, a stop, a sync and the status of a `disk.hp3par` resource send these commands, `<group>` being the `group` of the resource:

```text
showrcopy groups -csvtable -nohdtot
showrcopy targets -csvtable -nohdtot
setrcopygroup failover -f -waittask <group>
setrcopygroup reverse -f -waittask <group>
setrcopygroup reverse -f -current -stopgroups -waittask <group>
setrcopygroup reverse -f -local -current -waittask <group>
setrcopygroup reverse -f -natural -stopgroups -waittask <group>
setrcopygroup reverse -f -stopgroups -waittask <group>
startrcopygroup -wait <group>
stoprcopygroup -f <group>
syncrcopy -w <group>
```

The inventory a node pushes to the collector, `om node push array`, sends `showsys`, `showvv`, `showport`, `showcpg`, `shownode`, `showversion` and `showlicense` too: leave them out of the gate of the DMZ nodes, and push the inventory from a node of the inner zone.

# On the array

Create a user the bastion connects as, with the narrowest role allowing the Remote Copy operations above, in the domain of the replicated volumes if the array uses domains. Even a gate letting a command through by mistake can then do no more than this user.

Authorize the public key of the bastion for this user, as the 3PAR documentation of `setsshkey` describes.

# On the bastion

## The gate

Install the gate as `/usr/local/sbin/hp3par-gate`, owned by root, mode `0755`. It takes the Remote Copy groups the key may act on as arguments, refuses any command not in the allow-list, logs what it passes on and what it refuses, and runs the command on the array.

```bash
#!/bin/bash
# hp3par-gate <group>...
#
# The forced command of the keys of the DMZ nodes: passes on to the array the
# Remote Copy commands of the groups given, refuses anything else.
set -u

ARRAY=3par1.inner.mycorp
ARRAY_USER=osvcrc
ARRAY_KEY=/etc/hp3par-gate/array_key

cmd=${SSH_ORIGINAL_COMMAND:-}
log() { logger -t hp3par-gate -- "${SSH_CLIENT%% *}: $*"; }
refuse() { log "refused: $cmd"; echo "hp3par-gate: refused: $cmd" >&2; exit 1; }

# A command is words of letters, digits and the -, _ and . of the options
# and group names: no shell, no path, no redirection.
[[ $cmd =~ ^[A-Za-z0-9_.\ -]+$ ]] || refuse

group_allowed() {
	local g
	for g in "${ALLOWED[@]}"; do
		[[ $g == "$1" ]] && return 0
	done
	return 1
}

ALLOWED=("$@")
G='([A-Za-z0-9_.-]+)'
case "$cmd" in
"showrcopy groups -csvtable -nohdtot" | "showrcopy targets -csvtable -nohdtot")
	;;
*)
	if [[ $cmd =~ ^setrcopygroup\ failover\ -f\ -waittask\ $G$ ]] ||
		[[ $cmd =~ ^setrcopygroup\ reverse\ -f(\ -local)?(\ -current)?(\ -natural)?(\ -stopgroups)?\ -waittask\ $G$ ]] ||
		[[ $cmd =~ ^startrcopygroup\ -wait\ $G$ ]] ||
		[[ $cmd =~ ^stoprcopygroup\ -f\ $G$ ]] ||
		[[ $cmd =~ ^syncrcopy\ -w\ $G$ ]]; then
		group=${BASH_REMATCH[-1]}
		group_allowed "$group" || refuse
	else
		refuse
	fi
	;;
esac

log "passed: $cmd"
exec ssh -o BatchMode=yes -o ConnectTimeout=10 -i "$ARRAY_KEY" "$ARRAY_USER@$ARRAY" "$cmd"
```

The private key of the array user is `/etc/hp3par-gate/array_key`, readable by the user the DMZ nodes connect as only. The bastion keeps the host key of the array in its `known_hosts`.

## The keys of the DMZ nodes

Create a user the DMZ nodes connect as, `osvcgate` here, and authorize the public key of each DMZ node in its `~/.ssh/authorized_keys`, from the address of the node only, for the gate only, with the groups of the services the node runs:

```text
from="192.0.2.11",restrict,command="/usr/local/sbin/hp3par-gate rcg_app1 rcg_app2" ssh-ed25519 AAAA... dmz-node-1
from="192.0.2.12",restrict,command="/usr/local/sbin/hp3par-gate rcg_app1 rcg_app2" ssh-ed25519 AAAA... dmz-node-2
```

`restrict` turns off the port, agent and X11 forwarding and the pty, and `command` runs the gate whatever the node asks for, the command the node sent being in `SSH_ORIGINAL_COMMAND`.

Open the port 22 of the bastion to the DMZ nodes, and nothing of the array.

# On the cluster

Declare the array with the `ssh` method, its `manager` the bastion, its `username` the user of the gate, and its `key` the private key of the DMZ nodes, a path on the nodes or a key of a datastore of the `system` namespace:

<div class="tabs">
<div class="tab" data-title="CLI">

```sh
om cluster config update \
	--set array#3par1.type=hp3par \
	--set array#3par1.method=ssh \
	--set array#3par1.manager=bastion.inner.mycorp \
	--set array#3par1.username=osvcgate \
	--set array#3par1.key=/root/.ssh/id_hp3par_gate
```

</div>
<div class="tab" data-title="API">

```sh
curl -s -X PATCH -H "Authorization: Bearer $TOKEN" -G \
  --data-urlencode 'set=array#3par1.type=hp3par' \
  --data-urlencode 'set=array#3par1.method=ssh' \
  --data-urlencode 'set=array#3par1.manager=bastion.inner.mycorp' \
  --data-urlencode 'set=array#3par1.username=osvcgate' \
  --data-urlencode 'set=array#3par1.key=/root/.ssh/id_hp3par_gate' \
  "https://<node>:1215/api/cluster/config"
```

</div>
</div>

```ini
[array#3par1]
type = hp3par
method = ssh
manager = bastion.inner.mycorp
username = osvcgate
key = /root/.ssh/id_hp3par_gate
```

The `disk.hp3par` resources of the services name the array and their group as before:

```ini
[disk#rcg]
type = hp3par
array = 3par1
group = rcg_app1
```

The ssh client of the `ssh` method runs with `-o BatchMode=yes -o ConnectTimeout=10`: it never prompts, for a password or a host key it does not know, and gives up a bastion it can not reach in 10 seconds, so a failover fails rather than hangs. Add the host key of the bastion to the `known_hosts` of root on every DMZ node before the first failover.

A configuration still naming `method = proxy` is refused by the validation, which names this replacement.

# Verify

From a DMZ node, a command of the allow-list on a group of the key reaches the array:

```sh
ssh -o BatchMode=yes -i /root/.ssh/id_hp3par_gate osvcgate@bastion.inner.mycorp \
	"showrcopy groups -csvtable -nohdtot"
```

and anything else is refused, and logged on the bastion:

```sh
ssh -o BatchMode=yes -i /root/.ssh/id_hp3par_gate osvcgate@bastion.inner.mycorp "showsys"
hp3par-gate: refused: showsys
```

Then read the status of the resource, which runs the `showrcopy` commands through the gate:

```sh
om <path> instance status -r
```
