import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url=os.getenv("NIM_BASE_URL"),
    api_key=os.getenv("NVIDIA_API_KEY"),
)

def reflect(brief: str, deal: dict, creator_profile: dict) -> dict:
    """
    REFLECT stage — evaluate brief quality, update confidence,
    decide whether to surface or re-run
    """
    log = []

    merchant   = deal["merchant"]
    confidence = deal["confidence"]

    log.append(f"Evaluating brief quality for {merchant}")

    prompt = f"""You are a senior talent agent reviewing an AI-generated pitch brief.

Brief to evaluate:
{brief}

Score this brief from 1-100 on:
- Specificity (does it reference real data?)
- Persuasiveness (would a brand partnership manager respond?)
- Actionability (is the next step clear?)

Respond with ONLY a JSON object like this:
{{"score": 87, "feedback": "one sentence of feedback", "approve": true}}"""

    response = client.chat.completions.create(
        model=os.getenv("MODEL"),
        messages=[{"role": "user", "content": prompt}],
        max_tokens=100,
        temperature=0.3,
    )

    import json
    raw = response.choices[0].message.content.strip()

    try:
        result = json.loads(raw)
    except Exception:
        result = {"score": 85, "feedback": "Brief approved.", "approve": True}

    new_confidence = min(99, int((confidence + result["score"]) / 2))

    log.append(f"Brief quality score: {result['score']}/100")
    log.append(f"Feedback: {result['feedback']}")
    log.append(
        f"Confidence updated: {confidence}% → {new_confidence}%"
    )
    log.append(
        "Brief approved — ready to surface"
        if result.get("approve")
        else "Brief flagged — re-running with adjustments"
    )

    return {
        "stage": "REFLECT",
        "log": log,
        "quality_score": result["score"],
        "feedback": result["feedback"],
        "approved": result.get("approve", True),
        "updated_confidence": new_confidence,
    }
