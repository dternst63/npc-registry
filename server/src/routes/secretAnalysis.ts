import { Router } from "express";
import mongoose from "mongoose";
import Npc from "../models/Npc.js";
console.log("SECRET ANALYSIS ROUTE LOADED");

const router = Router();

router.post("/:npcId/secrets/:secretId/analyze", async (req, res) => {
  try {
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

    const secret = npc.gmSecrets.secrets.find(
      (s: { _id: { toString: () => string } }) =>
        s._id?.toString() === secretId,
    );

    if (!secret) {
      return res.status(404).json({ error: "Secret not found" });
    }

    const NARRATIVE_ENGINE =
      process.env.NARRATIVE_ENGINE_URL || "http://localhost:8000";

    console.log("NPC:", npc._id);
    console.log("Secrets array:", npc.gmSecrets.secrets);
    console.log("SecretId:", secretId);
    console.log("Resolved secret:", secret);

    const response = await fetch(`${NARRATIVE_ENGINE}/analyze-secret`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: secret.text,
        role: npc.role ?? "unknown",
        agenda: npc.agenda ?? "unknown",
      }),
    });

    const raw = await response.text();

    if (!response.ok) {
      console.error("Narrative analyze error:", raw);
      return res.status(500).json({ error: "Analyzer service error" });
    }

    const analysis = JSON.parse(raw);

    secret.category = analysis.category;
    secret.confidence = analysis.confidence;

    await npc.save();

    res.json({
      updatedSecret: secret,
      notes: analysis.notes,
    });
  } catch (err) {
    console.error("[SecretAnalysis]", err);
    res.status(500).json({ error: "Secret analysis failed" });
  }
});

export default router;
