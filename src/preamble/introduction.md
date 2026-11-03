<!-- llms: What OpenSVC is, why use it, and what it requires. -->
# Introduction

## What is OpenSVC

OpenSVC is an open-source software product and the name of the company developing and supporting it. In production since 2009, OpenSVC consists of:

- **Agent**: A supervisor, clusterware, container orchestrator, and configuration manager (Apache 2.0 licensed since v3).
- **Collector**: Optionally, aggregates agent data and manages configuration, infrastructure, and resources (Apache 2.0 licensed).

## Why OpenSVC

- **Service Mobility**: Ensures high availability and scalability.
- **Configuration Management**: Handles thousands of servers and clusters with minimal dependencies.
- **Inventorying**: Tracks assets, storage, networks, and services.
- **Orchestration**: RESTful API, self-service portal, provisioning, fine-grained delegation.
- **Auditing**: Monitors performance, alerts, and audits infrastructure and services.
- **Productivity Boost**: Reduces infrastructure maintenance and allows for task delegation.


## Requirements

OpenSVC runs on Linux servers.

| Subsystem                                                   | Agent | Collector |
|-------------------------------------------------------------|-------|-----------|
| Service mobility, clustering, container orchestration       |   O   |           |
| Configuration management                                    |   O   |     O     |
| Inventoring                                                 |   O   |     O     |
| Orchestration and interoperability                          |   O   |     O     |
| Continuous infrastructure, systems, and services auditing   |   O   |     O     |

