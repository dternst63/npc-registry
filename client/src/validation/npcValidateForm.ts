import { npcValidation } from "./npcValidation";
import type { NpcFormData } from "../types/NpcForm";

export type NpcFormErrors = Partial<
  Record<keyof NpcFormData, string>
>;

export function validateNpcForm(
  data: NpcFormData
): NpcFormErrors {
  const errors: NpcFormErrors = {};

  (Object.keys(npcValidation) as (keyof NpcFormData)[]).forEach(
    (field) => {
      const rules = npcValidation[field];
      const value = data[field]?.trim() ?? "";

      if (rules.required && value.length === 0) {
        errors[field] = "This field is required";
        return;
      }

      if (value.length > 0 && value.length < rules.minLength) {
        errors[field] = `Must be at least ${rules.minLength} characters`;
        return;
      }

      if (value.length > rules.maxLength) {
        errors[field] = `Must be ${rules.maxLength} characters or less`;
      }
    }
  );

  return errors;
}
