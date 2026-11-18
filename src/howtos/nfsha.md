<!-- llms: Two NFS high availability setups: one with host resources, for a central storage backend, one with containers and data volumes, for edge storage. -->
# NFS High Availability

In this chapter we propose two NFS HA integration strategies:

* One using only hosted resources, focused on high performance and robustness. Best used as a central storage backend for many clients.

* One using containers, cluster backend network and data volumes, focused on resource isolation and automated deployment. Best used as edge storage server, deployed and managed by the end users.
