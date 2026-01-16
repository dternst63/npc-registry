import { Router } from "express";
import Npc from "../models/Npc";

const router = Router();

router.post("/:npcId/secrets/generate", async (req, res) => {
  const { npcId } = req.params;
  const { preset } = req.body;

  const npc = await Npc.findById(npcId);

  if (!npc) {
    return res.status(404).json({ error: "NPC not found" });
  }

  const response = await fetch(
    "http://127.0.0.1:8000/generate-secret",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        npc_name: npc.name,
        role: npc.role,
        race: npc.race,
        preset,
      }),
    }
  );

  const generated = await response.json();

  npc.gmSecrets ??= { enabled: true, secrets: [] };
  npc.gmSecrets.enabled = true;

  npc.gmSecrets.secrets.push({
    text: generated.text,
    category: generated.category,
    confidence: generated.confidence,
  });

  await npc.save();

  res.status(201).json(npc.gmSecrets.secrets);
});

export default router;
