# brandly — Product Brief
### Creator Commerce Intelligence · NVIDIA Inception Portfolio

---

## The Problem

Creators are walking billboards for brands they already love — and they don't even know it.

Kai Cenat spends $400 a month at Chipotle. Caitlin Clark flies Delta for every away game. A rising fitness creator buys Gymshark every season. These are not just purchases — they are authentic brand relationships worth tens of thousands of dollars in partnership value. But without a system to surface them, creators leave that money on the table every single month.

Traditional brand deal discovery is slow, manual, and relationship-dependent. Creators rely on managers who rely on inbounds. The data that would make a pitch irresistible — real spend history, authentic usage, audience overlap — is sitting in their bank statements, invisible.

---

## The Solution

**brandly** is an AI-powered creator commerce intelligence platform. It connects to a creator's financial data, analyzes their spend patterns, cross-references their social reach, and surfaces brand deal opportunities — automatically, before the creator even thinks to look.

When brandly detects that a creator has spent $312 at Chipotle this month, it doesn't just flag it. It drafts a pitch brief using their actual Instagram engagement rate, identifies whether any squad members have overlapping spend, calculates a confidence score, and queues it for the creator's review. The creator opens the app and their next brand deal is already waiting.

---

## How It Works

brandly runs a four-stage agentic AI loop powered by NVIDIA Nemotron-Super-49B-v1:

**PERCEIVE** — brandly syncs the creator's transactions via Plaid and pulls their social reach from connected platforms. It knows what they spend, where they spend it, and how much influence they carry.

**PLAN** — The agent classifies each merchant, detects when spend crosses the brand deal threshold ($250/month), and scores each opportunity by matching spend history against the creator's content niche and audience profile.

**ACT** — brandly drafts a personalized pitch brief using the creator's real data. It also scans the creator's friend network for spend overlaps and generates squad co-deal opportunities with combined reach calculations.

**REFLECT** — The agent evaluates its own pitch quality, scores it on specificity, persuasiveness, and actionability, updates the confidence score, and decides whether to surface it or refine it further.

This loop runs every time the app is opened. The creator never presses a button to find their deals.

---

## Who It's For

brandly is built for the creator economy's underserved middle — creators with real audiences and authentic brand relationships who lack the infrastructure to monetize them.

**Primary users:**
- Social media influencers (100K–5M followers)
- Athletes with personal brands
- Musicians and entertainers
- Streamers and gaming creators
- Rising voices across fitness, beauty, travel, and food

**The brandly creator profile:**
- Spends money on the brands they talk about
- Has an engaged audience in a defined niche
- Works with a manager or talent agency (or wants to)
- Is tired of leaving brand deals to chance

---

## Key Features

**Deal Intelligence**
brandly detects brand deal opportunities from real spend data and surfaces them with estimated deal value ranges ($5K–$50K+), confidence scores, and ready-to-send pitch briefs.

**Squad Co-Deals**
When two creators in the same network spend heavily at the same brand, brandly surfaces a squad co-deal opportunity with combined reach data — a feature no other platform offers.

**Ask brandly**
A conversational AI assistant powered by Nemotron-49B. Creators can ask anything — "find me a brand deal this week," "help me write a pitch," "who should I collab with?" — and get context-aware responses based on their actual spend and social data.

**Community**
Creators can connect with friends, enter monthly challenges together, and chat directly inside the app. Shared brand overlap is highlighted to facilitate organic collaboration.

**Profile Intelligence**
Every pitch brief a creator generates is saved to their profile. Their connected social platforms feed real follower counts and engagement rates into every deal calculation.

**Transparent AI**
The agent's reasoning is visible at all times — not as technical logs, but in plain language. Creators can see exactly how brandly found their deals and why it's confident in each one.

---

## The Retail AI Connection

brandly sits at the intersection of retail AI and the creator economy in a way that maps directly to NVIDIA's Inception program priorities:

- **Merchant intelligence at the consumer level** — the same transaction classification and anomaly detection logic that powers enterprise retail AI, applied to individual creator spend
- **Agentic commerce** — not just recommendations, but autonomous deal discovery and pitch generation
- **NeMo Microservices in production** — the backend uses FastAPI with four discrete agent modules, each making real Nemotron inference calls
- **Creator as merchant partner** — brandly reframes the creator as a distribution channel for brands, powered by verified spend data instead of claimed affinity

This is retail AI that works for the person, not the enterprise.

---

## Technical Architecture

```
Creator App (React + Vite)
        ↓ HTTP
FastAPI Backend (Python)
        ↓
┌─────────────────────────────────┐
│  perceive.py  →  Sync & classify│
│  plan.py      →  Score & rank   │
│  act.py       →  Draft & pitch  │
│  reflect.py   →  Evaluate & tune│
└─────────────────────────────────┘
        ↓
NVIDIA NIM · Nemotron-Super-49B-v1
```

**Frontend:** React, Vite, mobile-first phone-frame UI  
**Backend:** FastAPI, Uvicorn, Python 3.9+  
**AI Model:** nvidia/llama-3.3-nemotron-super-49b-v1 via NIM  
**Financial:** Plaid (simulated v1)  
**Auth:** Email OTP · OAuth 2.0 · TLS 1.3  
**Deploy:** Vercel (frontend) · GCP planned (backend v2)

---

## Origin

brandly was built by Chanel Power, a Machine Learning Engineer and former Apple AI engineer, as an NVIDIA Inception portfolio project. The core insight came from her curiousity around merchant redirect nudges — leveraging a production ML system that detects competitor purchases and drives lift in partner merchant spend over consecutive quarters.

That curiousity, intentional intelligence, and creator economy application, becomes brandly.

---

## Current Status

**V1 is live.** The frontend is deployed on Vercel. The Python backend runs locally with full Nemotron inference. The agentic loop is wired end-to-end. Ask brandly responds in real time.

V2 development focuses on real Plaid integration, OAuth social connections, NeMo Guardrails for financial safety, and NVIDIA Dynamo for multi-agent orchestration at scale.

---

*© 2026 Chanel Power · All rights reserved · NVIDIA Inception Portfolio Project*