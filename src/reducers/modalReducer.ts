// src/reducers/modalReducer.ts
import type { ModalState } from "../types/ModalState";
import type { Npc } from "../types/Npc";

type ModalAction =
  | { type: "OPEN_CREATE" }
  | { type: "OPEN_EDIT"; npc: Npc }
  | { type: "OPEN_DELETE"; npc: Npc }
  | { type: "CLOSE" };

export const initialModalState: ModalState = {
  mode: "closed",
  npc: null,
};

export function modalReducer(
  state: ModalState,
  action: ModalAction
): ModalState {
  switch (action.type) {
    case "OPEN_CREATE":
      return { mode: "create", npc: null };

    case "OPEN_EDIT":
      return { mode: "edit", npc: action.npc };

    case "OPEN_DELETE":
      return { mode: "confirmDelete", npc: action.npc };

    case "CLOSE":
      return initialModalState;

    default:
      return state;
  }
}
