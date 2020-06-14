#!/bin/bash
SCRIPT_LOC="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
. ${SCRIPT_LOC}/shared-vars.sh


cd ${DEPLOY_LOC}
java -Xms512M -Xmx512M -jar ${SERVER_JAR_NAME} nogui

