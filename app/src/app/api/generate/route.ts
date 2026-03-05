import { NextResponse } from "next/server";
import { buildPrompt } from "@/lib/prompt";
import { GeneratePayload, TangoResponse } from "@/types/campaign";

const OLLAMA_HOST = process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? "qwen3:32b";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL;
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const SYSTEM_PROMPT =
  "You are Tango, a campaign architect that always responds with JSON matching the provided schema.";

async function callOllama(prompt: string) {
  const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt,
      stream: false,
      options: {
        temperature: 0.6,
        top_p: 0.8,
        top_k: 60,
        num_predict: 800
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const raw = String(payload.response ?? "").trim();
  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Model response did not contain JSON");
  }

  const jsonSlice = raw.slice(jsonStart, jsonEnd + 1);
  return JSON.parse(jsonSlice) as TangoResponse;
}

async function callOpenRouter(prompt: string) {
  if (!OPENROUTER_API_KEY || !OPENROUTER_MODEL) {
    throw new Error("OpenRouter API key/model not configured");
  }

  const response = await fetch(OPENROUTER_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://echo-bravo-tango.vercel.app",
      "X-Title": "Echo-Bravo-Tango"
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      temperature: 0.6,
      top_p: 0.8
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter request failed with status ${response.status}`);
  }

  const payload = await response.json();
  const raw = String(payload.choices?.[0]?.message?.content ?? "").trim();
  const jsonStart = raw.indexOf("{");
  const jsonEnd = raw.lastIndexOf("}");

  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Model response did not contain JSON");
  }

  const jsonSlice = raw.slice(jsonStart, jsonEnd + 1);
  return JSON.parse(jsonSlice) as TangoResponse;
}

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as GeneratePayload;
    const channels = data.channels ?? [];

    if (!data.businessName || !data.reviews || channels.length === 0) {
      return NextResponse.json(
        { error: "Business name, reviews, and at least one channel are required." },
        { status: 400 }
      );
    }

    const prompt = buildPrompt({ ...data, channels });
    const useOpenRouter = Boolean(OPENROUTER_API_KEY && OPENROUTER_MODEL);
    const result = useOpenRouter ? await callOpenRouter(prompt) : await callOllama(prompt);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("/api/generate error", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
