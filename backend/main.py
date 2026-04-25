from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Brandly — NeMo Retail Intelligence API",
    description="Agentic AI backend powered by NVIDIA Nemotron-49B via NIM. Perceive → Plan → Act → Reflect.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://nemo-retail-intelligence.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
async def root():
    return {
        "name":    "Brandly NeMo Retail Intelligence",
        "version": "1.0.0",
        "stack":   "NVIDIA Nemotron-Super-49B-v1 via NIM",
        "stages":  ["PERCEIVE", "PLAN", "ACT", "REFLECT"],
    }
