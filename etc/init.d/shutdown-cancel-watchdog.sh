#!/bin/sh
# @@@LICENSE
#
#      Copyright (c) 2008-2012 Hewlett-Packard Development Company, L.P.
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

[ -r /etc/default/shutdown-watchdog ] && . /etc/default/shutdown-watchdog

rm -f $REASON_FILE

if [ -d $OMIT_DIR ]; then
    COUNT=$(ls $OMIT_DIR/shutdown-watchdog.*.pid 2>/dev/null | wc -l)
    if [ $COUNT -eq 0 ]; then
        echo "$0: no shutdown-watchdog running" | logger -s
    else
        for PIDFILE in $OMIT_DIR/shutdown-watchdog.*.pid; do
            PID=$(cat $PIDFILE)
            kill $PID
            echo "$0: killed shutdown-watchdog $PID" | logger -s
            rm $PIDFILE
        done
    fi
else
    echo "$0: no shutdown-watchdog running" | logger -s
fi
