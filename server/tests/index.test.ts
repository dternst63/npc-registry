import { describe, it, expect, vi } from "vitest";
import express from "express";
import { createApp, startServer } from "../src/index";
import { connectDb } from "../db";
import { Server } from "http";

vi.mock("../db", () => ({
  connectDb: vi.fn(),
}));

describe("Index bootstrap", () => {
  it("creates express app", () => {
    const app = createApp();
    expect(app).toBeDefined();
  });

  it("throws if MONGO_URI missing in prod mode", () => {
    const oldEnv = process.env.NODE_ENV;
    const oldUri = process.env.MONGO_URI;

    process.env.NODE_ENV = "production";
    delete process.env.MONGO_URI;

    expect(() => startServer()).toThrow("MONGO_URI not set");

    process.env.NODE_ENV = oldEnv;
    process.env.MONGO_URI = oldUri;
  });

  it("starts server when env is valid", () => {
    process.env.NODE_ENV = "production";
    process.env.MONGO_URI = "mongodb://fake";

    const listenSpy = vi
      .spyOn(express.application, "listen")
      .mockImplementation(() => {
        return {} as Server;
      });

    startServer();

    expect(connectDb).toHaveBeenCalled();
    expect(listenSpy).toHaveBeenCalled();

    listenSpy.mockRestore();
  });

  it("does not auto start server in test environment", async () => {
    process.env.NODE_ENV = "test";

    vi.resetModules();

    const listenSpy = vi
      .spyOn(express.application, "listen")
      .mockImplementation((_port: any, cb?: any) => {
        cb && cb(); // manually execute callback
        return {} as any;
      });

    await import("../src/index");

    expect(listenSpy).not.toHaveBeenCalled();

    listenSpy.mockRestore();
  });
});
