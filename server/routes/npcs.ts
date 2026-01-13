import { Router } from "express";
import Npc from "../models/Npc.js";
import { mapNpc } from "../utils/mapNpc.js";

const router = Router();

function validateNpcPayload(body: any) {
  if (!body.name || body.name.length < 2) return "Invalid name";
  if (!body.role || body.role.length < 2) return "Invalid role";
  if (!body.descriptor || body.descriptor.length < 3)
    return "Invalid descriptor";

  if (body.name.length > 50) return "Name too long";
  if (body.role.length > 50) return "Role too long";
  if (body.descriptor.length > 100) return "Descriptor too long";
  if (body.agenda && body.agenda.length > 500) return "Agenda too long";

  return null;
}

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
  const error = validateNpcPayload(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

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

/**
 * PUT /api/npcs/:id
 */
router.put("/:id", async (req, res) => {
  const error = validateNpcPayload(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  try {
    const { id } = req.params;

    const updated = await Npc.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ error: "NPC not found" });
    }

    // reuse your mapper
    res.json(mapNpc(updated.toObject()));
  } catch (err) {
    console.error("Failed to update NPC:", err);
    res.status(500).json({ error: "Failed to update NPC" });
  }
});

export default router;
