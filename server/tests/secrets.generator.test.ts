import request from "supertest";
import { describe, it, expect, beforeEach, vi, beforeAll } from "vitest";
import {createApp} from "../src/index";
import Npc from "../src/models/Npc";
import { resetFetchMock } from "./mocks";

let app: ReturnType<typeof createApp>;

// ----------------------------
// Helpers
// ----------------------------

const createNpc = async () => {
  return await Npc.create({
    name: "Test NPC",
    role: "Ranger",
    race: "Human",
    descriptor: "Scout",
    campaignId: "test",
  });
};

const mockGeneratorResponse = (payload: any, ok = true) => {
  (global.fetch as any).mockResolvedValueOnce({
    ok,
    json: async () => payload,
  });
};

// ----------------------------
// Test Suite
// ----------------------------

beforeAll(() => {
  app = createApp();
});

beforeEach(() => {
  resetFetchMock();
});

describe("GM Secret Generator API", () => {
  it("generates and saves secret successfully", async () => {
    const npc = await createNpc();

    mockGeneratorResponse({
      text: "Hidden royal bloodline",
      category: "hook",
      confidence: 0.8,
    });

    const res = await request(app).post(
      `/api/npcs/${npc._id}/secrets/generate`,
    );

    expect(res.status).toBe(201);
    expect(res.body.secrets.length).toBe(1);
    expect(res.body.secrets[0].text).toBe("Hidden royal bloodline");
  });

  it("returns 404 when npc does not exist", async () => {
    const fakeId = "507f191e810c19729de860ea";

    const res = await request(app).post(`/api/npcs/${fakeId}/secrets/generate`);

    expect(res.status).toBe(404);
  });

  it("returns 500 when generator service fails", async () => {
    const npc = await createNpc();

    // HTTP failure simulation
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
    });

    const res = await request(app).post(
      `/api/npcs/${npc._id}/secrets/generate`,
    );

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Secret generation failed");
  });

  it("returns 500 when generator returns invalid payload", async () => {
    const npc = await createNpc();

    mockGeneratorResponse({});

    const res = await request(app).post(
      `/api/npcs/${npc._id}/secrets/generate`,
    );

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Invalid secret generated");
  });

  it("returns 409 when generator exhausts duplicate attempts", async () => {
    const npc = await createNpc();

    // Pre-seed duplicate secret
    npc.gmSecrets = {
      enabled: true,
      secrets: [
        {
          text: "Duplicate Secret",
          category: "hook",
          confidence: 0.5,
          revealed: false,
        },
      ],
    };

    await npc.save();

    // Return same secret every attempt
    for (let i = 0; i < 5; i++) {
      mockGeneratorResponse({
        text: "Duplicate Secret",
      });
    }

    const res = await request(app).post(
      `/api/npcs/${npc._id}/secrets/generate`,
    );

    expect(res.status).toBe(409);
    expect(res.body.error).toBe("Generator exhausted unique results");
  });

  it("returns 500 when database save fails", async () => {
    const npc = await createNpc();

    mockGeneratorResponse({
      text: "Fresh secret",
    });

    vi.spyOn(Npc.prototype, "save").mockRejectedValueOnce(
      new Error("DB failure"),
    );

    const res = await request(app).post(
      `/api/npcs/${npc._id}/secrets/generate`,
    );

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Secret generation failed");
  });
});
