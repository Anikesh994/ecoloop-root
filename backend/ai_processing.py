import json

def simulate_computer_vision_assessment(image_key: str) -> dict:
    """Simulates pixel-level artifact scanning on returns."""
    print(f"[VISION INFRA] Scanning target matrix payload: {image_key}")
    return {
        "status": "ANALYSIS_SUCCESS",
        "detected_artifacts": [
            {"label": "cosmetic_scratch", "confidence": 0.94, "location": "rear_chassis"},
            {"label": "corner_dent", "confidence": 0.81, "location": "lower_left_rim"}
        ]
    }

def calculate_second_life_routing(vision_data: dict, original_price: float) -> dict:
    """Algorithmic Value Markdown Matrix."""
    artifacts = vision_data.get("detected_artifacts", [])
    damage_score = len(artifacts) * 0.15
    markdown_factor = 1.0 - damage_score
    calculated_resale_price = original_price * markdown_factor
    
    return {
        "assignedGrade": "Grade B (Refurbished)" if damage_score <= 0.30 else "Grade C",
        "routingDecision": "RESALE_MARKETPLACE",
        "suggestedPrice": round(calculated_resale_price, 2),
        "greenCreditsEarned": int(original_price * 0.002)
    }