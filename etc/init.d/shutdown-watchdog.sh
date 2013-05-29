#!/bin/sh
# @@@LICENSE
#
#      Copyright (c) 2008-2012 Hewlett-Packard Development Company, L.P.
#      Copyright (c) 2013 LG Electronics, Inc
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# LICENSE@@@

#
# How long should watchdog's timer be?  It takes 8 seconds from when I
# emit control-alt-delete until the logs stop.  10 or 15 would suffice
# in that case, and I doubt the user will still have the battery in
# place if it stays hung for 60 seconds.
#
# Should probably be a parameter.  Will have to be a parameter if
# called from rcU.d before the updater runs.
#

PATH=/sbin:/bin:/usr/sbin:/usr/bin

SLEEP_SECONDS=60

[ -r /etc/default/shutdown-watchdog ] && source /etc/default/shutdown-watchdog

echo "$0 starting" | logger -s

case "$1" in
    start|stop)
        # do nothing
        ;;
    *)
        echo "usage $0 start|stop # reboot or shutdown after $SLEEP_SECONDS seconds \\" >&2
        echo "    # with decision to reboot or shutdown based on current runlevel. \\" >&2
        echo "    # (start and stop parameters ignored.) \\" >&2
        exit 1
        ;;
esac

set $(runlevel || true)
CUR=$2

# default is reboot; only runlevel 0 goes to shutdown
if [ "$CUR" = 0 ]; then
    REASON=shutdown
else 
    REASON=reboot
    if [ "$CUR" = "U" ]; then
        SLEEP_SECONDS=120
    fi
fi

# save reason.  If another shutdown-watchdog is launched later reason will be
# overwritten and so will provide what we do when we wake.
echo "$REASON" > $REASON_FILE

# The actual sleep-and-tell code is in a block that can be
# backgrounded.  Callers expect this script to return and not to have
# to background it themselves.  Run this in the background, then
# capture PID using $!
{
    sleep $SLEEP_SECONDS

    # Read the reason back out of file, default to reboot if anything
    # went wrong.
    [ -f $REASON_FILE ] && REASON=$(cat $REASON_FILE)
    case "$REASON" in
        shutdown)
            SHELL_CMD="/sbin/halt -f"
            ;;
        *) REASON=reboot
            SHELL_CMD="/sbin/reboot -f"
            ;;
    esac

    echo "$0 $SHELL_CMD" | tee /dev/console | logger
    sleep 3                     # give message time to get out
    $SHELL_CMD
} &
WATCH_PID=$!

mkdir -p $OMIT_DIR
OMIT_FILE=$OMIT_DIR/shutdown-watchdog.$WATCH_PID.pid
SHUTDOWN_CANCEL_WATCHDOG=/etc/default/shutdown-cancel-watchdog.sh
echo $WATCH_PID > $OMIT_FILE
echo "$0 sleeping for $SLEEP_SECONDS" | tee /dev/console
echo "  to stop shutdown-watchdog run '$SHUTDOWN_CANCEL_WATCHDOG'"
