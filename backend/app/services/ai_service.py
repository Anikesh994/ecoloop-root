import random
from typing import Optional


def simulate_rekognition_grading(image_keys: list[str], category: str) -> dict:
    """Simulates Amazon Rekognition product condition analysis."""
    detected_issues = []
    possible_issues = [
        {"label": "cosmetic_scratch", "locations": ["rear panel", "front screen", "side edge"]},
        {"label": "corner_dent", "locations": ["top left", "bottom right", "lower edge"]},
        {"label": "discoloration", "locations": ["back cover", "screen bezel"]},
        {"label": "missing_part", "locations": ["accessory slot", "packaging"]},
        {"label": "crack", "locations": ["screen corner", "housing"]},
    ]

    num_issues = random.randint(0, 3)
    for _ in range(num_issues):
        issue = random.choice(possible_issues)
        detected_issues.append({
            "label": issue["label"],
            "confidence": round(random.uniform(0.70, 0.98), 2),
            "location": random.choice(issue["locations"])
        })

    damage_score = min(1.0, len(detected_issues) * 0.15 + random.uniform(0, 0.1))
    return {
        "status": "ANALYSIS_SUCCESS",
        "detected_issues": detected_issues,
        "damage_score": round(damage_score, 3),
        "image_count": len(image_keys)
    }


def compute_grade(damage_score: float) -> str:
    if damage_score < 0.10:
        return "Grade A"
    elif damage_score < 0.25:
        return "Grade B"
    elif damage_score < 0.45:
        return "Grade C"
    else:
        return "Grade D"


def compute_routing(grade: str, category: str) -> str:
    routing_map = {
        "Grade A": "RESELL",
        "Grade B": "RESELL",
        "Grade C": "REFURBISH",
        "Grade D": "DONATE"
    }
    return routing_map.get(grade, "RECYCLE")


def compute_pricing(original_price: float, damage_score: float) -> float:
    markdown = 1.0 - damage_score
    return round(original_price * markdown, 2)


def compute_green_credits(original_price: float, routing: str) -> int:
    base = int(original_price * 0.005)
    multipliers = {"RESELL": 1, "REFURBISH": 2, "DONATE": 3, "RECYCLE": 1}
    return base * multipliers.get(routing, 1)


def predict_return_risk(category: str, price: float, user_return_rate: float = 0.15) -> dict:
    """Simulates SageMaker return prediction inference."""
    category_rates = {
        "Fashion": 0.35, "Electronics": 0.15, "Home": 0.10,
        "Sports": 0.12, "Toys": 0.08, "Books": 0.05
    }
    cat_rate = category_rates.get(category, 0.15)

    base_risk = (cat_rate + user_return_rate) / 2
    noise = random.uniform(-0.1, 0.15)
    risk_score = max(0.0, min(1.0, base_risk + noise))

    factors = []
    if cat_rate > 0.25:
        factors.append(f"{category} has {int(cat_rate*100)}% avg return rate")
    if user_return_rate > 0.20:
        factors.append("Higher than average personal return rate")
    if price > 20000:
        factors.append("High-value item increases return likelihood")
    if risk_score > 0.5:
        factors.append("Impulse purchase pattern detected")
    if not factors:
        factors.append("Low risk profile")
        factors.append("Consistent purchase history")

    if risk_score > 0.6:
        rec = "High risk: Review size guide and product video before buying"
    elif risk_score > 0.35:
        rec = "Moderate risk: Check recent reviews for sizing/quality feedback"
    else:
        rec = "Low risk: Good match for your purchase history"

    return {
        "risk_score": round(risk_score, 3),
        "risk_factors": factors,
        "recommendation": rec,
        "potential_savings": round(price * risk_score * 0.2, 2)
    }