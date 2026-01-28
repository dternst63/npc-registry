def generate_secret_logic(
    npc_name: str,
    preset: str,
    memory_store: dict,
    max_memory: int,
    rng
    ) -> dict:

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
            "Hiding a family betrayal that could destroy their reputation."
            "Protecting someone dangerous out of misplaced loyalty.",
        ],
        "random": [
            "Maintains secret correspondence with an unknown benefactor.",
            "Operating under a false identity.",
        ],
    }

    pool = templates.get(preset, templates["random"])

    # ---------- Deduplication Memory ----------

    memory_key = f"{npc_name}:{preset}"
    used = memory_store.get(memory_key, [])

    available = [s for s in pool if s not in used]

    # Reset memory if pool exhausted
    if not available:
        memory_store[memory_key] = []
        available = pool

    secret_text = rng.choice(available)

    # Update memory (rolling window)
    updated_list = memory_store.get(memory_key, [])
    updated_list.append(secret_text)
    memory_store[memory_key] = updated_list[-max_memory:]

    # ---------- Category Mapping ----------

    category_map = {
        "political": "agenda",
        "criminal": "danger",
        "arcane": "unknown",
        "personal": "hook",
        "random": "unknown",
    }

    return {
        "text": f"{npc_name} {secret_text}",
        "category": category_map.get(preset, "unknown"),
        "confidence": round(rng.uniform(0.6, 0.9), 2),
    }