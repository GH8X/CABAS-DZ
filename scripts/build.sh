#!/bin/bash
# CABAS DZ — production build entrypoint.
#
# Invokes Vite through node rather than the bare `vite` command, so the build
# works even when ./node_modules/.bin is not on PATH (which is what caused the
# "vite: command not found" failure in the Freebuff production build).
#
# Run from the repository root, or via:  sh ./scripts/build.sh
# (uploaded files lose their executable bit on the hosting builder, so prefer
# `sh ./scripts/build.sh` over `./scripts/build.sh`.)
set -eu

cd "$(dirname "$0")/.."

bun install
node ./node_modules/vite/bin/vite.js build
