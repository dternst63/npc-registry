import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import npcRoutes from "./routes/npcs.js";
import npcSecretsRoutes from "./routes/npcSecrets.js";
import secretAnalysisRoutes from "./routes/secretAnalysis.js";
import secretGeneratorRoutes from "./routes/secretGenerator.js";
import { connectDb } from "../db.js";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});


// ✅ Production-safe PORT handling
const PORT = process.env.PORT || 3001;

// --------------------
// App factory (for tests + prod)
// --------------------

export function createApp() {
  const app = express();

  // ✅ Security middleware
  app.use(helmet());
  app.use(compression());

  // ✅ Rate limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );

  // ✅ Locked CORS (production safe)
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    }),
  );

  app.use(express.json());

  // --------------------
  // Routes
  // --------------------

  app.use("/api/npcs", npcRoutes);
  app.use("/api/npcs", npcSecretsRoutes);
  app.use("/api/npcs", secretAnalysisRoutes);
  app.use("/api/npcs", secretGeneratorRoutes);

  // --------------------
  // Health check
  // --------------------

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  return app;
}

// --------------------
// Server bootstrap
// --------------------

export function startServer() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI not set");
  }

  connectDb(mongoUri);

  const app = createApp();

  console.log("Starting NPC API...");

  app.listen(PORT, () => {
    console.log(`NPC API running on port ${PORT}`);
  });
}

// --------------------
// Auto-start (except tests)
// --------------------

if (process.env.NODE_ENV !== "test") {
  startServer();
}
