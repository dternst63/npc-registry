import { npcValidation } from "./npcValidation";

export function validateNpcForm(data: Record<string, string>) {
  const errors: Record<string, string> = {};

  for (const [field, rules] of Object.entries(npcValidation)) {
    const value = data[field] ?? "";

    if (rules.required && !value.trim()) {
      errors[field] = "This field is required";
      continue;
    }

    if (rules.minLength && value.length < rules.minLength) {
      errors[field] = `Must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      errors[field] = `Must be under ${rules.maxLength} characters`;
    }
  }

  return errors;
}
