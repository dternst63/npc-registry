export interface NpcFormData {
  name: string;
  role: string;
  descriptor: string;
  race: string;
  agenda: string;
}

export type NpcFormField = keyof NpcFormData;
