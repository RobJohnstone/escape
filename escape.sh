#!/bin/bash

cd ${0%/*} # sets working directory to the one that the script is located in
grunt open:production
node server/server.js