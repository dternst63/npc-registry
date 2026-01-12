import { Router, Request, Response } from "express";
import { NpcModel } from "../models/Npc.js";

const router = Router();

/**
 * GET /api/npcs
 */
router.get("/", async (_req: Request, res: Response) => {
  const npcs = await NpcModel.find().sort({ createdAt: 1 });
  res.json(npcs);
});

/**
 * POST /api/npcs
 */
router.post("/", async (req: Request, res: Response) => {
  const { name, role, descriptor, race, agenda } = req.body;

  if (!name || !role || !descriptor) {
    return res.status(400).json({
      error: "name, role, and descriptor are required",
    });
  }

  const npc = await NpcModel.create({
    name,
    role,
    descriptor,
    race,
    agenda,
  });

  res.status(201).json(npc);
});

export default router;

