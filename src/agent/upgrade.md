<!-- llms: How to upgrade the agent with no service downtime, on Debian, Ubuntu, Red Hat Enterprise Linux and SuSE. -->
# Upgrade

The agent supports upgrading with zero service down-time.

Upgrading does not require a node reboot.

## Debian, Ubuntu

    sudo apt update
    sudo apt install --only-upgrade opensvc-server opensvc-client

## Red Hat Enterprise Linux 7

    sudo yum makecache
    sudo yum upgrade opensvc-server opensvc-client

## Red Hat Enterprise Linux 8+

    sudo dnf makecache
    sudo dnf upgrade opensvc-server opensvc-client

## SuSE Linux Enterprise Server

    sudo zypper refresh
    sudo zypper update opensvc-server opensvc-client
