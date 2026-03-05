#!/usr/bin/env bash
set -euo pipefail

ITERATIONS=${ITERATIONS:-5}
PAUSE_SECONDS=${PAUSE_SECONDS:-45}
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

while true; do
  echo "[BRAVO LOOP] $(date --iso-8601=seconds) :: kicking benchmark ($ITERATIONS iterations)"
  (cd "$ROOT_DIR/app" && npm run benchmark -- "$ITERATIONS")
  echo "[BRAVO LOOP] $(date --iso-8601=seconds) :: sleeping ${PAUSE_SECONDS}s"
  sleep "$PAUSE_SECONDS"
done
