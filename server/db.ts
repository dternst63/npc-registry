import mongoose from "mongoose";

export const connectDb = async (mongoUri: string) => {
  console.log("🔍 Mongo URI present:", Boolean(mongoUri));
  console.log("🔌 Attempting MongoDB connection...");

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed");
    console.error(err);
    process.exit(1);
  }
};
