import { describe, it, expect, vi, beforeEach } from "vitest";
import mongoose from "mongoose";
import { connectDb } from "../db";
import { resetFetchMock } from "./mocks";

beforeEach(() => {
  resetFetchMock();
});


describe("connectDb", () => {
  const mongoUri = "mongodb://fake-uri";

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("connects successfully and logs success message", async () => {
    // Mock mongoose.connect success
    vi.spyOn(mongoose, "connect").mockResolvedValueOnce(mongoose as any);

    // Spy on console.log
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    // Spy on process.exit
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    await connectDb(mongoUri);

    expect(mongoose.connect).toHaveBeenCalledWith(mongoUri);
    expect(logSpy).toHaveBeenCalledWith("✅ MongoDB connected");
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it("logs error and exits process on connection failure", async () => {
    const error = new Error("Connection failed");

    // Mock mongoose.connect failure
    vi.spyOn(mongoose, "connect").mockRejectedValueOnce(error);

    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const exitSpy = vi.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    try {
      await connectDb(mongoUri);
    } catch (e) {
      // Expected: process.exit throws our fake error
    }

    expect(mongoose.connect).toHaveBeenCalledWith(mongoUri);
    expect(errorSpy).toHaveBeenCalledWith(
      "❌ MongoDB connection failed",
      error
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
