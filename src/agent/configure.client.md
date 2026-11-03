<!-- llms: The ox client, which manages clusters through their API from another host: its contexts, login, terminal UI and command line. -->
# Cluster API Client

The `ox` program uses only the agent API and mirrors the `om` commandset, which makes it suitable for managing one or more clusters from a tiers linux box.

## Configure remotes

The remotes configuration is stored in JSON format in the `~/.config/opensvc/contexts.json` file.

A context names a cluster to talk to and a user to talk as. Clusters and users are defined once and referenced by name, so several contexts can share them.

Example:

	{
	  "clusters": {
	    "dreamy-leopard": {
	      "server": "https://dreamy-leopard.example.com:1215",
	      "insecure": true
	    },
	    "bold-rat": {
	      "server": "https://bold-rat.example.com:1215"
	    }
	  },
	  "users": {
	    "john": {},
	    "mary": {}
	  },
	  "contexts": {
	    "john@dreamy-leopard": {
	      "cluster": "dreamy-leopard",
	      "user": "john"
	    },
	    "mary@bold-rat": {
	      "cluster": "bold-rat",
	      "user": "mary",
	      "namespace": "prod",
	      "access_token_duration": "1h",
	      "refresh_token_duration": "1d"
	    }
	  }
	}

The file holds no password. Authentication is by JSON Web Token: `ox context login` exchanges a password for tokens once, and the tokens are cached outside this file.

The commands below write the same file, and create it if it does not exist yet:

	$ ox context cluster add --name dreamy-leopard --server https://dreamy-leopard.example.com:1215 --insecure
	$ ox context user add --name john
	$ ox context add --name john@dreamy-leopard --cluster dreamy-leopard --user john

### Context keys

| Key | Description |
| --- | --- |
| `cluster` | The name of the cluster definition to connect to. Required. |
| `user` | The name of the user definition to connect as. Required. |
| `namespace` | Restrict the session to this namespace. The tokens are then granted for it alone. |
| `access_token_duration` | How long an access token stays valid. The access token is the one sent with each request, so a short duration limits what a leaked one is worth. |
| `refresh_token_duration` | How long the session can be renewed without typing the password again. When it expires, `ox context login` has to be run again. |

Durations are written as a number and a unit, for example `1h` or `1d`. The
units are `d`, `h`, `m` and `s`, and several can be combined, as in `1d12h`.

## Login

`ox context login` requests the tokens and caches them.

	$ ox context login --context john@dreamy-leopard
	Password for john@dreamy-leopard: 
	Login successful. Switch to this context with :
	export OSVC_CONTEXT=john@dreamy-leopard

Called with no context, it offers a menu of the configured ones.

When the standard input is not a terminal, the password is read from it instead of being asked for. This is how a script logs in without putting the password on a command line, where the process table would show it to every user of the machine, or in an environment variable, which every child process inherits:

	# from a password manager
	$ pass show opensvc/john | ox context login --context john@dreamy-leopard

	# from a file only this user can read
	$ ox context login --context john@dreamy-leopard < ~/.config/opensvc/john.password

	# from a variable already held by the shell, without a file
	$ ox context login --context john@dreamy-leopard < <(printf %s "$password")

The password is the first line, and a trailing newline is not part of it.

The context cannot be picked from a menu in that case, since the menu is read on the terminal the password is no longer typed on: name it with `--context` or with the `OSVC_CONTEXT` environment variable.

`ox context list` shows the configured contexts and the state of their tokens:

	$ ox context list
	NAME                 AUTHENTICATED  ACCESS_EXPIRE  REFRESH_EXPIRE  AUTHENTICATED_AT  
	john@dreamy-leopard  false          -              -               -                 
	mary@bold-rat        false          -              -               -                 

`ox context logout` drops the cached tokens.

## Terminal UI

At this point, executing `ox` with no argument launches the Terminal User Interface, and offers a context selector dialog.

The `h` keypress displays a help page.

## Commandline UI

    # Set a context
    # -------------
	$ export OSVC_CONTEXT=john@dreamy-leopard


    # Manage like om
    # --------------
	$ ox cluster get --kw cluster.name
	dreamy-leopard 

	$ ox node ls
	NAME                  AGENT STATE
	dreamy-leopard-node-1 3.0.0 idle
	dreamy-leopard-node-2 3.0.0 idle
	dreamy-leopard-node-3 3.0.0 idle

	$ ox svc ls
	OBJECT AVAIL OVERALL 
	svc2   down  down    
	svc1   down  down
