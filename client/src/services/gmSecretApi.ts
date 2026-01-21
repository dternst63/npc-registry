import type { GmSecret, SecretsResponse } from "../types/GmSecret";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// ---------- Fetch Secrets ----------

export async function getNpcSecrets(npcId: string): Promise<SecretsResponse> {
  const res = await fetch(`${BASE_URL}/api/npcs/${npcId}/secrets`);

  const data: SecretsResponse = await res.json();

  if (!res.ok) {
    throw new Error("Failed to load NPC secrets");
  }

  return data;
}

// ---------- Add Secret ----------

export async function addNpcSecret(
  npcId: string,
  payload: { text: string; category: string },
): Promise<SecretsResponse> {
  const res = await fetch(`${BASE_URL}/api/npcs/${npcId}/secrets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: SecretsResponse = await res.json();

  if (!res.ok) {
    throw new Error("Failed to add NPC secret");
  }

  return data;
}

// ---------- Update Secret ----------

export async function updateNpcSecret(
  npcId: string,
  secretId: string,
  payload: Partial<{
    text: string;
    category: string;
    confidence: number;
    revealed: boolean;
  }>,
): Promise<SecretsResponse> {
  const res = await fetch(`${BASE_URL}/api/npcs/${npcId}/secrets/${secretId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data: SecretsResponse = await res.json();

  if (!res.ok) {
    throw new Error("Failed to update NPC secret");
  }

  return data;
}

// ---------- Delete Secret ----------

export async function deleteNpcSecret(
  npcId: string,
  secretId: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/npcs/${npcId}/secrets/${secretId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete NPC secret");
  }
}

// ---------- Analyze Secret ----------

export async function analyzeNpcSecret(
  npcId: string,
  secretId: string,
): Promise<{
  updatedSecret: GmSecret;
  notes: string[];
}> {
  const res = await fetch(
    `${BASE_URL}/api/npcs/${npcId}/secrets/${secretId}/analyze`,
    {
      method: "POST",
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Secret analysis failed");
  }

  return data;
}

// ---------- Generate Secret ----------

export async function generateNpcSecret(
  npcId: string,
): Promise<SecretsResponse | null> {
  const res = await fetch(`${BASE_URL}/api/npcs/${npcId}/secrets/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();

  // Handle exhausted pool gracefully
  if (res.status === 409) {
    console.warn(data.error);
    return null;
  }

  if (!res.ok) {
    throw new Error(data.error || "Secret generation failed");
  }

  return data;
}
