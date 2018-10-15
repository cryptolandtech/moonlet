#!/bin/bash

PIDFile="tests/e2e/scripts/process.pid"
CurPID=$(<"$PIDFile")

kill -s PIPE -9 $CurPID
echo "" > $PIDFile
