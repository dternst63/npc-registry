import mongoose, { Schema, Document } from "mongoose";

export interface NpcDocument extends Document {
  name: string;
  role: string;
  descriptor: string;
  race: string;
  agenda: string;
}

const NpcSchema = new Schema<NpcDocument>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    descriptor: { type: String, required: true },
    race: { type: String, default: "" },
    agenda: { type: String, default: "" },
  },
  { timestamps: true }
);

export const NpcModel =
  mongoose.models.Npc || mongoose.model<NpcDocument>("Npc", NpcSchema);
