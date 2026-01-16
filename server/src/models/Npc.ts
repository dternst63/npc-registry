import mongoose, { Schema, Document } from "mongoose";

export interface INpc extends Document {
  campaignId: string;
  name: string;
  role?: string;
  descriptor?: string;
  race?: string;
  agenda?: string;

  gmSecrets?: {
    enabled: boolean;
    secrets: IGmSecret[];
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface IGmSecret {
  _id?: mongoose.Types.ObjectId;
  text: string;
  category?: "lie" | "agenda" | "hook" | "danger" | "unknown";
  confidence?: number; // 0–1
  revealed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const GmSecretSchema = new Schema<IGmSecret>(
  {
    text: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["lie", "agenda", "hook", "danger", "unknown"],
      default: "unknown",
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5,
    },
    revealed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const NpcSchema = new Schema<INpc>(
  {
    campaignId: { type: String, required: true },
    name: { type: String, required: true, maxlength: 50 },
    role: { type: String, required: true, maxlength: 50 },
    descriptor: { type: String, required: true, maxlength: 100 },
    race: { type: String, maxlength: 50 },
    agenda: { type: String, maxlength: 500 },
    gmSecrets: {
      enabled: { type: Boolean, default: false },
      secrets: { type: [GmSecretSchema], default: [] },
    },
  },
  {
    timestamps: true,
  }
);



export default mongoose.model<INpc>("Npc", NpcSchema);
