import { Router } from "express";
import Npc from "../models/Npc";

const router = Router();

router.post("/:npcId/secrets/generate", async (req, res) => {
  try {
    const { npcId } = req.params;
    const { preset = "random" } = req.body;

    const npc = await Npc.findById(npcId);

    if (!npc) {
      return res.status(404).json({ error: "NPC not found" });
    }

    const response = await fetch("http://127.0.0.1:8000/generate-secret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        npc_name: npc.name,
        role: npc.role,
        race: npc.race,
        preset,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Narrative engine error:", errText);
      return res.status(500).json({ error: "Generator engine failed" });
    }

    const generated = await response.json();

    // HARD VALIDATION GUARD
    if (!generated.text) {
      console.error("Invalid generator payload:", generated);
      return res.status(500).json({ error: "Invalid secret generated" });
    }

    npc.gmSecrets ??= { enabled: true, secrets: [] };

    npc.gmSecrets.secrets.push({
      text: generated.text,
      category: generated.category || "unknown",
      confidence: generated.confidence ?? 0.5,
      revealed: false,
    });

    await npc.save();

    res.status(201).json({ secrets: npc.gmSecrets.secrets });
  } catch (err) {
    console.error("[SecretGenerator]", err);
    res.status(500).json({ error: "Secret generation failed" });
  }
});

export default router;
