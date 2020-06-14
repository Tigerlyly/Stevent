#!/bin/bash
SCRIPT_LOC="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
. ${SCRIPT_LOC}/shared-vars.sh


# Don't restart server if it's already running
if tmux has-session -t ${TMUX_MC_SESSION} >/dev/null 2>&1; then
    echo "Server session already exists, not going to start. stop-server first if you want to restart"
    echo "Attach to server session using tmux attach-session -t ${TMUX_MC_SESSION} - Default configuration is Ctrl-B then 'd' to detach."
    exit 1
fi

echo "Launching server..."
# Launch server
tmux start \; new-session -d -s ${TMUX_MC_SESSION} "${SCRIPT_LOC}/raw-server-start.sh" || error "Failed to start server session."

# Wait a short while and fail if session is not still running
sleep 2s
if ! tmux has-session -t ${TMUX_MC_SESSION} >/dev/null 2>&1; then
    echo "Unexpected - Server exited immediately"
    exit 1 # Session doesn't exist
fi
echo "Server started"
echo "Attach to server session using tmux attach-session -t ${TMUX_MC_SESSION} - Default configuration is Ctrl-B then 'd' to detach."