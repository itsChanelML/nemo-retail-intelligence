import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url=os.getenv("NIM_BASE_URL"),
    api_key=os.getenv("NVIDIA_API_KEY"),
)

DEAL_RANGES = {
    "dining":        ("$5K",  "$20K"),
    "travel":        ("$10K", "$50K"),
    "fashion":       ("$8K",  "$30K"),
    "beauty":        ("$5K",  "$25K"),
    "fitness":       ("$8K",  "$30K"),
    "tech":          ("$5K",  "$20K"),
    "entertainment": ("$3K",  "$15K"),
    "gaming":        ("$5K",  "$25K"),
}

def plan(deal_signals: list[dict], creator_profile: dict) -> dict:
    """
    PLAN stage — score opportunities, cross-reference social reach,
    rank deal pipeline
    """
    log = []
    ranked_deals = []

    total_reach = sum([
        p.get("followers_count", 0)
        for p in creator_profile.get("socials", {}).values()
        if p.get("connected")
    ])

    log.append(f"Cross-referencing {len(deal_signals)} signals with creator profile")
    log.append(f"Total social reach: {total_reach:,}")

    for signal in deal_signals:
        merchant   = signal["merchant"]
        total      = signal["total"]
        confidence = signal["confidence"]

        # Boost confidence based on reach
        if total_reach > 1_000_000:
            confidence = min(99, confidence + 10)
        if total_reach > 5_000_000:
            confidence = min(99, confidence + 5)

        # Find deal range for category
        category  = signal.get("category", "fashion")
        low, high = DEAL_RANGES.get(category, ("$3K", "$15K"))

        ranked_deals.append({
            "merchant":   merchant,
            "total_spend": total,
            "confidence": confidence,
            "potential":  f"{low}–{high}",
            "category":   category,
        })

        log.append(
            f"{merchant}: confidence {confidence}% · "
            f"potential {low}–{high} · reach boost applied"
        )

    # Sort by confidence
    ranked_deals.sort(key=lambda x: x["confidence"], reverse=True)
    log.append(f"Ranked {len(ranked_deals)} opportunities by confidence score")

    return {
        "stage": "PLAN",
        "log": log,
        "ranked_deals": ranked_deals,
        "total_reach": total_reach,
    }
