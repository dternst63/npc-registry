import mongoose, { Schema, Document } from "mongoose";

export interface INpc extends Document {
  campaignId: string;
  name: string;
  role?: string;
  descriptor?: string;
  race?: string;
  agenda?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NpcSchema = new Schema<INpc>(
  {
    campaignId: { type: String, required: true },
    name: { type: String, required: true, maxlength: 50 },
    role: { type: String, required: true, maxlength: 50 },
    descriptor: { type: String, required: true, maxlength: 100 },
    race: { type: String, maxlength: 50 },
    agenda: { type: String, maxlength: 500 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INpc>("Npc", NpcSchema);
