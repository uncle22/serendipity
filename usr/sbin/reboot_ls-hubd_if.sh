#!/bin/sh
# @@@LICENSE
#
# Copyright (c) 2007-2012 Hewlett-Packard Development Company, L.P.
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

EXIT_CODE=$1
UPSTART_JOB=$2

if [ "$EXIT_CODE" -eq 0 ]; then       # normal shutdown, e.g. from TERM; do nothing
    :
else
    RUNLEVEL=$(runlevel | awk '{print $2}')
    if [ "$RUNLEVEL" = "0" -o "$RUNLEVEL" = "6" -o "$RUNLEVEL" = "U" ]; then
        :                       # do nothing
    else
        REASON="ls-hubd for $UPSTART_JOB exited with $EXIT_CODE; rebooting"
        echo "$REASON" | logger
        rdx_reporter --component ls-hubd.reboot --cause "ls-hubd crash" --detail "$REASON"
        /sbin/reboot
    fi
fi 
