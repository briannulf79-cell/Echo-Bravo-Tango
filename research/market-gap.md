# Market Gap Notes — Tango Campaign Kits

_Last updated: 2026-03-05_

## 1. Signals from recent coverage
- **Home-service operators want fewer tools, not more.** Contractors are being urged to adopt a "lean AI stack" that automates lead-gen + reputation work, but articles like Unify360's 2026 playbook still point to patching together reviews, chatbots, and ad libraries manually.<sup>[1](https://unify360.com/the-2026-ai-marketing-stack-for-home-services-what-you-actually-need-to-scale/)</sup>
- **Generic AI marketing suites ignore family / faith / micro-operator niches.** Roundups (MarketerMilk, SelfMadeMillennials) showcase 30+ tools, yet none convert household testimonials or church/community feedback into monetizable kits.<sup>[2](https://www.marketermilk.com/blog/ai-marketing-tools)</sup><sup>[3](https://selfmademillennials.com/ai-marketing-tools/)</sup>
- **Big-cloud guidance focuses on enterprise assets.** AWS + Google Labs posts describe elaborate pipelines using historical creative libraries—overkill for parents running Earn-E pods or small congregations needing weekly outreach.<sup>[4](https://aws.amazon.com/blogs/machine-learning/accelerating-your-marketing-ideation-with-generative-ai-part-2-generate-custom-marketing-images-from-historical-references/)</sup><sup>[5](https://blog.google/innovation-and-ai/models-and-research/google-labs/pomelli-photoshoot/)</sup>

## 2. Identified gap
> No fast way for family-focused or faith-driven local operators to turn **real reviews** into a **cohesive multi-channel launch kit** (email + SMS + social + landing hero) without touching a mega-platform or agency.

Implications:
- They already have testimonials (Earn-E parents, homeschool co-ops, small ministries) but lack time/budget to craft campaigns.
- Existing AI tools spit out isolated copy/imagery; none enforce consistency, cadence, or metrics per channel.
- Bravo's always-on VM + Qwen 32B can churn out these kits continuously, so we can essentially sell "campaigns on tap" while proving Brainstorm's value.

## 3. Product direction for Echo-Bravo-Tango
1. **Brief builder (UI done in Next.js)** where a user pastes reviews, picks tone/CTA, and selects channels.
2. **Structured JSON response** (already specified in `/app/src/lib/prompt.ts`) to keep assets drop-in ready for emails, SMS, carousels, and hero sections.
3. **Benchmark + logging** feed real utilization metrics so we can market "tested on real hardware" and keep Bravo busy for $0.50/hr.
4. **Next milestone:** attach pricing experiments (e.g., $29 micro-campaign drop) once the generator hits MVP quality.

## 4. Open questions
- Do we need an automatic source-of-truth for reviews (Google/Stripe exports) or is manual paste acceptable for v1?
- Which niche converts first: Earn-E families, homeschool networks, or small churches? (Leaning Earn-E for immediate case study.)
- Should we ship prebuilt templates ("Saturday sprint", "Allowance reset", etc.) or keep it fully custom per run?

---
_Compiled by Echo. Sources are linked inline for easy follow-up._
