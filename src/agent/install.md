<!-- llms: How to install the agent packages, from the dev, uat or prod branch, on Debian, Ubuntu, Red Hat Enterprise Linux and SuSE. -->
# Install

## Branch

We feed packages in 3 different branches:

* `dev` is unstable.

  Every candidate Pull Request causes a new package to be spawned here for OpenSVC QA purposes.

* `uat` is for testing.

  OpenSVC will push there pre-release packages and packages that contain a candidate fixes for known issues that client are encouraged to validate.

* `prod` is stable.

  It is the default and recommended branch.


Execute one of the following variable settings in a shell, and the code block corresponding to the operating system.

    BRANCH=dev
    BRANCH=uat
    BRANCH=prod


## Debian, Ubuntu

    # Set ID (ubuntu, debian) and VERSION_CODENAME (bookworm, bullseye, noble)
    source /etc/os-release

    BRANCH=${BRANCH:-prod}
    DISTRIB=${VERSION_CODENAME:-noble}
    
    # Import opensvc gpg signing keys
    # -------------------------------
    curl -s -o- https://packages.opensvc.com/gpg.public.key.asc | \
        sudo gpg --dearmor --output /etc/apt/trusted.gpg.d/opensvc-package-pub.gpg --yes

    #
    # Add the opensvc repository to apt sources
    # -----------------------------------------
    cat - <<EOF | sudo tee /etc/apt/sources.list.d/opensvc.list 
    deb https://packages.opensvc.com/apt/$ID $BRANCH-opensvc-v3-$DISTRIB main
    deb-src https://packages.opensvc.com/apt/$ID $BRANCH-opensvc-v3-$DISTRIB main
    EOF

    #
    # Install the opensvc server
    # --------------------------
    sudo apt update
    sudo apt install opensvc-server

    #
    # Enable the systemd unit and start the server
    # --------------------------------------------
    sudo systemctl enable --now opensvc-server

## Red Hat Enterprise Linux 7

    # Set ID (rhel) and VERSION_ID (7.2, ...)
    source /etc/os-release

    BRANCH=${BRANCH:-prod}
    DISTRIB=${ID}${VERSION_ID%.*}

    #
    # Add the opensvc repository to yum sources
    # -----------------------------------------
    cat << EOF >/etc/yum.repos.d/opensvc.repo
    [opensvc]
    name=OpenSVC Packages RHEL \$releasever - \$basearch
    baseurl=https://packages.opensvc.com/rpm/$BRANCH-opensvc-v3-$DISTRIB/\$basearch/
    enabled=1
    gpgcheck=0
    EOF

    #
    # Install the opensvc server
    # --------------------------
    sudo yum makecache
    sudo yum install opensvc-server

    #
    # Enable the systemd unit and start the server
    # --------------------------------------------
    sudo systemctl enable --now opensvc-server

## Red Hat Enterprise Linux 8+

    # Set ID (rhel) and VERSION_ID (8.10, ...)
    source /etc/os-release

    BRANCH=${BRANCH:-prod}
    DISTRIB=${ID}${VERSION_ID%.*}

    #
    # Add the opensvc repository to yum sources
    # -----------------------------------------
    cat << EOF >/etc/yum.repos.d/opensvc.repo
    [opensvc]
    name=OpenSVC Packages RHEL \$releasever - \$basearch
    baseurl=https://packages.opensvc.com/rpm/$BRANCH-opensvc-v3-$DISTRIB/\$basearch/
    enabled=1
    gpgcheck=1
    gpgkey=https://packages.opensvc.com/gpg.public.key.asc
    EOF

    #
    # Install the opensvc server
    # --------------------------
    sudo dnf makecache
    sudo dnf install opensvc-server

    #
    # Enable the systemd unit and start the server
    # --------------------------------------------
    sudo systemctl enable --now opensvc-server

## SuSE Linux Enterprise Server

    # Set ID (rhel) and VERSION_ID (8.10, ...)
    source /etc/os-release

    BRANCH=${BRANCH:-prod}
    DISTRIB=${ID}${VERSION_ID%.*}

    #
    # Add the opensvc repository to zypper sources
    # -----------------------------------------
    cat << EOF >/etc/zypp/repos.d/opensvc.repo
    [opensvc]
    name=OpenSVC Packages SLES \$releasever - \$basearch
    baseurl=https://packages.opensvc.com/rpm/$BRANCH-opensvc-v3-$DISTRIB/\$basearch/
    enabled=1
    autorefresh=1
    gpgcheck=1
    gpgkey=https://packages.opensvc.com/gpg.public.key.asc
    EOF

    #
    # Install the opensvc server
    # --------------------------
    sudo zypper --gpg-auto-import-keys --non-interactive refresh
    sudo zypper install opensvc-server

    #
    # Enable the systemd unit and start the server
    # --------------------------------------------
    sudo systemctl enable --now opensvc-server

> ➡️ See Also
> * [Installed Files](internals.installed_files.md)

