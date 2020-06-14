#!/bin/bash
SCRIPT_LOC="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
. ${SCRIPT_LOC}/shared-vars.sh


sudo apt update || error "Unable to apt update ($?)"
sudo apt install -y wget tmux openjdk-8-jdk || error "Unable to apt install packages ($?)"

mkdir -p ${DEPLOY_LOC} || error "Unable to create dir '${DEPLOY_LOC}' ($?)"
# Download server jar if not already present
if [ ! -f ${SERVER_JAR_TARGET} ]; then
    wget -O ${SERVER_JAR_TARGET} ${SERVER_JAR} || error "Failed to download server JAR ($?)"
else
    echo "Server JAR already present"
fi

./reset-server.sh || exit 1
