import { Router } from "express";
import mongoose from "mongoose";
import Npc from "../models/Npc.js";

const router = Router();

router.post("/:npcId/secrets/:secretId/analyze", async (req, res) => {
  const { npcId, secretId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(npcId)) {
    return res.status(400).json({ error: "Invalid NPC ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(secretId)) {
    return res.status(400).json({ error: "Invalid Secret ID" });
  }

  const npc = await Npc.findById(npcId);
  if (!npc || !npc.gmSecrets) {
    return res.status(404).json({ error: "NPC not found" });
  }

  const secret = npc.gmSecrets.secrets.id(secretId);
  if (!secret) {
    return res.status(404).json({ error: "Secret not found" });
  }

  let analysis;

  try {
    const response = await fetch("http://127.0.0.1:8000/analyze-secret", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: secret.text,
        role: npc.role,
        agenda: npc.agenda,
      }),
    });

    if (!response.ok) {
      return res.status(500).json({ error: "Analyzer service error" });
    }

    analysis = await response.json();
  } catch (err) {
    return res.status(500).json({ error: "Analyzer service unreachable" });
  }

  // Apply Python results
  secret.category = analysis.category;
  secret.confidence = analysis.confidence;

  await npc.save();

  res.json({
    updatedSecret: secret,
    notes: analysis.notes,
  });
});

export default router;
