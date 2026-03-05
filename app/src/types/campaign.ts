export type ChannelKey = "social" | "email" | "sms" | "landing";

export interface GeneratePayload {
  businessName: string;
  industry: string;
  tone: string;
  callToAction: string;
  differentiator: string;
  reviews: string;
  channels: ChannelKey[];
}

export interface ChannelAsset {
  headline: string;
  summary: string;
  copy: string[];
  cadence: string;
  metrics: string[];
}

export interface TangoResponse {
  campaignTitle: string;
  corePromise: string;
  launchStrategy: string;
  qaChecklist: string[];
  assets: Record<ChannelKey, ChannelAsset>;
}
