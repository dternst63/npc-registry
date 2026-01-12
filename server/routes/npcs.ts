import { Router } from "express";
import Npc from "../models/Npc.js";
import { mapNpc } from "../utils/mapNpc.js";

const router = Router();

/**
 * GET /api/npcs
 */
router.get("/", async (_req, res) => {
  try {
    const npcs = await Npc.find().sort({ createdAt: 1 }).lean();
    res.json(npcs.map(mapNpc));
  } catch (err) {
    console.error("Failed to load NPCs:", err);
    res.status(500).json({ error: "Failed to load NPCs" });
  }
});

/**
 * POST /api/npcs
 */
router.post("/", async (req, res) => {
  try {
    const npc = new Npc(req.body);
    const savedNpc = await npc.save();

    res.status(201).json(mapNpc(savedNpc.toObject()));
  } catch (err) {
    console.error("Failed to create NPC:", err);
    res.status(500).json({ error: "Failed to create NPC" });
  }
});

/**
 * DELETE /api/npcs/:id
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Npc.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "NPC not found" });
    }

    res.status(204).send();
  } catch (err) {
    console.error("Failed to delete NPC:", err);
    res.status(500).json({ error: "Failed to delete NPC" });
  }
});

export default router;
