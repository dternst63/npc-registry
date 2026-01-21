import { vi } from "vitest";

export const fetchMock = vi.fn();

export function setupFetchMock() {
  vi.stubGlobal("fetch", fetchMock);
}

export function resetFetchMock() {
  fetchMock.mockReset();
}

export function mockAnalyzerSuccess() {
  fetchMock.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      category: "danger",
      confidence: 0.85,
      notes: "High risk behavior detected",
    }),
  });
}

export function mockAnalyzerFailure() {
  fetchMock.mockRejectedValue(
    new Error("Analyzer offline")
  );
}

export function mockGeneratorSuccess() {
  fetchMock.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      text: "Test NPC is secretly a spy.",
      category: "danger",
      confidence: 0.75,
    }),
  });
}

export function mockGeneratorDuplicate() {
  fetchMock.mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      text: "DUPLICATE SECRET",
      category: "danger",
      confidence: 0.75,
    }),
  });
}
