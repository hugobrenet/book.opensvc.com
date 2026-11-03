<!-- llms: Deploying applications: the life of the configuration of an object, from the name it is given to the day it is removed. -->
# Deploy Apps

Applications are composed of one or more objects (services, configs, secrets,
volumes, service accounts). These objects can be deployed and operated
individually or as a group.

This chapter covers the life of an object's configuration, from the name you
give it to the day you remove it:

* [Naming](apps.deploy.naming.md) — the `<namespace>/<kind>/<name>` path, and
  what each kind is for.
* [Create, Deploy](apps.deploy.create.md) — the ways to bring an object into
  existence: from scratch, from another object, or from a manifest.
* [Provisioning](apps.deploy.provisioning.md) — creating what the
  configuration describes: disks, filesystems, addresses, images.
* [Update](apps.deploy.update.md) — changing a configuration safely, rather
  than editing the file behind the agent's back.
* [Purge, Delete](apps.deploy.delete.md) — removing the configuration, with or
  without the resources it provisioned.

If you have not created an object yet, [Your First Service](firstservice.md)
walks through one end to end in a few minutes.
