from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url=os.getenv("NIM_BASE_URL"),
    api_key=os.getenv("NVIDIA_API_KEY"),
)

DEAL_THRESHOLD = 250
COMPETITOR_MAP = {
    "Shell": "Exxon",
    "CVS": "Walgreens",
    "Zara": "ASOS",
    "McDonald's": "Shake Shack",
    "H&M": "Urban Outfitters",
    "Starbucks": "Sweetgreen",
}

def perceive(transactions: list[dict]) -> dict:
    """
    PERCEIVE stage — classify transactions, detect thresholds, flag competitors
    """
    log = []
    deal_signals = []
    competitor_flags = []

    # Group spend by merchant
    merchant_totals = {}
    for t in transactions:
        m = t["merchant"]
        merchant_totals[m] = merchant_totals.get(m, 0) + t["amount"]

    log.append(f"Synced {len(transactions)} transactions")

    # Detect deal thresholds
    for merchant, total in merchant_totals.items():
        if total >= DEAL_THRESHOLD:
            deal_signals.append({
                "merchant": merchant,
                "total": total,
                "confidence": min(99, int((total / DEAL_THRESHOLD) * 75)),
            })
            log.append(f"{merchant}: ${total:.0f} spend · threshold exceeded")

    # Detect competitor purchases
    for t in transactions:
        if t["merchant"] in COMPETITOR_MAP:
            partner = COMPETITOR_MAP[t["merchant"]]
            competitor_flags.append({
                "spent_at": t["merchant"],
                "amount": t["amount"],
                "partner": partner,
            })
            log.append(f"Competitor detected: {t['merchant']} → redirect to {partner}")

    log.append("Monitoring for new transactions…")

    return {
        "stage": "PERCEIVE",
        "log": log,
        "deal_signals": deal_signals,
        "competitor_flags": competitor_flags,
        "merchant_totals": merchant_totals,
    }
