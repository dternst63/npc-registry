import { Router } from "express";
import Npc from "../models/Npc";

const router = Router();

router.post(
  "/:npcId/secrets/:secretId/analyze",
  async (req, res) => {

    const { npcId, secretId } = req.params;

    const npc = await Npc.findById(npcId);
    if (!npc || !npc.gmSecrets) {
      return res.status(404).json({ error: "NPC not found" });
    }

    const secret = npc.gmSecrets.secrets.id(secretId);
    if (!secret) {
      return res.status(404).json({ error: "Secret not found" });
    }

    const response = await fetch(
      "http://127.0.0.1:8000/analyze-secret",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: secret.text,
          role: npc.role,
          agenda: npc.agenda,
        }),
      }
    );

    const analysis = await response.json();

    // Apply Python results
    secret.category = analysis.category;
    secret.confidence = analysis.confidence;

    await npc.save();

    res.json({
      updatedSecret: secret,
      notes: analysis.notes,
    });
  }
);

export default router;
