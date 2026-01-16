// src/types/ModalState.ts
import type { Npc } from "./Npc";

export type ModalMode =
  | "closed"
  | "create"
  | "edit"
  | "confirmDelete"
  | "gmSecrets";

export interface ModalState {
  mode: ModalMode;
  npc: Npc | null;
}
