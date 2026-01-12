import { Types } from "mongoose";
import type { INpc } from "../models/Npc.js";

export const mapNpc = (npc: any) => {
  const { _id, __v, ...rest } = npc;

  return {
    id: _id instanceof Types.ObjectId ? _id.toString() : _id,
    ...rest,
  };
};
