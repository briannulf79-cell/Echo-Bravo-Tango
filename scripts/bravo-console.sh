#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR=${LOG_DIR:-/root/bravo_logs}
OLLAMA_HOST=${OLLAMA_HOST:-http://127.0.0.1:11434}
OLLAMA_MODEL=${OLLAMA_MODEL:-qwen3:32b}

function usage() {
  cat <<USAGE
Bravo Console
Usage: $0 <command> [args]
Commands:
  status                 Show GPU/utilization + recent logs
  prompt "message"       Send a single prompt to Qwen via Ollama
  benchmark [iterations] Run npm benchmark (default 3 iterations)
USAGE
}

function ensure_logs_exist() {
  mkdir -p "$LOG_DIR"
}

function cmd_status() {
  ensure_logs_exist
  echo "=== GPU Snapshot ==="
  nvidia-smi | sed -n 1,15p
  echo
  if [[ -f "$LOG_DIR/resource_logger.pid" ]]; then
    PID=$(cat "$LOG_DIR/resource_logger.pid")
    if ps -p "$PID" > /dev/null 2>&1; then
      echo "Resource logger PID $PID is running."
    else
      echo "Resource logger PID file exists but process is down."
    fi
  else
    echo "No resource_logger.pid file found."
  fi
  echo
  LATEST_LOG=$(ls -t $LOG_DIR/resource_log_*.csv 2>/dev/null | head -n1 || true)
  if [[ -n "$LATEST_LOG" ]]; then
    echo "=== Last 10 samples ($LATEST_LOG) ==="
    tail -n 10 "$LATEST_LOG"
  else
    echo "No resource logs recorded yet."
  fi
}

function cmd_prompt() {
  ensure_logs_exist
  local message="$1"
  if [[ -z "$message" ]]; then
    echo "Error: provide a prompt (or pipe text via stdin)." >&2
    exit 1
  fi
  echo "Sending prompt to $OLLAMA_MODEL..." >&2
  curl -s "$OLLAMA_HOST/api/generate" \
    -H "Content-Type: application/json" \
    -d "{\"model\":\"$OLLAMA_MODEL\",\"prompt\":\"${message//\"/\\\"}\",\"stream\":false}" \
    | jq -r .response
}

function cmd_benchmark() {
  local iterations=${1:-3}
  (cd "$ROOT_DIR/app" && npm run benchmark -- "$iterations")
}

command=${1:-}
case "$command" in
  status)
    cmd_status
    ;;
  prompt)
    shift || true
    cmd_prompt "$1"
    ;;
  benchmark)
    shift || true
    cmd_benchmark "$1"
    ;;
  *)
    usage
    exit 1
    ;;
esac
