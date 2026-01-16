from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class SecretInput(BaseModel):
    text: str
    role: str | None = None
    agenda: str | None = None

class SecretResult(BaseModel):
    category: str
    confidence: float
    notes: list[str]

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
