# 🏷️ brandly — Creator Commerce Intelligence

> **NVIDIA Inception Portfolio Project** · Built on NVIDIA NeMo & Nemotron-49B via NIM

**brandly** is an AI-powered creator commerce intelligence platform that detects brand deal opportunities from real spend patterns — automatically. Built for influencers, athletes, musicians, and rising creators who deserve to get paid for the brands they already love.

🔗 **Live Demo:** [nemo-retail-intelligence.vercel.app](https://nemo-retail-intelligence.vercel.app)  
🧠 **AI Stack:** NVIDIA Nemotron-Super-49B-v1 · NeMo Microservices · NIM  
📁 **GitHub:** [itsChanelML/nemo-retail-intelligence](https://github.com/itsChanelML/nemo-retail-intelligence)  
👩🏾‍💻 **Builder:** [Chanel Power](https://github.com/itsChanelML) · ML Engineer · NVIDIA Inception

---

## ✦ What brandly Does

brandly monitors a creator's real spend data (via Plaid), cross-references it against their social reach (Instagram, TikTok, YouTube, Snapchat, LinkedIn), and surfaces brand deal opportunities — without the creator having to do anything.

| Your Spend | What brandly Does |
|---|---|
| $312/mo at Chipotle | Detects ambassador-tier threshold · drafts pitch |
| $2,940 on Delta flights | Flags travel creator opportunity · confidence 97% |
| You + friend both shop Gymshark | Surfaces squad co-deal · combined reach 4.2M |
| Instagram: 2.4M followers · 4.2% eng | Weights pitch brief with real negotiating power |

---

## 🧠 Agentic AI Architecture

brandly implements Kay Zhu's GTC 2026 four-stage agentic loop, powered by **NVIDIA Nemotron-Super-49B-v1** via NIM:

```
PERCEIVE → PLAN → ACT → REFLECT
```

| Stage | What the Agent Does |
|---|---|
| **PERCEIVE** | Syncs transactions via Plaid · pulls social reach data from connected platforms |
| **PLAN** | Classifies merchants · detects spend thresholds · scores confidence against creator profile |
| **ACT** | Drafts pitch briefs · surfaces co-deal alerts · generates squad opportunities |
| **REFLECT** | Evaluates brief quality · updates confidence scores · re-weights on new data |

The agent activity layer is visible in-app via a floating pill and expandable reasoning log. Every inference step is shown to the creator in plain, human language — not technical jargon.

**The agent runs autonomously.** When the app loads, it calls `/api/agent/run`, processes the full loop, and surfaces results — the creator never has to press a button to find their deals.

---

## 🏗️ Tech Stack

### Frontend
- **React + Vite** — mobile-first phone-frame UI
- **Outfit** — typography (sleek, readable, Gen Z-forward)
- Custom SVG price tag logo with brand gradient (Yellow → Green → Blue)
- Yellow `#F9E547` → Green `#22C55E` → Blue `#3B82F6` — financial trust palette

### AI / Inference
- **NVIDIA NIM** — inference endpoint
- **nvidia/llama-3.3-nemotron-super-49b-v1** — reasoning model
- Real-time pitch brief generation with Reflect-stage quality evaluation
- Squad co-deal detection across friend networks
- **Ask brandly** — conversational AI assistant powered by Nemotron

### Backend
- **FastAPI + Uvicorn** — Python agentic service
- **4 agent modules:** `perceive.py` · `plan.py` · `act.py` · `reflect.py`
- Full Perceive → Plan → Act → Reflect loop per request
- Swagger UI available at `/docs`

### Financial Data
- **Plaid** integration (simulated in v1)
- American Express, Visa, Mastercard, Discover compatible
- View-only · zero fund movement · 256-bit SSL

### Auth & Security
- Email OTP (6-character alphanumeric · 5-minute expiry)
- OAuth 2.0 social platform verification
- TLS 1.3 · No passwords stored · No API keys exposed to users

---

## 📱 Feature Overview

### Auth Flow
- Splash screen with animated glassmorphism orb
- Email entry with Apple Intelligence autofill detection
- 6-character alphanumeric OTP with countdown timer
- Social platform verification (Instagram, TikTok, YouTube, Snapchat, LinkedIn)
- "Meet brandly" onboarding carousel

### Onboarding Agent
- Creator type selection (Influencer, Athlete, Musician, Streamer, Comedian, Journalist)
- Multi-category drill-down with subcategory lanes
- Top 15 brands per subcategory — tap to select previous deals
- Custom brand entry
- Plaid card connection with trust layer

### Main App (6 Tabs)
- **⚡ Home** — spend overview, real-time deal signals, squad co-deal alerts, live agent activity
- **💳 Spend** — transaction feed with merchant classification and deal flagging
- **🤝 Deals** — AI-detected opportunities with Nemotron pitch brief generation + save to profile
- **👥 Community** — friend feed, squad co-deal alerts, challenge collaboration, creator chat
- **🎯 Challenges** — monthly partner challenges with progress tracking and badge rewards
- **✦ Profile** — connected platforms, saved pitch briefs, badge collection

### Agentic Activity Layer
- Floating agent pill — always visible, shows latest agent action
- Full reasoning log — Perceive → Plan → Act → Reflect with human-readable language
- Live pulse indicator — yellow when scanning, green when complete
- Real backend results when uvicorn is running locally

### Ask brandly
- Conversational AI assistant powered by Nemotron-49B
- Context-aware — knows your spend, reach, and deal pipeline
- Suggested questions: find deals, write pitches, collab recommendations, spend insights
- Free-text input for anything

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/itsChanelML/nemo-retail-intelligence.git
cd nemo-retail-intelligence

# Frontend
cd frontend
npm install
npm run dev
# → http://localhost:5173

# Backend (separate terminal)
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
# → http://localhost:8000/docs
```

### Environment Setup

Create `backend/.env`:
```
NVIDIA_API_KEY=nvapi-your-key-here
NIM_BASE_URL=https://integrate.api.nvidia.com/v1
MODEL=nvidia/llama-3.3-nemotron-super-49b-v1
```

Get your NIM API key at: [build.nvidia.com](https://build.nvidia.com)

### Demo OTP Code
```
BR24X9
```

---

## 🗺️ Roadmap

### V1 (Current) — Frontend + Agentic Backend
- [x] Full auth flow with OTP and social verification
- [x] Tap-first onboarding agent
- [x] Agentic activity layer (Perceive → Plan → Act → Reflect)
- [x] Live Nemotron pitch brief generation via NIM
- [x] Squad co-deal detection
- [x] Community chat + challenge collaboration
- [x] Saved pitch briefs in Profile
- [x] Ask brandly conversational AI assistant
- [x] FastAPI Python backend with 4-agent architecture
- [x] Real agent loop wired to frontend

### V2 — Production Scale
- [ ] Real Plaid transaction sync
- [ ] Real OAuth 2.0 social platform connections
- [ ] NeMo Guardrails for financial advice safety layer
- [ ] PostgreSQL + Supabase for persistent user data
- [ ] NVIDIA Dynamo for multi-agent orchestration
- [ ] Real-time squad deal matching across user graph
- [ ] Manager / talent agency portal
- [ ] Push notifications for new deal signals

### V3 — Ecosystem
- [ ] Stripe Connect for reward payouts
- [ ] Creator analytics dashboard
- [ ] Brand partnership CRM
- [ ] White-label for talent agencies

---

## 💡 Why This Exists

This project demonstrates:

1. **Retail AI applied to creator commerce** — a novel vertical at the intersection of fintech, social, and brand partnerships that nobody has built at this stack level

2. **Production agentic architecture** — the four-stage loop is architecturally accurate, not cosmetic. Each stage has a dedicated Python module with real Nemotron inference

3. **Real ML intuition** — the competitor detection, threshold logic, and confidence scoring mirror production systems built in digital ecommerce production at scale

4. **Developer empathy** — every design decision was made thinking about what a creator would actually trust with their finances and their career

---

## 👩🏾‍💻 Builder

**Chanel Power** — Machine Learning Engineer · Founder & Technical Startup Advisor, Mentor Me Collective

- 7+ years in ML engineering, product and developer relations
- Led GenAI tool adoption across 200+ engineers · shipped Apple Intelligence features
- Built production ML systems including transaction clustering and target messaging for users/merchants to drive partner ecosystem engagement
- Built a suite of internal tooling for ML and QE engineers to drive evaluation of anomaly and drift detection algorithms — semantic search with an embedding approach, validating fine-tuning of transaction models
- Google Certified Generative AI Leader · NVIDIA DLI Certified (3 certifications · April 2026)
- GTC 2026 attendee · Genspark Builder Grant recipient (top 300 globally)
- Founder of MMC — 40K+ members · 120+ countries · $47.3M in documented career outcomes

🔗 [GitHub](https://github.com/itsChanelML) · [LinkedIn](https://linkedin.com/in/powerc1) · [Mentor Me Collective](https://mentormecollective.org)

---

## 📄 License

© 2026 Chanel Power · All rights reserved.

This project is part of a personal portfolio and is not licensed for redistribution, commercial use, or derivative works without explicit written permission from the author.

---

*brandly is a portfolio project demonstrating agentic AI architecture on NVIDIA NIM. Financial data in v1 is synthetic. Plaid, social platform, and card integrations are simulated pending backend development.*