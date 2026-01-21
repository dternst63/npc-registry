import pytest
from pydantic import ValidationError

from models.schemas import (
    SecretInput,
    SecretResult,
    GenerateRequest,
    GeneratedSecret,
)


# ------------------------
# SecretInput Tests
# ------------------------

def test_secret_input_valid_minimal():
    payload = SecretInput(text="Some secret")

    assert payload.text == "Some secret"
    assert payload.role is None
    assert payload.agenda is None


def test_secret_input_missing_text_fails():
    with pytest.raises(ValidationError):
        SecretInput()


# ------------------------
# SecretResult Tests
# ------------------------

def test_secret_result_valid():
    result = SecretResult(
        category="danger",
        confidence=0.8,
        notes=["Test note"]
    )

    assert result.category == "danger"
    assert result.confidence == 0.8
    assert result.notes == ["Test note"]


def test_secret_result_invalid_confidence_type():
    with pytest.raises(ValidationError):
        SecretResult(
            category="danger",
            confidence="high",   # invalid
            notes=[]
        )


# ------------------------
# GenerateRequest Tests
# ------------------------

def test_generate_request_minimal_valid():
    req = GenerateRequest(
        npc_name="Bob",
        preset="criminal"
    )

    assert req.npc_name == "Bob"
    assert req.preset == "criminal"
    assert req.role is None
    assert req.race is None


def test_generate_request_missing_required_fields():
    with pytest.raises(ValidationError):
        GenerateRequest(preset="criminal")

    with pytest.raises(ValidationError):
        GenerateRequest(npc_name="Bob")


# ------------------------
# GeneratedSecret Tests
# ------------------------

def test_generated_secret_valid():
    secret = GeneratedSecret(
        text="Bob smuggles goods",
        category="danger",
        confidence=0.75
    )

    assert secret.text.startswith("Bob")
    assert secret.category == "danger"
    assert isinstance(secret.confidence, float)


def test_generated_secret_invalid_confidence():
    with pytest.raises(ValidationError):
        GeneratedSecret(
            text="Bad data",
            category="danger",
            confidence="not-a-number"
        )
