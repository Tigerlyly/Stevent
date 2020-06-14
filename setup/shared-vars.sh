#!/bin/bash

DEPLOY_LOC=${MCSERVERLOC:-$HOME/mcserver-bottest}

SERVER_JAR="https://launcher.mojang.com/v1/objects/bb2b6b1aefcd70dfd1892149ac3a215f6c636b07/server.jar"
SERVER_JAR_NAME="minecraft_server.1.15.2.jar"
SERVER_JAR_TARGET=${DEPLOY_LOC}/${SERVER_JAR_NAME}

BASE_SERVER_PROPERTIES="base.server.properties"

TMUX_MC_SESSION="mc_server"
TMUX_BOT_SESSION="mc_bot"


function error {
    echo
    echo $@
    echo
    exit 1
}

