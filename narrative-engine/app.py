print("APP.PY LOADED — GENERATOR VERSION")
from fastapi import FastAPI
from pydantic import BaseModel
import random

app = FastAPI()

class SecretInput(BaseModel):
    text: str
    role: str | None = None
    agenda: str | None = None

class SecretResult(BaseModel):
    category: str
    confidence: float
    notes: list[str]

class GenerateRequest(BaseModel):
    npc_name: str
    role: str | None = None
    race: str | None = None
    preset: str

class GeneratedSecret(BaseModel):
    text: str
    category: str
    confidence: float


@app.post("/analyze-secret", response_model=SecretResult)
def analyze_secret(payload: SecretInput):

    text = payload.text.lower()
    notes = []
    category = "unknown"
    confidence = 0.5

    if "betray" in text or "spy" in text:
        category = "danger"
        confidence = 0.85
        notes.append("Betrayal intent detected")

    if "secretly" in text:
        notes.append("Hidden motivation pattern detected")

    return {
        "category": category,
        "confidence": confidence,
        "notes": notes
    }


@app.post("/generate-secret", response_model=GeneratedSecret)
def generate_secret(payload: GenerateRequest):

    templates = {
        "political": [
            "Is secretly negotiating with a rival faction to undermine local leadership.",
            "Publicly loyal but privately gathering leverage for a future coup.",
        ],
        "criminal": [
            "Smuggles contraband through official channels.",
            "Pays protection money to an underground syndicate.",
        ],
        "arcane": [
            "Possesses forbidden magical knowledge obtained illegally.",
            "Bound to an ancient artifact with unknown consequences.",
        ],
        "personal": [
            "Hiding a family betrayal that could destroy their reputation.",
            "Protecting someone dangerous out of misplaced loyalty.",
        ],
        "random": [
            "Maintains secret correspondence with an unknown benefactor.",
            "Operating under a false identity.",
        ],
    }

    pool = templates.get(payload.preset, templates["random"])
    secret_text = random.choice(pool)

    category_map = {
        "political": "agenda",
        "criminal": "danger",
        "arcane": "unknown",
        "personal": "hook",
        "random": "unknown",
    }

    return {
        "text": f"{payload.npc_name} {secret_text}",
        "category": category_map.get(payload.preset, "unknown"),
        "confidence": round(random.uniform(0.6, 0.9), 2),
    }

