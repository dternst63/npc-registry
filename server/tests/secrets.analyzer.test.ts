import { beforeEach, describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/index";
import mongoose from "mongoose";
import Npc from "../src/models/Npc";

import {
  resetFetchMock,
  mockAnalyzerSuccess,
  mockAnalyzerFailure,
} from "./mocks";

beforeEach(() => {
  resetFetchMock();
});

const baseNpc = {
  name: "Test NPC",
  descriptor: "Test descriptor",
  role: "Spy",
  agenda: "Chaos",
  campaignId: "test-campaign-123",
  gmSecrets: { secrets: [] },
};

describe("GM Secret Analyzer API", () => {
  it("analyzes and updates a secret successfully", async () => {
    // Mock analyzer success (reuse generator-style payload)
    mockAnalyzerSuccess();

    const npc = await Npc.create({
      ...baseNpc,
      name: "Analyzer NPC",
    });

    // ADD SECRET FIRST
    npc.gmSecrets.secrets.push({
      text: "Hidden identity",
    });

    await npc.save();

    const secretId = npc.gmSecrets.secrets[0]._id.toString();

    const res = await request(app)
      .post(`/api/npcs/${npc._id}/secrets/${secretId}/analyze`)
      .send();

    expect(res.status).toBe(200);
    expect(res.body.updatedSecret.category).toBeDefined();
    expect(res.body.updatedSecret.confidence).toBeDefined();
  });

  it("returns 404 when npc does not exist", async () => {
    const fakeNpcId = "65f000000000000000000000";
    const fakeSecretId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .post(`/api/npcs/${fakeNpcId}/secrets/${fakeSecretId}/analyze`)
      .send();

    expect(res.status).toBe(404);
  });

  it("returns 404 when secret does not exist", async () => {
    // Create NPC only
    const npc = await Npc.create({
      ...baseNpc,
      name: "Missing Secret NPC",
    });

    const fakeSecretId = new mongoose.Types.ObjectId().toString();

    const res = await request(app)
      .post(`/api/npcs/${npc._id}/secrets/${fakeSecretId}/analyze`)
      .send();

    expect(res.status).toBe(404);
  });

  it("returns 500 when analyzer service fails", async () => {
    mockAnalyzerFailure();

    const npc = await Npc.create({
      ...baseNpc,
      name: "Analyzer Failure NPC",
    });

    npc.gmSecrets.secrets.push({
      text: "Needs analysis",
    });

    await npc.save();

    const secretId = npc.gmSecrets.secrets[0]._id.toString();

    const res = await request(app)
      .post(`/api/npcs/${npc._id}/secrets/${secretId}/analyze`)
      .send();

    expect(res.status).toBe(500);
  });
});
