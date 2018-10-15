#!/bin/bash

PIDFile="tests/e2e/scripts/process.pid"
CurPID=$(<"$PIDFile")

if [[ $CurPID == "" ]]; then
  node tests/e2e/httpserver.js > $PIDFile &
fi