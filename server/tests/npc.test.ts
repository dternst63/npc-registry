import request from "supertest";
import { describe, it, expect, beforeEach, vi } from "vitest";
import app from "../src/index";
import { resetFetchMock } from "./mocks";
import Npc from "../src/models/Npc";
import mongoose from "mongoose";

/**
 * Shared test payloads
 */
const validNpcPayload = {
  name: "Aldric",
  role: "Cleric",
  race: "Human",
  descriptor: "Wandering healer",
  campaignId: "test-campaign",
};

const updateNpcPayload = {
  name: "Updated",
  role: "Mage",
  descriptor: "Updated desc",
};

beforeEach(() => {
  resetFetchMock();
  vi.restoreAllMocks();
});

describe("NPC API", () => {
  /**
   * --------------------
   * CREATE NPC
   * --------------------
   */
  describe("POST /api/npcs", () => {
    it("creates NPC successfully", async () => {
      const res = await request(app).post("/api/npcs").send(validNpcPayload);

      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Aldric");
    });

    it("rejects invalid name", async () => {
      const res = await request(app)
        .post("/api/npcs")
        .send({
          ...validNpcPayload,
          name: "A",
        });

      expect(res.status).toBe(400);
    });

    it("rejects overly long descriptor", async () => {
      const longDescriptor = "x".repeat(200);

      const res = await request(app).post("/api/npcs").send({
        name: "Test NPC",
        role: "Mage",
        descriptor: longDescriptor,
      });

      expect(res.status).toBe(400);
    });

    it("rejects overly long agenda", async () => {
      const res = await request(app)
        .post("/api/npcs")
        .send({
          ...validNpcPayload,
          agenda: "x".repeat(600),
        });

      expect(res.status).toBe(400);
    });

    it("returns 500 when database save fails", async () => {
      vi.spyOn(Npc.prototype, "save").mockRejectedValueOnce(
        new Error("Save failed"),
      );

      const res = await request(app).post("/api/npcs").send(validNpcPayload);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Failed to create NPC");
    });
  });

  /**
   * --------------------
   * FETCH NPC LIST
   * --------------------
   */
  describe("GET /api/npcs", () => {
    it("returns NPC list", async () => {
      const res = await request(app).get("/api/npcs");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("returns 500 when database fails", async () => {
      vi.spyOn(Npc, "find").mockRejectedValueOnce(new Error("DB down"));

      const res = await request(app).get("/api/npcs");

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Failed to load NPCs");
    });
  });

  /**
   * --------------------
   * DELETE NPC
   * --------------------
   */
  describe("DELETE /api/npcs/:id", () => {
    it("returns 404 when NPC does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app).delete(`/api/npcs/${fakeId}`);

      expect(res.status).toBe(404);
    });

    it("returns 500 when database delete fails", async () => {
      vi.spyOn(Npc, "findByIdAndDelete").mockRejectedValueOnce(
        new Error("Delete failed"),
      );

      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app).delete(`/api/npcs/${fakeId}`);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Failed to delete NPC");
    });
  });

  /**
   * --------------------
   * UPDATE NPC
   * --------------------
   */
  describe("PUT /api/npcs/:id", () => {
    it("returns 404 when NPC does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/api/npcs/${fakeId}`)
        .send(updateNpcPayload);

      expect(res.status).toBe(404);
    });

    it("returns 500 when database update fails", async () => {
      vi.spyOn(Npc, "findByIdAndUpdate").mockRejectedValueOnce(
        new Error("Update failed"),
      );

      const fakeId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .put(`/api/npcs/${fakeId}`)
        .send(updateNpcPayload);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe("Failed to update NPC");
    });
  });
});
