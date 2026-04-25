from fastapi import APIRouter
from pydantic import BaseModel
from agents.perceive import perceive
from agents.plan import plan
from agents.act import act
from agents.reflect import reflect

router = APIRouter()

class RunAgentRequest(BaseModel):
    transactions: list[dict]
    creator_profile: dict

class PitchRequest(BaseModel):
    deal: dict
    creator_profile: dict

@router.post("/agent/run")
async def run_agent(req: RunAgentRequest):
    """
    Full Perceive → Plan → Act → Reflect loop
    """
    # PERCEIVE
    perceived = perceive(req.transactions)

    # Attach category from profile to signals
    categories = req.creator_profile.get("categories", [])
    for signal in perceived["deal_signals"]:
        signal["category"] = categories[0] if categories else "fashion"

    # PLAN
    planned = plan(perceived["deal_signals"], req.creator_profile)

    results = []
    for deal in planned["ranked_deals"][:3]:  # Top 3 deals
        # ACT
        acted = act(deal, req.creator_profile)

        # REFLECT
        reflected = reflect(acted["brief"], deal, req.creator_profile)

        results.append({
            "merchant":    deal["merchant"],
            "brief":       acted["brief"],
            "confidence":  reflected["updated_confidence"],
            "potential":   deal["potential"],
            "approved":    reflected["approved"],
        })

    # Compile full agent log
    full_log = []
    for entry in perceived["log"]:
        full_log.append({"stage": "PERCEIVE", "text": entry})
    for entry in planned["log"]:
        full_log.append({"stage": "PLAN", "text": entry})
    for entry in (acted["log"] if results else []):
        full_log.append({"stage": "ACT", "text": entry})
    for entry in (reflected["log"] if results else []):
        full_log.append({"stage": "REFLECT", "text": entry})

    return {
        "deals":            results,
        "competitor_flags": perceived["competitor_flags"],
        "agent_log":        full_log,
    }

@router.post("/agent/pitch")
async def generate_pitch(req: PitchRequest):
    """
    Generate a single pitch brief on demand
    """
    acted    = act(req.deal, req.creator_profile)
    reflected = reflect(acted["brief"], req.deal, req.creator_profile)

    return {
        "brief":      acted["brief"],
        "confidence": reflected["updated_confidence"],
        "approved":   reflected["approved"],
        "feedback":   reflected["feedback"],
    }

@router.get("/health")
async def health():
    return {"status": "Brandly agent is live", "model": "nvidia/nemotron-super-49b-v1"}


@router.post("/chat")
async def chat(request: dict):
    from openai import OpenAI
    import os
    
    client = OpenAI(
        base_url=os.getenv("NIM_BASE_URL"),
        api_key=os.getenv("NVIDIA_API_KEY")
    )
    
    response = client.chat.completions.create(
        model=os.getenv("MODEL"),
        messages=[{"role": "user", "content": request["message"]}],
        max_tokens=120,
        temperature=0.7
    )
    
    return {"answer": response.choices[0].message.content}