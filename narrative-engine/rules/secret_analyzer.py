def analyze_secret_logic(text: str) -> dict:
    text = text.lower()
    notes = []

    category = "unknown"
    confidence = 0.4

    criminal_terms = ["smuggl", "weapon", "thief", "illegal", "contraband", "black market"]
    betrayal_terms = ["betray", "spy", "traitor", "double agent"]
    political_terms = ["coup", "overthrow", "election", "senate", "duke", "king"]
    arcane_terms = ["artifact", "ritual", "forbidden", "curse", "demon", "summon"]
    secrecy_terms = ["secretly", "hidden", "covert", "unknown"]

    if any(term in text for term in secrecy_terms):
        notes.append("Hidden motivation pattern detected")
        confidence += 0.15

    if any(term in text for term in criminal_terms):
        category = "danger"
        notes.append("Criminal activity detected")
        confidence = max(confidence, 0.75)

    if any(term in text for term in betrayal_terms):
        category = "danger"
        notes.append("Betrayal behavior detected")
        confidence = max(confidence, 0.85)

    if any(term in text for term in political_terms):
        if category == "unknown":
            category = "agenda"
        notes.append("Political influence detected")
        confidence += 0.1

    if any(term in text for term in arcane_terms):
        category = "unknown"
        notes.append("Arcane anomaly detected")
        confidence += 0.1

    confidence = min(round(confidence, 2), 0.95)

    return {
        "category": category,
        "confidence": confidence,
        "notes": notes
    }
