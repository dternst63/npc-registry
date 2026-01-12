import { Router } from "express";
import Npc from "../models/Npc.js";

const router = Router();

/**
 * GET /api/npcs
 */
router.get("/", async (_req, res) => {
  const npcs = await Npc.find().sort({ createdAt: 1 });
  res.json(npcs);
});

/**
 * POST /api/npcs
 */
router.post("/", async (req, res) => {
  try {
    const npc = new Npc(req.body);
    const savedNpc = await npc.save();
    res.status(201).json(savedNpc);
  } catch (err) {
    console.error("Failed to create NPC:", err);
    res.status(500).json({ error: "Failed to create NPC" });
  }
});

export default router;

