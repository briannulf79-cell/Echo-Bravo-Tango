#!/usr/bin/env bash
set -euo pipefail

LOG_DIR=${LOG_DIR:-/root/bravo_logs}
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/resource_log_$(date +%Y%m%d_%H%M%S).csv"
printf "timestamp,gpu_mem_used_mb,gpu_mem_total_mb,gpu_util_pct,sm_clk_mhz,mem_clk_mhz,power_w,cpu_usage_pct,mem_used_gb,mem_free_gb\n" > "$LOG_FILE"

echo "Logging to $LOG_FILE"

while true; do
  TS=$(date --iso-8601=seconds)
  GPU_LINE=$(nvidia-smi --query-gpu=memory.used,memory.total,utilization.gpu,clocks.sm,clocks.mem,power.draw --format=csv,noheader,nounits)
  CPU_USAGE=$(top -b -n1 | awk /Cpu(s)/ {print + })
  MEM_LINE=$(free -g | awk /Mem:/ {print , })
  echo "$TS,$GPU_LINE,$CPU_USAGE,$MEM_LINE" >> "$LOG_FILE"
  sleep ${LOGGER_INTERVAL:-5}
  if [[ -f "$LOG_DIR/stop_logger" ]]; then
    rm -f "$LOG_DIR/stop_logger"
    break
  fi
done
