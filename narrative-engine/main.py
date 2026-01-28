print("APP.PY LOADED — GENERATOR VERSION — HEALTH DEBUG", flush=True)

from fastapi import FastAPI
from collections import defaultdict
import random
from dotenv import load_dotenv
import os

load_dotenv()

from models.schemas import (
    SecretInput,
    SecretResult,
    GenerateRequest,
    GeneratedSecret,
)

from rules.secret_analyzer import analyze_secret_logic
from app_secrets.secret_generator import generate_secret_logic


# ------------------------
# Runtime State
# ------------------------

recent_secrets = defaultdict(list)
MAX_MEMORY = 5


# ------------------------
# App Setup
# ------------------------

app = FastAPI()


# ------------------------
# Routes
# ------------------------

@app.post("/analyze-secret", response_model=SecretResult)
def analyze_secret(payload: SecretInput):

    result = analyze_secret_logic(payload.text)

    return result


@app.post("/generate-secret", response_model=GeneratedSecret)
def generate_secret(payload: GenerateRequest):

    result = generate_secret_logic(
        npc_name=payload.npc_name,
        preset=payload.preset,
        memory_store=recent_secrets,
        max_memory=MAX_MEMORY,
        rng=random
    )

    return result

# ------------------------
# Health Check (PRODUCTION)
# ------------------------

def health_handler():
    return {"status": "ok"}

app.add_api_route("/health", health_handler, methods=["GET"])

@app.on_event("startup")
async def dump_routes():
    print("==== REGISTERED ROUTES ====", flush=True)
    for r in app.routes:
        print(r.path, flush=True)


