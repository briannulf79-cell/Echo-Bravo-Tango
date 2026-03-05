# Echo · Bravo · Tango

Generate monetizable campaign kits directly from real customer reviews. This project exercises the Runpod VM (NVIDIA A40, Qwen 32B via Ollama) by pairing a rich UI brief builder with a repeatable benchmarking script.

## What it does
- Accepts real testimonials + key positioning details.
- Calls Qwen 32B through Ollama (or OpenRouter on hosted builds) to build synchronized assets for social, email, SMS, and landing hero blocks.
- Logs GPU/CPU/memory usage (see `/root/bravo_logs`) so we can correlate creative output with hardware load.
- Includes a CLI benchmark (`npm run benchmark`) to hammer the model with stacked briefs for stress tests.

## Quick start
```bash
cd app
cp .env.example .env.local   # adjust for Ollama vs. OpenRouter
npm install
npm run dev
```
Visit <http://localhost:3000> to open the UI. Paste reviews, tweak tone/CTA, and hit **Generate campaign kit** to trigger `/api/generate`.

### Hosted / Vercel preview
Set these env vars before deploying (`vercel env add ...`):
```
OPENROUTER_API_KEY=sk-...
OPENROUTER_MODEL=openrouter/auto   # or any specific model slug
```
When `OPENROUTER_API_KEY` + `OPENROUTER_MODEL` are present, the API route automatically calls OpenRouter instead of the local Ollama server, so the public preview can generate campaigns.

## Benchmarking Qwen 32B
```bash
npm run benchmark 8   # run 8 back-to-back briefs
```
Results append to `/root/bravo_logs/benchmark_history.jsonl` with iteration, wall time, eval count, and tokens/sec. Combine with the live resource logger (already running) for full visibility:
```bash
tail -f /root/bravo_logs/resource_log_*.csv
```

## Deployment notes
- Built with Next.js 16 (App Router) + Tailwind v4.
- Local dev defaults to Ollama at `http://127.0.0.1:11434` (`qwen3:32b`). Override with `OLLAMA_HOST` / `OLLAMA_MODEL`.
- Hosted builds fall back to OpenRouter when the env vars above are set.
- No database yet; this is a generator/reference implementation for rapid experiments.

## Roadmap ideas
1. Persist briefs + outputs for replay/comparison.
2. Add monetization gates (Stripe checkout or Brainstorm workspace hook).
3. Evaluate higher-parameter models when we have GPUs with >48 GB VRAM.
4. Ship prebuilt “earnings experiments” templates for quick sellable offers.
