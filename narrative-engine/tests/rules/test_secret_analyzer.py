from rules.secret_analyzer import analyze_secret_logic


def test_detects_criminal_activity():
    text = "He smuggles illegal weapons across the border."

    result = analyze_secret_logic(text)

    assert result["category"] == "danger"
    assert result["confidence"] >= 0.75
    assert "Criminal activity detected" in result["notes"]


def test_detects_secrecy_language():
    text = "He is secretly working behind the scenes."

    result = analyze_secret_logic(text)

    assert "Hidden motivation pattern detected" in result["notes"]
    assert result["confidence"] > 0.4


def test_betrayal_overrides_confidence():
    text = "He is a traitor and double agent."

    result = analyze_secret_logic(text)

    assert result["category"] == "danger"
    assert result["confidence"] >= 0.85


def test_political_sets_agenda_category():
    text = "He plans to overthrow the king."

    result = analyze_secret_logic(text)

    assert result["category"] == "agenda"
    assert "Political influence detected" in result["notes"]


def test_arcane_detection_adds_note():
    text = "The forbidden artifact summoned a demon."

    result = analyze_secret_logic(text)

    assert "Arcane anomaly detected" in result["notes"]


def test_confidence_clamped_to_max():
    text = "secretly smuggling weapons while betraying the king with forbidden artifact ritual"

    result = analyze_secret_logic(text)

    assert result["confidence"] <= 0.95
