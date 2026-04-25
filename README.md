# 🏷️ Brandly — Creator Commerce Intelligence

> **NVIDIA Inception Portfolio Project** · Built on NVIDIA NeMo & Nemotron-49B via NIM

**Brandly** is an AI-powered creator commerce intelligence platform that detects brand deal opportunities from real spend patterns — automatically. Built for influencers, athletes, musicians, and rising creators who deserve to get paid for the brands they already love.

🔗 **Live Demo:** [brandly.vercel.app](https://brandly.vercel.app)  
🧠 **AI Stack:** NVIDIA Nemotron-Super-49B-v1 via NIM  
📁 **Portfolio:** [NVIDIA DevRel Portfolio — Chanel Power](https://github.com/itsChanelML)

---

## ✦ What It Does

Brandly monitors a creator's real spend data (via Plaid), cross-references it against their social reach (Instagram, TikTok, YouTube, Snapchat, LinkedIn), and surfaces brand deal opportunities — without the creator having to do anything.

| Signal | What Brandly Does |
|---|---|
| You spend $312/mo at Chipotle | Detects ambassador-tier spend threshold |
| You spend $2,940 on Delta flights | Flags travel creator opportunity |
| You + a friend both shop Gymshark | Surfaces a squad co-deal pitch |
| You connect Instagram (2.4M followers) | Weights your pitch brief with real reach data |

---

## 🧠 Agentic AI Architecture

Brandly implements Kay Zhu's GTC 2026 four-stage agentic loop, powered by **NVIDIA Nemotron-Super-49B-v1**:

```
PERCEIVE → PLAN → ACT → REFLECT
```

| Stage | What the Agent Does |
|---|---|
| **PERCEIVE** | Syncs transactions via Plaid, pulls social reach data |
| **PLAN** | Classifies merchants, detects spend thresholds, scores confidence |
| **ACT** | Drafts pitch briefs, surfaces co-deal alerts, generates squad opportunities |
| **REFLECT** | Evaluates brief quality, updates confidence scores, re-weights on new data |

The agent activity layer is visible in-app via a floating pill and expandable reasoning log — every inference step is shown to the user in plain language.

---

## 🏗️ Tech Stack

### Frontend
- **React** + **Vite** — mobile-first, phone-frame UI
- **Outfit** — typography
- Custom SVG price tag logo with brand gradient

### AI / Inference
- **NVIDIA NIM** — inference endpoint
- **nvidia/nemotron-super-49b-v1** — reasoning model
- Real-time pitch brief generation
- Squad co-deal detection across friend networks

### Financial Data
- **Plaid** integration (simulated in v1)
- American Express, Visa, Mastercard compatible
- View-only · zero fund movement

### Auth & Security
- Email OTP (6-character alphanumeric, 5-minute expiry)
- OAuth 2.0 social verification
- TLS 1.3 · No passwords stored

---

## 📱 Features

### Auth Flow
- Splash screen with animated glassmorphism orb
- Email entry with Apple Intelligence autofill detection
- 6-character alphanumeric OTP with countdown timer
- Social platform verification (Instagram, TikTok, YouTube, Snapchat, LinkedIn)
- "Meet Brandly" onboarding carousel

### Onboarding Agent
- Creator type selection (Influencer, Athlete, Musician, Streamer, Comedian, Journalist)
- Multi-category selection with per-category drill-down
- Top 15 brands per subcategory (tap to select previous deals)
- Custom brand entry
- Plaid card connection with trust layer

### Main App (6 Tabs)
- **⚡ Home** — spend overview, deal signals, squad co-deal alerts, agent activity teaser
- **💳 Spend** — transaction feed with merchant classification and deal flagging
- **🤝 Deals** — AI-detected brand opportunities with Nemotron pitch brief generation
- **👥 Community** — friend feed, squad co-deal alerts, challenge collaboration
- **🎯 Challenges** — monthly partner challenges with progress tracking and badge rewards
- **✦ Profile** — connected platforms, badge collection, Amex card management

### Agentic Activity Layer
- Floating agent pill visible on every screen
- Full Perceive → Plan → Act → Reflect reasoning log
- Color-coded by stage with timestamps
- Live pulse indicator showing agent is actively monitoring

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/itsChanelML/nemo-retail-intelligence.git
cd nemo-retail-intelligence

# Install dependencies
npm install

# Run locally
npm run dev
```

Open `http://localhost:5173`

### Connect NVIDIA NIM (optional for local dev)

Tap **⚡ NIM** in the top right of the app header and enter your NVIDIA NIM API key (`nvapi-...`). This activates live Nemotron inference for pitch brief generation and spend insights.

Get your key at: [build.nvidia.com](https://build.nvidia.com)

---

## 🗺️ Roadmap

### V1 (Current) — Frontend
- [x] Full auth flow with OTP and social verification
- [x] Tap-first onboarding agent
- [x] Agentic activity layer (Perceive → Plan → Act → Reflect)
- [x] Live Nemotron pitch brief generation via NIM
- [x] Squad co-deal detection
- [x] Community + challenge collaboration

### V2 — NeMo Python Backend
- [ ] FastAPI service with NeMo Microservices
- [ ] Real Plaid transaction sync
- [ ] Nemotron-powered transaction classification pipeline
- [ ] Long-horizon agent with persistent memory
- [ ] NeMo Guardrails for financial advice safety layer
- [ ] Real OAuth 2.0 social platform connections
- [ ] PostgreSQL + Supabase for user data

### V3 — Scale
- [ ] NVIDIA Dynamo for multi-agent orchestration
- [ ] Real-time squad deal matching across user graph
- [ ] Creator analytics dashboard (admin view)
- [ ] Manager / talent agency portal
- [ ] Stripe Connect for reward payouts

---

## 🎯 Why This Exists

This project was built as part of my NVIDIA Inception portfolio to demonstrate:

1. **Retail AI applied to creator commerce** — a novel vertical nobody has built at this intersection
2. **Production agentic architecture** — the four-stage loop is architecturally accurate, not cosmetic
3. **Real ML intuition** — the competitor detection, threshold logic, and confidence scoring mirror production systems I shipped at Apple (transaction clustering, 95.5% precision, merchant redirect nudges across Apple Card's 3% partner ecosystem)
4. **Developer empathy** — every design and UX decision was made thinking about what a creator would actually trust with their finances

---

## 👩🏾‍💻 About the Builder

**Chanel Power** — Machine Learning Engineer, Founder & Engineering Manager at [Mentor Me Collective](https://mentormecollective.org)

- 7+ years in ML engineering and developer relations
- Led GenAI tool adoption across 200+ engineers, shipped Apple Intelligence features
- Built production ML systems including transaction clustering (95.5% precision) and merchant redirect nudges for Apple Card
- Google Certified Generative AI Leader · NVIDIA DLI Certified (3 certifications, April 2026)
- GTC 2026 attendee · Genspark Builder Grant recipient (top 300 globally)
- Founder of MMC — 40K+ community members, 120+ countries, $47.3M in documented career outcomes

🔗 [GitHub](https://github.com/itsChanelML) · [LinkedIn](https://linkedin.com/in/powerc1) · [Mentor Me Collective](https://mentormecollective.org)

---

## 📄 License

Built with 🏷️ by Chanel Power for the NVIDIA Inception ecosystem

© 2026 Chanel Power · All rights reserved.

This project is part of a personal portfolio and is not licensed for redistribution, commercial use, or derivative works without explicit written permission from the author.

---

*Brandly is a portfolio project demonstrating agentic AI architecture on NVIDIA NIM. Financial data in v1 is synthetic. Plaid, social platform, and card integrations are simulated pending backend development.*