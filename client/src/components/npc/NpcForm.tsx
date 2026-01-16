import type { Npc } from "../../types/Npc";
import { npcValidation } from "../../validation/npcValidation";
import FormField from "../forms/FormField";
import FormActions from "../forms/FormActions";
import { useNpcForm } from "../../hooks/useNpcForm";
import type { NpcFormData } from "../../types/NpcForm";

interface NpcFormProps {
  initialNpc?: Npc;
  disabled?: boolean;
  onSubmit: (data: NpcFormData) => Promise<void>;
  onCancel: () => void;
}

const NpcForm = ({
  initialNpc,
  disabled = false,
  onSubmit,
  onCancel,
}: NpcFormProps) => {
  const {
    formData,
    errors,
    touched,
    isFormValid,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useNpcForm({ initialNpc, onSubmit });

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="border-b border-gray-200 pb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {initialNpc ? "Edit NPC" : "Create NPC"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {initialNpc
            ? "Update the NPC details"
            : "Quick reference card for on-the-fly NPCs"}
        </p>
      </div>

      <FormField
        label="Name"
        name="name"
        required={npcValidation.name.required}
        maxLength={npcValidation.name.maxLength}
        minLength={npcValidation.name.minLength}
        value={formData.name}
        error={errors.name}
        touched={touched.name}
        disabled={disabled}
        onChange={handleChange}
        onBlur={() => handleBlur("name")}
      />

      <FormField
        label="Role"
        name="role"
        required={npcValidation.role.required}
        maxLength={npcValidation.role.maxLength}
        minLength={npcValidation.role.minLength}
        value={formData.role}
        error={errors.role}
        touched={touched.role}
        disabled={disabled}
        onChange={handleChange}
        onBlur={() => handleBlur("role")}
      />
      <FormField
        label="Descriptor"
        name="descriptor"
        required={npcValidation.descriptor.required}
        maxLength={npcValidation.descriptor.maxLength}
        minLength={npcValidation.descriptor.minLength}
        value={formData.descriptor}
        error={errors.descriptor}
        touched={touched.descriptor}
        disabled={disabled}
        onChange={handleChange}
        onBlur={() => handleBlur("descriptor")}
      />

      <FormField
        label="Race/Species"
        name="race"
        required={npcValidation.race.required}
        maxLength={npcValidation.race.maxLength}
        minLength={npcValidation.race.minLength}
        value={formData.race}
        error={errors.race}
        touched={touched.race}
        disabled={disabled}
        onChange={handleChange}
        onBlur={() => handleBlur("race")}
      />

      <FormField
        label="Agenda/Goal"
        name="agenda"
        required={npcValidation.agenda.required}
        maxLength={npcValidation.agenda.maxLength}
        minLength={npcValidation.agenda.minLength}
        value={formData.agenda}
        error={errors.agenda}
        touched={touched.agenda}
        disabled={disabled}
        onChange={handleChange}
        onBlur={() => handleBlur("agenda")}
      />
      <FormActions
        submitLabel={initialNpc ? "Update NPC" : "Create NPC"}
        onCancel={onCancel}
        disabled={disabled}
        canSubmit={isFormValid}
      />
    </form>
  );
};

export default NpcForm;
