<!-- llms: A worked example of quorum votes in a 2-node cluster over two sites with an arbitrator on a third: which node survives each failure. -->
# Example: even-nodes cluster

        +-------------------------------------------+                                
        |  site3                                    |                                
        |                                           |                                
        |  +-------------+                          |
        |  |             |                          |
        |  | arbitrator1 |                          |
        |  |             |                          |
        |  +-------------+                          |
        |                                           |                                
        +-------------------------------------------+                                
        
        +--------------------------+     +------------------------------+
        | site1                    |     |   site2                      |
        |                          |     |                              |
        |    +---------------------|-----|-----------------------+      |
        |    | cluster             |     |                       |      |
        |    |                     |     |                       |      |
        |    |    +-----------+    |     |   +-----------+       |      |
        |    |    |           |    |     |   |           |       |      |
        |    |    |   node1   |    |     |   |   node2   |       |      |
        |    |    |           |    |     |   |           |       |      |
        |    |    +-----------+    |     |   +-----------+       |      |
        |    |                     |     |                       |      |
        |    +---------------------|-----|-----------------------+      |
        |                          |     |                              |
        +--------------------------+     +------------------------------+

* Total: 3 votes
* Majority: 2 votes

## Site1 Isolated

### node1 standpoint

* live nodes: 1 (node1)
* arbitrators votes: 0
* votes: 1

=> node does not have quorum, commits suicide

### node2 standpoint

* live nodes: 1 (node2)
* arbitrators votes: 1
* votes: 2

=> node has quorum, does not commit suicide

## Node1 dies

### node2 standpoint

* live nodes: 1 (node2)
* arbitrators votes: 1
* votes: 2

=> node has quorum, does not commit suicide


