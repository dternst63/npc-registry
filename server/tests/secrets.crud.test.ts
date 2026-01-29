import request from "supertest";
import { describe, it, expect, beforeEach, beforeAll } from "vitest";
import {createApp} from "../src/index";
import Npc from "../src/models/Npc";
import mongoose from "mongoose";
import { resetFetchMock } from "./mocks";

let app: ReturnType<typeof createApp>;

beforeAll(() => {
  app = createApp();
});

beforeEach(() => {
  resetFetchMock();
});

const validNpcPayload = {
  name: "Test NPC",
  role: "Merchant",
  race: "Elf",
  descriptor: "Shop owner",
  campaignId: "test-campaign",
};

describe("GM Secret Manual CRUD", () => {
  it("adds secret to NPC", async () => {
    const npc = await Npc.create(validNpcPayload);

    const res = await request(app).post(`/api/npcs/${npc._id}/secrets`).send({
      text: "Is secretly bankrupt",
      category: "hook",
    });

    expect(res.status).toBe(201);
    expect(res.body.secrets.length).toBe(1);
  });

  it("returns 404 if NPC not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .post(`/api/npcs/${fakeId}/secrets`)
      .send({ text: "test" });

    expect(res.status).toBe(404);
  });

  it("returns 400 if secret text is missing", async () => {
    const npc = await Npc.create(validNpcPayload);

    const res = await request(app)
      .post(`/api/npcs/${npc._id}/secrets`)
      .send({});

    expect(res.status).toBe(400);
  });
});

describe("GM Secret Edge Cases", () => {
  it("GET returns 400 for invalid npc id", async () => {
    const res = await request(app).get("/api/npcs/invalidid/secrets");

    expect(res.status).toBe(400);
  });

  it("GET returns empty secrets when npc exists but no secrets", async () => {
    const npcRes = await request(app)
      .post("/api/npcs")
      .send({
        name: "Empty Secrets NPC",
        descriptor: "test",
        role: "test",
        campaignId: "camp1",
        gmSecrets: { enabled: false, secrets: [] },
      });

    console.log("NPC Response:", JSON.stringify(npcRes.body, null, 2)); // ADD THIS
    const npcId = npcRes.body.id;

    const res = await request(app).get(`/api/npcs/${npcId}/secrets`);

    expect(res.status).toBe(200);
    expect(res.body.secrets).toEqual([]);
  });

  it("PATCH returns 404 when secret does not exist", async () => {
    const npcRes = await request(app)
      .post("/api/npcs")
      .send({
        name: "Patch Missing Secret NPC",
        descriptor: "test",
        role: "test",
        campaignId: "camp1",
        gmSecrets: { enabled: false, secrets: [] },
      });

    const npcId = npcRes.body.id;
    const fakeSecretId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .patch(`/api/npcs/${npcId}/secrets/${fakeSecretId}`)
      .send({ text: "update" });

    expect(res.status).toBe(404);
  });

  it("PATCH updates secret successfully", async () => {
    const npcRes = await request(app)
      .post("/api/npcs")
      .send({
        name: "Patch Success NPC",
        descriptor: "test",
        role: "test",
        campaignId: "camp1",
        gmSecrets: { enabled: false, secrets: [] },
      });

    const npcId = npcRes.body.id;

    const secretRes = await request(app)
      .post(`/api/npcs/${npcId}/secrets`)
      .send({ text: "Original Secret" });

    // ADD ERROR HANDLING
    if (!secretRes.body.secrets || secretRes.body.secrets.length === 0) {
      console.error("Secret creation failed:", secretRes.body);
      throw new Error("No secrets returned from POST");
    }

    const secretId = secretRes.body.secrets[0]._id;

    const res = await request(app)
      .patch(`/api/npcs/${npcId}/secrets/${secretId}`)
      .send({ text: "Updated Secret" });

    expect(res.status).toBe(200);
    expect(res.body.text).toBe("Updated Secret");
  });

  it("DELETE returns 404 when npc does not exist", async () => {
    const fakeNpcId = new mongoose.Types.ObjectId().toString();
    const fakeSecretId = new mongoose.Types.ObjectId().toString();

    const res = await request(app).delete(
      `/api/npcs/${fakeNpcId}/secrets/${fakeSecretId}`,
    );

    expect(res.status).toBe(404);
  });

  it("DELETE removes secret successfully", async () => {
    const npcRes = await request(app)
      .post("/api/npcs")
      .send({
        name: "Delete Secret NPC",
        descriptor: "test",
        role: "test",
        campaignId: "camp1",
        gmSecrets: { enabled: false, secrets: [] },
      });

    const npcId = npcRes.body.id;

    const secretRes = await request(app)
      .post(`/api/npcs/${npcId}/secrets`)
      .send({ text: "Delete Me" });

    const secretId = secretRes.body.secrets[0]._id;

    const res = await request(app).delete(
      `/api/npcs/${npcId}/secrets/${secretId}`,
    );

    expect(res.status).toBe(204);
  });
});
