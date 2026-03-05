#!/usr/bin/env node
import fs from "fs";

const OLLAMA_HOST = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "qwen3:32b";
const ITERATIONS = Number(process.argv[2] ?? 5);
const LOG_PATH = process.env.BENCHMARK_LOG ?? "/root/bravo_logs/benchmark_history.jsonl";

const channelDescriptions = {
  social: "Instagram carousel post optimized for saves and shares",
  email: "Email campaign with subject line + body copy",
  sms: "SMS broadcast under 320 characters with clear CTA",
  landing: "Hero section copy (headline, subhead, proof bullets)"
};

const RESPONSE_SCHEMA = `{
  "campaignTitle": string,
  "corePromise": string,
  "launchStrategy": string,
  "qaChecklist": string[],
  "assets": {
    "social": ChannelAsset,
    "email": ChannelAsset,
    "sms": ChannelAsset,
    "landing": ChannelAsset
  }
}

ChannelAsset = {
  "headline": string,
  "summary": string,
  "copy": string[],
  "cadence": string,
  "metrics": string[]
}`;

function buildPrompt(payload) {
  const selectedChannels = payload.channels
    .map((channel) => `- ${channelDescriptions[channel]} (key: ${channel})`)
    .join("\n");

  return `You are Tango, a full-stack campaign architect for growth-focused small businesses. You turn customer reviews into multi-channel launch kits that can be monetized immediately.

Input data:
Business Name: ${payload.businessName}
Industry: ${payload.industry}
Tone: ${payload.tone}
Primary CTA: ${payload.callToAction}
Key Differentiator: ${payload.differentiator}
Requested Channels:\n${selectedChannels}

Reviews:
${payload.reviews}

Instructions:
1. Build a cohesive campaign rooted in the reviews (no generic platitudes).
2. Outputs must be bold, specific, and tailored to the industry and CTA.
3. Every channel asset must contain structured copy arrays that we can drop into UI blocks without editing.
4. Always respond with valid JSON that matches this schema (no markdown, no prose before/after):
${RESPONSE_SCHEMA}

Return only the JSON.`;
}

const payload = {
  businessName: "Earn-E Launch Kit",
  industry: "Local Home Services",
  tone: "Bold Operator",
  callToAction: "Start a 14-day $0 pilot",
  differentiator: "Realtime payouts with guardrails",
  reviews: `"Earn-E changed Saturdays in our house..." / "QR chore boards finally work" / "Grandparents can fund rewards in seconds"`,
  channels: ["social", "email", "sms", "landing"]
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runIteration(index) {
  const prompt = buildPrompt(payload);
  const started = Date.now();
  const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: {
        temperature: 0.6,
        top_p: 0.85,
        num_predict: 800
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Iteration ${index + 1} failed with status ${response.status}`);
  }

  const body = await response.json();
  const wallTime = Date.now() - started;
  const durationNs = body.total_duration ?? wallTime * 1_000_000;
  const evalCount = body.eval_count ?? null;
  const tokensPerSec = durationNs && evalCount ? (evalCount / (durationNs / 1_000_000_000)).toFixed(2) : null;

  const logEntry = {
    ts: new Date().toISOString(),
    iteration: index + 1,
    wall_time_ms: wallTime,
    eval_count: evalCount,
    tokens_per_sec: tokensPerSec && Number(tokensPerSec),
    model: OLLAMA_MODEL
  };

  fs.appendFileSync(LOG_PATH, JSON.stringify(logEntry) + "\n");
  console.log(`Iteration ${index + 1}/${ITERATIONS}`, logEntry);
}

(async () => {
  for (let i = 0; i < ITERATIONS; i += 1) {
    await runIteration(i);
    await wait(1500);
  }
})();
