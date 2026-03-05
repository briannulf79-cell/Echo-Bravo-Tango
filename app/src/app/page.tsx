"use client";

import { FormEvent, useMemo, useState } from "react";
import type { ChannelKey, TangoResponse } from "@/types/campaign";

const channelOptions: { id: ChannelKey; label: string; helper: string }[] = [
  { id: "social", label: "Social Carousel", helper: "5 panels geared for Instagram/LinkedIn" },
  { id: "email", label: "Email Drop", helper: "Subject line + full body copy" },
  { id: "sms", label: "SMS Blast", helper: "< 320 chars, tap-friendly CTA" },
  { id: "landing", label: "Landing Hero", helper: "Headline, subhead, proof bullets" }
];

const toneOptions = [
  "Bold Operator",
  "Neighborly Guide",
  "Premium Concierge",
  "Playful Optimist"
];

const industryOptions = [
  "Local Home Services",
  "Family Finance",
  "Homeschool / Education",
  "Health & Wellness",
  "Faith Communities"
];

const defaultReviews = `"Earn-E changed Saturdays in our house. Kids know exactly how many points a job is worth and I get alerts when it's done. We saved $240 last month by tracking chores instead of shelling out cash randomly." - Megan / mom of 6

"I plugged our family cleaning list into Earn-E, printed the QR codes, and suddenly bathrooms are spotless. When the kids ask for Robux I tell them to check the leaderboard." - Jason C.

"Grandparents can send rewards instantly now. The Stripe link makes payouts feel real and my teens hustle harder." - Fallon P.`;

const differentiators = [
  "Realtime payouts with guardrails",
  "Parent + grandparent accountability loop",
  "Gamified streaks that fuel consistency",
  "Profiles for up to 10 kids per household"
];

interface FormState {
  businessName: string;
  industry: string;
  tone: string;
  callToAction: string;
  differentiator: string;
  reviews: string;
}

