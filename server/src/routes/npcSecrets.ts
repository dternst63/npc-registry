import { Router } from "express";
import mongoose from "mongoose";
import Npc from "../models/Npc.js";

const router = Router();

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

/**
 * GET secrets
 */
router.get("/:npcId/secrets", async (req, res) => {
  const { npcId } = req.params;

  if (!isValidObjectId(npcId)) {
    return res.status(400).json({ error: "Invalid NPC ID" });
  }

  const npc = await Npc.findById(npcId).lean();

  if (!npc) {
    return res.status(404).json({ error: "NPC not found" });
  }

  const secrets = npc.gmSecrets?.secrets ?? [];

  res.status(200).json({ secrets });
});

/**
 * CREATE secret
 */
router.post("/:npcId/secrets", async (req, res) => {
  const { npcId } = req.params;
  const { text, category } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Secret text is required" });
  }

  if (!isValidObjectId(npcId)) {
    return res.status(400).json({ error: "Invalid NPC ID" });
  }

  const npc = await Npc.findById(npcId);

  if (!npc) {
    return res.status(404).json({ error: "NPC not found" });
  }

  npc.gmSecrets ??= { enabled: true, secrets: [] };
  npc.gmSecrets.enabled = true;

  npc.gmSecrets.secrets.push({ text, category });

  await npc.save();

  // Return the FULL NPC object so subdocument IDs are populated
  const savedNpc = await Npc.findById(npcId);

  res.status(201).json({
    secrets: savedNpc?.gmSecrets?.secrets ?? [],
  });
});

/**
 * UPDATE secret
 */
router.patch("/:npcId/secrets/:secretId", async (req, res) => {
  const { npcId, secretId } = req.params;

  if (!isValidObjectId(npcId)) {
    return res.status(400).json({ error: "Invalid NPC ID" });
  }

  if (!isValidObjectId(secretId)) {
    return res.status(404).json({ error: "Secret not found" });
  }

  const npc = await Npc.findById(npcId);

  if (!npc || !npc.gmSecrets) {
    return res.status(404).json({ error: "NPC or secrets not found" });
  }

  const secret = npc.gmSecrets.secrets.id(secretId);

  if (!secret) {
    return res.status(404).json({ error: "Secret not found" });
  }

  Object.assign(secret, req.body);

  await npc.save();

  res.status(200).json(secret);
});

/**
 * DELETE secret
 */
router.delete("/:npcId/secrets/:secretId", async (req, res) => {
  const { npcId, secretId } = req.params;

  if (!isValidObjectId(npcId)) {
    return res.status(400).json({ error: "Invalid NPC ID" });
  }

  if (!isValidObjectId(secretId)) {
    return res.status(404).json({ error: "Secret not found" });
  }

  const npc = await Npc.findById(npcId);

  if (!npc || !npc.gmSecrets) {
    return res.status(404).json({ error: "NPC or secrets not found" });
  }

  const secret = npc.gmSecrets.secrets.id(secretId);

  if (!secret) {
    return res.status(404).json({ error: "Secret not found" });
  }

  secret.deleteOne();
  await npc.save();

  res.status(204).send();
});

export default router;
