from secrets.secret_generator import generate_secret_logic


class FakeRNG:
    def choice(self, seq):
        return seq[0]

    def uniform(self, a, b):
        return 0.75


def test_generates_secret_basic():
    memory = {}

    result = generate_secret_logic(
        npc_name="Bob",
        preset="criminal",
        memory_store=memory,
        max_memory=5,
        rng=FakeRNG()
    )

    assert "Bob" in result["text"]
    assert result["category"] == "danger"
    assert result["confidence"] == 0.75

def test_pool_exhaustion_resets_memory():
    class FakeRNG:
        def choice(self, seq):
            return seq[0]

        def uniform(self, a, b):
            return 0.8

    memory = {}

    # Use "random" preset which has exactly 2 entries
    preset = "random"
    npc = "Alice"

    # Call twice to exhaust pool
    first = generate_secret_logic(
        npc_name=npc,
        preset=preset,
        memory_store=memory,
        max_memory=5,
        rng=FakeRNG()
    )

    second = generate_secret_logic(
        npc_name=npc,
        preset=preset,
        memory_store=memory,
        max_memory=5,
        rng=FakeRNG()
    )

    # Third call should trigger reset branch
    third = generate_secret_logic(
        npc_name=npc,
        preset=preset,
        memory_store=memory,
        max_memory=5,
        rng=FakeRNG()
    )

    key = f"{npc}:{preset}"

    # After reset, memory should not exceed pool size
    assert len(memory[key]) <= 2

    # Generation should still succeed
    assert "Alice" in third["text"]
