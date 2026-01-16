import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import npcRoutes from "./routes/npcs.js";
import npcSecretsRoutes from "./routes/npcSecrets.js";
import { connectDb } from "../db.js";
import secretAnalysisRoutes from "./routes/secretAnalysis.js";

console.log("🚀 index.ts loaded");


dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI not set");
}

connectDb(mongoUri);

app.use("/api/npcs", npcRoutes);
app.use("/api/npcs", npcSecretsRoutes);
app.use("/api/npcs", secretAnalysisRoutes);

app.listen(PORT, () => {
  console.log(`NPC API running on http://localhost:${PORT}`);
});

