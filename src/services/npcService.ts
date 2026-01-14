import type { Npc } from "../types/Npc";
import type { NpcFormData } from "../types/NpcForm";

const API_BASE = "http://localhost:3001/api/npcs";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "API request failed");
  }
  return res.json() as Promise<T>;
}

export const npcService = {
  async getAll(): Promise<Npc[]> {
    const res = await fetch(API_BASE);
    return handleResponse<Npc[]>(res);
  },

  async create(
    campaignId: string,
    data: NpcFormData
  ): Promise<Npc> {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId, ...data }),
    });

    return handleResponse<Npc>(res);
  },

  async update(
    id: string,
    campaignId: string,
    data: NpcFormData
  ): Promise<Npc> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId, ...data }),
    });

    return handleResponse<Npc>(res);
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Delete failed");
    }
  },
};
