<!-- llms: A worked example of quorum votes in a 3-node cluster over two sites with two arbitrators on a third: which nodes survive each failure. -->
# Example: odd-nodes cluster

        +-------------------------------------------+                                
        |  site3                                    |                                
        |                                           |                                
        |  +-------------+   +-------------+        |
        |  |             |   |             |        |
        |  | arbitrator1 |   | arbitrator2 |        |
        |  |             |   |             |        |
        |  +-------------+   +-------------+        |
        |                                           |                                
        +-------------------------------------------+                                
        
        +-------------------------------------------+     +------------------------------+
        | site1                                     |     |   site2                      |
        |                                           |     |                              |
        |    +--------------------------------------|-----|-----------------------+      |
        |    | cluster                              |     |                       |      |
        |    |                                      |     |                       |      |
        |    |    +-----------+    +-----------+    |     |   +-----------+       |      |
        |    |    |           |    |           |    |     |   |           |       |      |
        |    |    |   node1   |    |   node2   |    |     |   |   node3   |       |      |
        |    |    |           |    |           |    |     |   |           |       |      |
        |    |    +-----------+    +-----------+    |     |   +-----------+       |      |
        |    |                                      |     |                       |      |
        |    +--------------------------------------|-----|-----------------------+      |
        |                                           |     |                              |
        +-------------------------------------------+     +------------------------------+

* Total: 5 votes
* Majority: 3 votes

## Site1 Isolated

### node1 standpoint:

* live nodes: 2 (node1, node2)
* arbitrators votes: 0
* votes: 2

=> node does not have quorum, commits suicide

### node2 standpoint

* live nodes: 2 (node1, node2)
* arbitrators votes: 0
* votes: 2

=> node does not have quorum, commits suicide

### node3 standpoint

* live nodes: 1 (node3)
* arbitrators votes: 2
* votes: 3

=> node has quorum, does not commit suicide

## Site2 Isolated

### node1 standpoint

* live nodes: 2 (node1, node2)
* arbitrators votes: 2
* votes: 4

=> node has quorum, does not commit suicide

### node2 standpoint

* live nodes: 2 (node1, node2)
* arbitrators votes: 2
* votes: 4

=> node has quorum, does not commit suicide

### node3 standpoint

* live nodes: 1 (node3)
* arbitrators votes: 0
* votes: 1

=> node does not have quorum, commits suicide

## Node2 Dies

### node1 standpoint

* live nodes: 2 (node1, node3)
* arbitrators votes: 2
* votes: 4

=> node has quorum, does not commit suicide

### node3 standpoint

* live nodes: 2 (node1, node3)
* arbitrators votes: 2
* votes: 4

=> node has quorum, does not commit suicide

## Node2 and Node3 Die

### node1 standpoint

* live nodes: 1 (node1)
* arbitrators votes: 2
* votes: 3

=> node has quorum, does not commit suicide

