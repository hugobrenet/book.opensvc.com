<!-- llms: The hb.unicast driver, heartbeats sent over TCP unicast: its basic and advanced configuration and its behavior. -->
# hb.unicast

The hb.unicast driver sends and receives using TCP unicast packets.

## Basic Configuration

    [hb#1]
    type = unicast

### Behavior with Basic Configuration

- The Rx thread listens on `0.0.0.0:10000`
- The Tx thread sends to `<nodename>:10000`

## Advanced Configuration

A more precise definition allows specifying network interfaces, addresses, and ports for each node:

    [hb#1]
    type = unicast
    intf@node1 = eth0
    intf@node2 = eth2
    addr@node1 = 1.2.3.4
    addr@node2 = 1.2.3.5
    port@node1 = 10001
    port@node2 = 10002
    timeout = 15s

Note the driver accepts to use the same port for every node:

    port = 10001

Proper configuration of the `hb.unicast` driver ensures reliable communication between cluster nodes by leveraging TCP unicast.
