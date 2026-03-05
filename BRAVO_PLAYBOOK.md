# Bravo Playbook

This file is the bridge between **Echo** (strategy + direction) and **Bravo** (Runpod VM with Qwen 32B/72B). It documents access, tooling, and the exact workflow each run should follow.

## 1. Access & context
- **VM:** Runpod A40 (46 GB VRAM) — SSH via `ssh -i ~/.ssh/echo_bravo root@194.68.245.62 -p 22005`
- **Repo:** `/workspace/Echo-Bravo-Tango`
- **Primary model:** `qwen3:32b` via Ollama (`OLLAMA_HOST=http://127.0.0.1:11434`)
- **Fallback:** `qwen3:72b` if throughput/quality drops (ensure ~80 GB VRAM free before loading)

## 2. Key scripts
| Purpose | Location | Notes |
| --- | --- | --- |
| Resource logger | `monitoring/resource-logger.sh` | Copy to `/root/bravo_logs/resource_logger.sh`, run via `nohup` for continuous metrics |
| Benchmark loop | `app/scripts/benchmark.mjs` | `npm run benchmark -- <iterations>` writes to `/root/bravo_logs/benchmark_history.jsonl` |
| Manual console | `scripts/bravo-console.sh` | `./scripts/bravo-console.sh status` or `prompt "Do X"` to talk to Qwen |

## 3. Standard operating procedure
1. **Sync repo** — `git pull origin main`, run `npm install` inside `/workspace/Echo-Bravo-Tango/app` if packages changed.
2. **Start logger** — ensure `/root/bravo_logs/resource_logger.pid` exists. Use the script above if it dies.
3. **Run generator** — either via the Next.js UI (`npm run dev`) or CLI console script to keep Bravo busy with monetizable briefs.
4. **Benchmark every hour** — `npm run benchmark -- 3` to keep telemetry flowing and stress the model.
5. **Commit & push** — all useful artifacts (UI tweaks, scripts, docs) go to `main` unless we decide to branch.

## 4. Monitoring checklist
- `nvidia-smi` — GPU util + memory < 46 GB for 32B, ~80 GB free before switching to 72B.
- `/root/bravo_logs/resource_log_*.csv` — append every 5 seconds; gap > 2 min means logger died.
- `/root/bravo_logs/benchmark_history.jsonl` — ensures bench data for each run.
- `tmux ls` — expect a `bravo-watch` session running logger tail + benchmark output.

## 5. Escalation
- If `ollama` fails to load a model, run `ollama serve` then `ollama pull qwen3:32b`.
- If GitHub auth breaks, re-add `/root/.ssh/echo_bravo` deploy key or regenerate via Echo.
- If resource logger stops repeatedly, pivot to `nvidia-smi dmon` until fixed.

This doc should stay updated as we expand Bravo’s responsibilities.
