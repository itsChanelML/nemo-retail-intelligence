import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url=os.getenv("NIM_BASE_URL"),
    api_key=os.getenv("NVIDIA_API_KEY"),
)

def act(deal: dict, creator_profile: dict) -> dict:
    """
    ACT stage — generate personalized pitch brief using Nemotron
    """
    log = []

    merchant   = deal["merchant"]
    spend      = deal["total_spend"]
    potential  = deal["potential"]
    confidence = deal["confidence"]
    name       = creator_profile.get("name", "the creator")

    # Build social summary
    socials = creator_profile.get("socials", {})
    social_lines = []
    for platform, data in socials.items():
        if data.get("connected"):
            social_lines.append(
                f"{platform.capitalize()}: "
                f"{data.get('followers', '—')} followers, "
                f"{data.get('engagement', '—')} engagement"
            )
    social_summary = " | ".join(social_lines) if social_lines else "Social platforms not connected"

    log.append(f"Generating pitch brief for {merchant}")
    log.append(f"Using social data: {social_summary}")

    prompt = f"""You are Brandly, an AI financial advisor for creators and influencers.

Creator: {name}
Social reach: {social_summary}
Spend at {merchant}: ${spend:.0f} this month
Deal potential: {potential}
Confidence score: {confidence}%

Write a 3-part pitch brief (separated by line breaks, no bullet points or headers):
1. Why {merchant} needs this creator specifically
2. What makes this pitch unique and hard to say no to
3. The exact first outreach step the talent manager should take

Tone: confident advisor. Direct. No fluff. No corporate speak."""

    response = client.chat.completions.create(
        model=os.getenv("MODEL"),
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
        temperature=0.72,
    )

    brief = response.choices[0].message.content

    log.append(f"Pitch brief generated · {len(brief.split())} words")
    log.append(f"Confidence score: {confidence}%")

    return {
        "stage": "ACT",
        "log": log,
        "merchant": merchant,
        "brief": brief,
        "potential": potential,
        "confidence": confidence,
    }
