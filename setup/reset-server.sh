#!/bin/bash
SCRIPT_LOC="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
. ${SCRIPT_LOC}/shared-vars.sh


${SCRIPT_LOC}/stop-server.sh || error "Could not stop server"

# Prepare configuration files
echo "eula=true" > ${DEPLOY_LOC}/eula.txt
cp -f ${SCRIPT_LOC}/${BASE_SERVER_PROPERTIES} ${DEPLOY_LOC}/server.properties || error "Could not write server.properties"

# Modify server properties if needed

# Delete world if present
rm -rf ${DEPLOY_LOC}/world

