import type { NpcFormData, NpcFormField } from "../types/NpcForm";
import { npcValidation } from "./npcValidation";

export type NpcFormErrors = Partial<Record<NpcFormField, string>>;

export function validateNpcForm(data: NpcFormData): NpcFormErrors {
  const errors: NpcFormErrors = {};

  for (const field in npcValidation) {
    const value = data[field as NpcFormField] ?? "";
    const rules = npcValidation[field as NpcFormField];

    if (rules.required && !value.trim()) {
      errors[field as NpcFormField] = "This field is required";
      continue;
    }

    if ("minLength" in rules && value.length < rules.minLength) {
      if ("minLength" in rules) {
        const minLength = rules.minLength;

        if (value.length < minLength) {
          errors[
            field as NpcFormField
          ] = `Must be at least ${minLength} characters`;
        }
      }
    }

    if ("maxLength" in rules && value.length > rules.maxLength) {
      if ("maxLength" in rules) {
        const maxLength = rules.maxLength;

        if (value.length > maxLength) {
          errors[
            field as NpcFormField
          ] = `Must be under ${maxLength} characters`;
        }
      }
    }
  }

  return errors;
}
