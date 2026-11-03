<!-- llms: Commercial support for OpenSVC: how to be assisted, the support open hours, and premium support. -->
# Get Support

## Introduction

OpenSVC provides commercial support for its product catalog. Active support contract owners are able to open service requests. Contact [sales@opensvc.com](mailto:sales@opensvc.com) for a quotation.

This section describes the guidelines for being assisted by our support team.

## Support Open Hours

Depending on your support subscription, you can call us according to the table below:

* **Standard** Service Level

  Open **Monday to Friday, 9am to 6pm (Europe/Paris timezone)**

* **Premium** Serve Level

  Open **24x7**

## Premium Support

Nodes under a Premium support contract must be tagged in the associated collector to ensure proper node identification and billing.

**Tag the node for premium support:**

```bash
om node collector tag attach --name PREMIUM_SUPPORT
```

**Untag the node for premium support:**

```bash
om node collector tag detach --name PREMIUM_SUPPORT
```

**Verify the current support classification:**

```bash
om node collector tag show
```

> **Note:** Services running on a Premium supported node are implicitly included in the Premium support scope and billing.

Please get in touch with us for any questions you may have.

