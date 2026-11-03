<!-- llms: The directories, executable files and configuration files the agent installs. -->
# Installed Items

## Directories

* `/etc/opensvc`           

    The cluster, node and objects configuration files.

* `/var/lib/opensvc`       

    The state files. Deleting or creating files in this directory can have undesired side-effects.

* `/var/tmp/opensvc`       

    Temporary files. Deleting or creating files in this directory can have undesired side-effects.

## Executable files

* `/usr/bin/om`

    This executable, installed by the `opensvc-server` package, implements:

    * The Cluster Resource Manager
    * The Cluster Monitor and API daemon
    * The local management commandline interface

* `/usr/bin/ox`

    This executable, installed by the `opensvc-client` package, implements:

    * The remote management commandline interface

## Configuration files

The agent configuration is the result of the merge of two `ini` configuration files:

* `/etc/opensvc/cluster.conf`

    This file is replicated on all cluster nodes.

* `/etc/opensvc/node.conf`

    This file is not replicated.

