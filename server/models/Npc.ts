import mongoose, { Schema, Document } from "mongoose";

export interface INpc extends Document {
  campaignId: string;
  name: string;
  role: string;
  descriptor: string;
  race: string;
  agenda: string;
  createdAt: Date;
}

const NpcSchema = new Schema<INpc>(
  {
    campaignId: { type: String, required: true },
    name: { type: String, required: true },
    role: String,
    descriptor: String,
    race: String,
    agenda: String,
  },
  { timestamps: true }
);

export default mongoose.model<INpc>("Npc", NpcSchema);
