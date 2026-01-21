from pydantic import BaseModel

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