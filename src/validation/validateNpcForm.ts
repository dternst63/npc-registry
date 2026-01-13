import type { NpcFormData, NpcFormField } from "../types/NpcForm";
import { npcValidation } from "./npcValidation";

export type NpcFormErrors = Partial<Record<NpcFormField, string>>;

export function validateNpcForm(
  data: NpcFormData
): NpcFormErrors {
  const errors: NpcFormErrors = {};

  for (const field in npcValidation) {
    const value = data[field as NpcFormField] ?? "";
    const rules = npcValidation[field as NpcFormField];

    if (rules.required && !value.trim()) {
      errors[field as NpcFormField] = "This field is required";
      continue;
    }

    if (rules.minLength && value.length < rules.minLength) {
      errors[field as NpcFormField] =
        `Must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      errors[field as NpcFormField] =
        `Must be under ${rules.maxLength} characters`;
    }
  }

  return errors;
}
