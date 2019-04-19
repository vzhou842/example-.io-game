#!/bin/bash
sudo NODE_ENV='production' \
  PORT=9000 \
  forever --uid "example-io-game" -o ./out.log -e ./err.log --append start src/server/server.js
