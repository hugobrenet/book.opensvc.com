<!-- llms: The data support asks for: the description of the issue, the node and cluster configuration, and logs, with how to keep them across reboots. -->
# Support Data Collection

To ease resolution, you will be asked to provide **information**, configuration, and log files related to the encountered issue.

## Issue Description
* What is the ticket purpose? (Unexpected behavior, error message, technical question, etc.)
* What is the context? (Any known cause or event related)
* When did the problem start?
* What is the impact on service?

## Node & Cluster Configuration
* `/etc/opensvc/node.conf`
* `/etc/opensvc/cluster.conf`

## Logs
All logs are centralized by systemd-journald. By default, the journal is often configured to be **volatile** (stored in memory and lost after reboot).

### Configure

To ensure that pre-crash logs are preserved, you should configure journald to use **persistent** storage:

```bash
# create the directory that will host the persistant logs
mkdir -p /var/log/journal

# set permissions on the directory
systemd-tmpfiles --create --prefix /var/log/journal

# restart the journaling daemon to apply the policy change
systemctl restart systemd-journald
```

### Query

To query logs, you can use the `journalctl` command. You can filter logs by metadata. Below are some key metadata fields to consider:

| Keyword            | Description                                                                      |
|:-------------------|:---------------------------------------------------------------------------------|
| `_COMM`            | The process short name (e.g. `om`)                                               |
| `PKG`              | The daemon subsystem used (e.g `daemon/imon`, `daemon/scheduler`)                |
| `OBJ_PATH`         | The path of the object related to the log message (e.g. `test/svc/svc1`)         |
| `OBJ_NAMESPACE`    | The namespace of the object related to the log message (e.g. `test`)             |
| `OBJ_KIND`         | The path of the object related to the log message (e.g. `svc`)                   |
| `OBJ_NAME`         | The path of the object related to the log message (e.g. `svc1`)                  |
| `SID`              | The session ID related to the log message                                        |
| `ORCHESTRATION_ID` | The orchestration ID of a service operation                                      |

To filter by one of these fields, use the following syntax :

```bash
# Show logs with high-precision ISO timestamps (includes milliseconds+), in UTC
journalctl -o short-iso-precise --utc _COMM=om
```

```bash
# Narrow to a precise time window (millisecond precision)
journalctl --utc --since "2026-04-08 14:12:33.250" --until "2026-04-08 14:13:10.900" _COMM=om
```

```bash
# Combine metadata filters with precise time output
journalctl -o short-iso-precise --utc PKG=daemon/imon OBJ_PATH=test/svc/svc1
```

```bash
# Show logs with UNIX timestamps (seconds since epoch), in UTC
journalctl -o short-unix --utc _COMM=om
```

All **information** can be sent through email at [support@opensvc.com](mailto:support@opensvc.com) or uploaded using our [Support File Exchange](#support-file-exchange).

> **Note:** To save time in data collection, consider using the [SOS Report Data Collection Tool](#sos-report-data-collection-tool).


# SOS Report Data Collection Tool

Sos (formerly known as `sosreport`) is an extensible, portable support data collection tool primarily aimed at Linux distributions and other UNIX-like operating systems.

It is available on major distributions (RHEL, Ubuntu, Debian, Fedora, etc.) and supports OpenSVC environments (**sos version >= 4.2**).

**Check for opensvc plugin existence:**

```bash
sudo sos report --list-plugins | grep opensvc
```

**Expected output:**

```
opensvc              OpenSVC cluster and services (config and state collection)
```

**Launch data collection on BOTH OpenSVC cluster nodes:**

```bash
sudo sos report --enable-plugins opensvc --all-logs
```

*See the [Sos website](https://sos.readthedocs.io/) for more details.*

# Support File Exchange

In case you need to share files with the support team, you can use either an email attachment or the secure file exchange web portal.

1. Open a browser to [https://sfx.opensvc.com](https://sfx.opensvc.com).
2. At the top right, there is a **Login** field and button; enter `support` and click the **Login** button.
3. Attach as many files as needed and submit for upload.
4. Once done, inform the support team that your upload is finished.

> **Note:** If allowed by your network security policy, you can use the `om <svcname> support` command to automatically:
> * Build a `tar.gz` with all required `<svcname>` logs.
> * Upload it to [https://sfx.opensvc.com](https://sfx.opensvc.com).

> **Note:** You can also directly upload any file using the `curl` command. In the example below, we use an internal web proxy named `my.preferred.proxy`, and the file to be sent is named `FILE_TO_UPLOAD.TAR.GZ`.

```bash
export https_proxy=http://my.preferred.proxy:8080/
curl -k -F 'file=@FILE_TO_UPLOAD.TAR.GZ;type=application/octet-stream' https://user:support@sfx.opensvc.com/+upload -X POST
```


