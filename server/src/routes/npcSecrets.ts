import { Router, Request, Response } from "express";
import Npc from "../models/Npc";

const router = Router();

/**
 * GET all GM secrets for an NPC
 * (GM-only conceptually)
 */
router.get("/:npcId/secrets", async (req: Request, res: Response) => {
  const { npcId } = req.params;

  const npc = await Npc.findById(npcId).select("gmSecrets");
  if (!npc) {
    return res.status(404).json({ error: "NPC not found" });
  }

  res.json(npc.gmSecrets ?? { enabled: false, secrets: [] });
});

/**
 * ADD a GM secret to an NPC
 */
router.post("/:npcId/secrets", async (req: Request, res: Response) => {
  const { npcId } = req.params;
  const { text, category } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Secret text is required" });
  }

  const npc = await Npc.findById(npcId);
  if (!npc) {
    return res.status(404).json({ error: "NPC not found" });
  }

  npc.gmSecrets ??= { enabled: true, secrets: [] };
  npc.gmSecrets.enabled = true;

  npc.gmSecrets.secrets.push({
    text,
    category,
  });

  await npc.save();

  res.status(201).json(npc.gmSecrets.secrets);
});

/**
 * UPDATE a GM secret
 */
router.patch(
  "/:npcId/secrets/:secretId",
  async (req: Request, res: Response) => {
    const { npcId, secretId } = req.params;
    const updates = req.body;

    const npc = await Npc.findById(npcId);
    if (!npc || !npc.gmSecrets) {
      return res.status(404).json({ error: "NPC or secrets not found" });
    }

    const secret = npc.gmSecrets.secrets.id(secretId);
    if (!secret) {
      return res.status(404).json({ error: "Secret not found" });
    }

    Object.assign(secret, updates);
    await npc.save();

    res.json(secret);
  }
);

/**
 * DELETE a GM secret
 */
router.delete(
  "/:npcId/secrets/:secretId",
  async (req: Request, res: Response) => {
    const { npcId, secretId } = req.params;

    const npc = await Npc.findById(npcId);
    if (!npc || !npc.gmSecrets) {
      return res.status(404).json({ error: "NPC or secrets not found" });
    }

    npc.gmSecrets.secrets.id(secretId)?.deleteOne();
    await npc.save();

    res.status(204).send();
  }
);

export default router;
