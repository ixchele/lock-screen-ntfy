#!/usr/bin/env bash

TOPIC="test_zakaria_123"

echo "countdown started" >> /tmp/debug_lock.log
for (( i=36*60; i > 0; i-- )); do
	if !(pidof ft_lock  2> /dev/null); then
		curl  -d "stop the count down !" "ntfy.sh/$TOPIC" &> /dev/null
		break
	fi
	if (( i == 5*60 )); then
		curl  -d "lock screen : 5 mins to logout !" "ntfy.sh/$TOPIC" &> /dev/null
	fi
	sleep 1
	echo "$i" >> /tmp/debug_lock.log
done
echo "countdown end" >> /tmp/debug_lock.log
