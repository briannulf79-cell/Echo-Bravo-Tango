# Echo · Bravo · Tango

Generate monetizable campaign kits directly from real customer reviews. This project exercises the Runpod VM (NVIDIA A40, 32B Qwen via Ollama) by pairing a rich UI brief builder with a repeatable benchmarking script.

## What it does
- Accepts real testimonials + key positioning details.
- Calls Qwen 32B through Ollama to build synchronized assets for social, email, SMS, and landing hero blocks.
- Logs GPU/CPU/memory usage (see `/root/bravo_logs`) so we can correlate creative output with hardware load.
- Includes a CLI benchmark (`npm run benchmark`) to hammer the model with stacked briefs for stress tests.

## Quick start
```bash
cd app
cp .env.example .env.local   # adjust if Ollama is remote
npm install
npm run dev
```
Visit <http://localhost:3000> to open the UI. Paste reviews, tweak tone/CTA, and hit **Generate campaign kit** to trigger the API route at `/api/generate`.

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
- API route calls Ollama directly. Adjust `OLLAMA_HOST` / `OLLAMA_MODEL` via env vars.
- No database yet; this is a generator/reference implementation for rapid experiments.

## Roadmap ideas
1. Persist briefs + outputs for replay/comparison.
2. Add monetization gates (Stripe checkout or Brainstorm workspace hook).
3. Support Qwen 72B once VRAM headroom confirmed.
4. Ship prebuilt “earnings experiments” templates for quick sellable offers.
