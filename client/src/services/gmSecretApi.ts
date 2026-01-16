const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function getNpcSecrets(npcId: string) {
  const res = await fetch(`${BASE_URL}/api/npcs/${npcId}/secrets`);
  return res.json();
}

export async function addNpcSecret(npcId: string, payload: any) {
  const res = await fetch(`${BASE_URL}/api/npcs/${npcId}/secrets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function updateNpcSecret(
  npcId: string,
  secretId: string,
  payload: any
) {
  const res = await fetch(
    `${BASE_URL}/api/npcs/${npcId}/secrets/${secretId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  return res.json();
}

export async function deleteNpcSecret(npcId: string, secretId: string) {
  await fetch(
    `${BASE_URL}/api/npcs/${npcId}/secrets/${secretId}`,
    {
      method: "DELETE",
    }
  );
}

export async function analyzeNpcSecret(
  npcId: string,
  secretId: string
) {
  const res = await fetch(
    `${BASE_URL}/api/npcs/${npcId}/secrets/${secretId}/analyze`,
    {
      method: "POST",
    }
  );

  return res.json();
}

