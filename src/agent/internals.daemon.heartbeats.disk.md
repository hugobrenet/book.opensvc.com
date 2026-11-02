<!-- llms: The hb.disk driver, heartbeats written on a shared disk: its configuration, behavior and on-disk format. -->
# hb.disk

This driver reads and writes on a dedicated disk, using `O_DIRECT|O_SYNC|O_DSYNC` open flags on a block device on Linux.

## Configuration

    [hb#2]
    type = disk
    dev = /dev/mapper/3123412312412414214
    timeout = 15

### Behavior

- The Rx thread loops over peer nodes and for each reads its heartbeat data at its reserved slot device offset
- The Tx thread writes to its reserved slot offset on the device

### On-disk format

When the tx and rx threads are started or reconfigured, they parse a metadata segment at the head of the device and prepare a `<nodename>:<slot index>` hash.

The metadata zone maximum size is 4MB.

A node metadata slot size is 4k, and contains the cluster node name.

Limits:
* 1000 nodes (metadata zone size/slot meta data size)
* nodenames are limited to 4k characters (slot meta data size)
* A `<n>`-nodes cluster requires a `(<n>+1)*4MB` device
* The heartbeat data (which is gziped) must not exceed 4MB (slot size). A 10 services cluster usually produces ~3k messages.

If the local nodename is not found in any slot, the thread allocates one.
