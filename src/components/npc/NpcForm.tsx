import type { Npc } from "../../types/Npc";
import { npcValidation } from "../../validation/npcValidation";
import FormField from "../forms/FormField";
import { useNpcForm } from "../../hooks/useNpcForm";

interface NpcFormProps {
  initialNpc?: Npc;
  disabled?: boolean;
  onSubmit: (data: any) => Promise<void>;
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
        required
        value={formData.name}
        error={errors.name}
        touched={touched.name}
        maxLength={npcValidation.name.maxLength}
        disabled={disabled}
        onChange={handleChange}
        onBlur={() => handleBlur("name")}
      />

      <FormField
        label="Role"
        name="role"
        required
        value={formData.role}
        error={errors.role}
        touched={touched.role}
        maxLength={npcValidation.role.maxLength}
        disabled={disabled}
        onChange={handleChange}
        onBlur={() => handleBlur("role")}
      />

      <FormField
        label="Descriptor"
        name="descriptor"
        value={formData.descriptor}
        error={errors.descriptor}
        touched={touched.descriptor}
        maxLength={npcValidation.descriptor.maxLength}
        disabled={disabled}
        onChange={handleChange}
        onBlur={() => handleBlur("descriptor")}
      />

      <FormField
        label="Race / Species"
        name="race"
        value={formData.race}
        error={errors.race}
        touched={touched.race}
        maxLength={npcValidation.race.maxLength}
        disabled={disabled}
        onChange={handleChange}
        onBlur={() => handleBlur("race")}
      />

      <FormField
        label="Agenda (GM Only)"
        name="agenda"
        as="textarea"
        rows={3}
        value={formData.agenda}
        error={errors.agenda}
        touched={touched.agenda}
        maxLength={npcValidation.agenda.maxLength}
        disabled={disabled}
        onChange={handleChange}
        onBlur={() => handleBlur("agenda")}
      />

      <div className="flex justify-end gap-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={disabled}
          className="rounded border px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={disabled || !isFormValid}
          className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {initialNpc ? "Update NPC" : "Create NPC"}
        </button>
      </div>
    </form>
  );
};

export default NpcForm;