export default function Home() {
  const [form, setForm] = useState<FormState>({
    businessName: "Earn-E Launch Kit",
    industry: industryOptions[0],
    tone: toneOptions[0],
    callToAction: "Start a 14-day $0 pilot",
    differentiator: differentiators[0],
    reviews: defaultReviews
  });
  const [channels, setChannels] = useState<ChannelKey[]>(["social", "email", "sms", "landing"]);
  const [result, setResult] = useState<TangoResponse | null>(null);
  const [activityLog, setActivityLog] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCount = channels.length;

  const handleFieldChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleChannel = (id: ChannelKey) => {
    setChannels((prev) =>
      prev.includes(id) ? prev.filter((channel) => channel !== id) : [...prev, id]
    );
  };

  const pushLog = (message: string) => {
    setActivityLog((prev) => [
      `${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} — ${message}`,
      ...prev
    ].slice(0, 12));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    pushLog("Submitting brief to Tango (Qwen 32B)");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          channels
        })
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? "Request failed");
      }

      const json = (await response.json()) as { result: TangoResponse };
      setResult(json.result);
      pushLog("Campaign kit ready");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
      pushLog(`Error: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const summaryCards = useMemo(() => {
    if (!result) return [];
    return [
      {
        title: "Campaign Title",
        body: result.campaignTitle,
        accent: "bg-emerald-500/10 border-emerald-500/30"
      },
      {
        title: "Core Promise",
        body: result.corePromise,
        accent: "bg-sky-500/10 border-sky-500/30"
      },
      {
        title: "Launch Strategy",
        body: result.launchStrategy,
        accent: "bg-violet-500/10 border-violet-500/30"
      }
    ];
  }, [result]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <header className="mb-10 flex flex-col gap-4">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Echo · Bravo · Tango</p>
          <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
            Launch-grade campaign kits straight from raw customer proof.
          </h1>
          <p className="max-w-2xl text-base text-slate-300">
            Paste real reviews, pick your tone, and let Tango (powered by Qwen 32B) craft synchronized assets for email, SMS, social, and landing hero blocks. Designed for blunt monetization experiments when every hour of GPU time needs to pay rent.
          </p>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-white">Business Name</span>
                <input
                  value={form.businessName}
                  onChange={(e) => handleFieldChange("businessName", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-base text-white focus:border-emerald-400 focus:outline-none"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-white">Industry</span>
                <select
                  value={form.industry}
                  onChange={(e) => handleFieldChange("industry", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-base text-white"
                >
                  {industryOptions.map((option) => (
                    <option key={option} value={option} className="bg-slate-900">
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-white">Tone</span>
                <select
                  value={form.tone}
                  onChange={(e) => handleFieldChange("tone", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-base text-white"
                >
                  {toneOptions.map((option) => (
                    <option key={option} value={option} className="bg-slate-900">
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-white">Key Differentiator</span>
                <select
                  value={form.differentiator}
                  onChange={(e) => handleFieldChange("differentiator", e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-base text-white"
                >
                  {differentiators.map((option) => (
                    <option key={option} value={option} className="bg-slate-900">
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-white">Primary CTA</span>
              <input
                value={form.callToAction}
                onChange={(e) => handleFieldChange("callToAction", e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-base text-white"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-white">Customer Proof / Reviews</span>
              <textarea
                rows={7}
                value={form.reviews}
                onChange={(e) => handleFieldChange("reviews", e.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-slate-900 px-4 py-3 text-base text-white"
              />
              <p className="text-xs text-slate-400">Paste up to ~1,500 words. Real names + figures outperform fluff.</p>
            </label>

            <div>
              <p className="mb-3 text-sm font-semibold text-white">
                Channels ({selectedCount}/4)
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {channelOptions.map((channel) => {
                  const active = channels.includes(channel.id);
                  return (
                    <button
                      key={channel.id}
                      type="button"
                      onClick={() => toggleChannel(channel.id)}
                      className={`rounded-2xl border px-4 py-3 text-left transition ${
                        active
                          ? "border-emerald-400 bg-emerald-400/10"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <p className="text-sm font-semibold text-white">{channel.label}</p>
                      <p className="text-xs text-slate-400">{channel.helper}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-3xl bg-emerald-400/90 py-4 text-lg font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Generating..." : "Generate campaign kit"}
            </button>
            {error && <p className="text-sm text-rose-300">{error}</p>}
          </form>

          <aside className="space-y-5 rounded-3xl border border-white/5 bg-slate-900/40 p-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Activity</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                {activityLog.length === 0 && (
                  <li className="text-slate-500">Awaiting first run.</li>
                )}
                {activityLog.map((entry, index) => (
                  <li key={index} className="rounded-xl bg-white/5 px-3 py-2">
                    {entry}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">Benchmark tip</p>
              <p className="mt-2 text-slate-300">
                Run <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs">npm run benchmark</code> to hammer Qwen 32B with stacked briefs. Pair the logs with <code className="rounded bg-slate-800 px-1.5 py-0.5 text-xs">tail -f /root/bravo_logs/resource_log_*.csv</code> to watch GPU utilization climb.
              </p>
            </div>
          </aside>
        </section>

        {result && (
          <section className="mt-12 space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
              {summaryCards.map((card) => (
                <div
                  key={card.title}
                  className={`rounded-3xl border p-5 text-sm text-slate-100 ${card.accent}`}
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-300">{card.title}</p>
                  <p className="mt-3 text-lg font-semibold text-white">{card.body}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {Object.entries(result.assets).map(([key, asset]) => (
                <div key={key} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                    <span>{key}</span>
                    <span>{asset.cadence}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-white">{asset.headline}</h3>
                  <p className="mt-2 text-sm text-slate-300">{asset.summary}</p>
                  <ul className="mt-4 space-y-2 text-sm text-slate-100">
                    {asset.copy.map((line, idx) => (
                      <li key={idx} className="rounded-2xl bg-slate-900/50 px-3 py-2">
                        {line}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs uppercase tracking-[0.3em] text-emerald-300">Metrics to watch</p>
                  <ul className="mt-2 flex flex-wrap gap-2 text-xs text-emerald-200">
                    {asset.metrics.map((metric) => (
                      <li key={metric} className="rounded-full border border-emerald-400/40 px-3 py-1">
                        {metric}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-500/10 to-sky-500/10 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">QA Checklist</p>
              <ul className="mt-3 grid gap-2 text-sm text-slate-100 md:grid-cols-2">
                {result.qaChecklist.map((item) => (
                  <li key={item} className="rounded-2xl bg-white/5 px-4 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
