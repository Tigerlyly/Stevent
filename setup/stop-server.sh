#!/bin/bash
SCRIPT_LOC="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
. ${SCRIPT_LOC}/shared-vars.sh


# Does tmux session for server exist?
if ! tmux has-session -t ${TMUX_MC_SESSION} >/dev/null 2>&1; then
    echo "Stop server - Server not started."
    exit 0 # Session doesn't exist
fi

echo "Stopping server, last few lines of server output..."
tail -n 5 ${DEPLOY_LOC}/logs/latest.log

# Issue stop command to the server
tmux send-keys -t ${TMUX_MC_SESSION} "stop" C-m || error "Failed to send stop command to tmux session"

# Wait a bit for the session to die
for i in `seq 120`; do
    if ! tmux has-session -t ${TMUX_MC_SESSION} >/dev/null 2>&1; then
        break
    fi
    sleep 0.5s
done

# Kill session if it still exists
if tmux has-session -t ${TMUX_MC_SESSION} >/dev/null 2>&1; then
    echo "Server log tail..."
    tail -n 10 ${DEPLOY_LOC}/logs/latest.log
    echo "Server stop timeout - Killing server session...";
    tmux kill-session -t  ${TMUX_MC_SESSION} || error "Failed to kill tmux session"
    sleep 2
fi

exit 0