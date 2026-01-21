import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import npcRoutes from "./routes/npcs.js";
import npcSecretsRoutes from "./routes/npcSecrets.js";
import secretAnalysisRoutes from "./routes/secretAnalysis.js";
import secretGeneratorRoutes from "./routes/secretGenerator.js";
import { connectDb } from "../db.js";

dotenv.config();

const PORT = 3001;

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use("/api/npcs", npcRoutes);
  app.use("/api/npcs", npcSecretsRoutes);
  app.use("/api/npcs", secretAnalysisRoutes);
  app.use("/api/npcs", secretGeneratorRoutes);

  return app;
}

/**
 * Export bootstrap separately for testing
 */
export function startServer() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI not set");
  }

  connectDb(mongoUri);

  const app = createApp();

  console.log("Starting NPC API...");

  app.listen(PORT, () => {
    console.log(`NPC API running on http://localhost:${PORT}`);
  });
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}

const app = createApp();
export default app;
