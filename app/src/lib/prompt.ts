import { ChannelKey, GeneratePayload } from "@/types/campaign";

const channelDescriptions: Record<ChannelKey, string> = {
  social: "Instagram carousel post optimized for saves and shares",
  email: "Email campaign with subject line + body copy",
  sms: "SMS broadcast under 320 characters with clear CTA",
  landing: "Hero section copy (headline, subhead, proof bullets) for a landing page"
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

export function buildPrompt(payload: GeneratePayload) {
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
