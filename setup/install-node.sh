#!/bin/bash
SCRIPT_LOC="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
. ${SCRIPT_LOC}/shared-vars.sh

echo "Installing node.js v12 LTS"

# This is the recommended approach from https://github.com/nodesource/distributions/blob/master/README.md
# Note that it may need modification for Debian. 
#   Todo: add detection for OS flavor and automatically switch.
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
