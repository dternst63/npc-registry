import { useState } from "react";
import type { Npc } from "../types/Npc";
import type { NpcFormData, NpcFormField } from "../types/NpcForm";
import type { NpcFormErrors } from "../validation/npcValidateForm";
import { validateNpcForm } from "../validation/npcValidateForm";

interface UseNpcFormOptions {
  initialNpc?: Npc;
  onSubmit: (data: NpcFormData) => Promise<void>;
}

export function useNpcForm({ initialNpc, onSubmit }: UseNpcFormOptions) {
  const [formData, setFormData] = useState<NpcFormData>({
    name: initialNpc?.name ?? "",
    role: initialNpc?.role ?? "",
    descriptor: initialNpc?.descriptor ?? "",
    race: initialNpc?.race ?? "",
    agenda: initialNpc?.agenda ?? "",
  });

  const [errors, setErrors] = useState<NpcFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<NpcFormField, boolean>>
  >({});

  const getAllFieldsTouched = (): Record<NpcFormField, boolean> => ({
    name: true,
    role: true,
    descriptor: true,
    race: true,
    agenda: true,
  });

  const isFormValid =
    Object.keys(validateNpcForm(formData)).length === 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (field: NpcFormField) => {
    const validationErrors = validateNpcForm(formData);

    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validationErrors[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateNpcForm(formData);
    setErrors(validationErrors);
    setTouched(getAllFieldsTouched());

    if (Object.keys(validationErrors).length > 0) return;

    await onSubmit(formData);
  };

  return {
    formData,
    errors,
    touched,
    isFormValid,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
