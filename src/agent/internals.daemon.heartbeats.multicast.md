<!-- llms: The hb.multicast driver, heartbeats sent over UDP multicast: its basic and advanced configuration and its behavior. -->
# hb.multicast

The hb.multicast driver sends and receives using UDP multicast packets.

## Basic Configuration

    [hb#2]
    type = multicast

### Behavior with Basic Configuration

- The Rx thread listens on all interfaces on port `10000`
- The Tx thread sends to `224.3.29.71:10000`

## Advanced Configuration

A more precise definition allows specifying network interfaces, addresses, and ports for each node:

    [hb#2]
    type = multicast
    intf@node1 = eth0
    intf@node2 = eth2
    addr = 224.3.29.71
    port = 10001
    timeout = 15

The `addr` and `port` keywords are not scopable.
