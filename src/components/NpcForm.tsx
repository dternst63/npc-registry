import { useState } from "react";
import type { Npc } from "../types/Npc";
import { validateNpcForm } from "../validation/validateNpcForm";

export interface NpcFormProps {
  campaignId: string;
  initialNpc?: Npc;
  onClose: () => void;
  onSubmitSuccess: (npc: Npc) => void;
}

const NpcForm = ({
  campaignId,
  initialNpc,
  onClose,
  onSubmitSuccess,
}: NpcFormProps) => {
  const [formData, setFormData] = useState({
    name: initialNpc?.name ?? "",
    role: initialNpc?.role ?? "",
    descriptor: initialNpc?.descriptor ?? "",
    race: initialNpc?.race ?? "",
    agenda: initialNpc?.agenda ?? "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const getAllFieldsTouched = () => ({
    name: true,
    role: true,
    descriptor: true,
    race: true,
    agenda: true,
  });

  const isFormValid = Object.keys(validateNpcForm(formData)).length === 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (field: string) => {
    const validationErrors = validateNpcForm(formData);

    setTouched((prev) => ({ ...prev, [field]: true }));

    setErrors((prev) => ({
      ...prev,
      [field]: validationErrors[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setTouched(getAllFieldsTouched());

    try {
      const isEdit = Boolean(initialNpc);

      const url = isEdit
        ? `http://localhost:3001/api/npcs/${initialNpc!.id}`
        : "http://localhost:3001/api/npcs";

      const method = isEdit ? "PUT" : "POST";

      const validationErrors = validateNpcForm(formData);

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          campaignId,
          ...formData,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save NPC");
      }

      const npc = await res.json();
      onSubmitSuccess(npc);
    } catch (err) {
      console.error("NPC submit failed:", err);
      setError("Failed to save NPC. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border-b border-gray-200 pb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {initialNpc ? "Edit NPC" : "Create NPC"}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {initialNpc
            ? "Update the NPC details"
            : "Quick reference card for on-the-fly NPCs"}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name *
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => {
              handleBlur("name");
            }}
            className={`mt-1 w-full rounded border px-2 py-1 text-sm
                        focus:outline-none focus:ring-1
                        ${
                          touched.name && errors.name
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-blue-500"
                        }
  `}
          />

          {touched.name && errors.name && (
            <p className="text-xs text-red-600 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role *
          </label>
          <input
            name="role"
            value={formData.role}
            onChange={handleChange}
            onBlur={() => {
              handleBlur("role");
            }}
            required
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm
                       focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.role && (
            <p className="text-xs text-red-600 mt-1">{errors.role}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descriptor *
          </label>
          <input
            name="descriptor"
            value={formData.descriptor}
            onChange={handleChange}
            onBlur={() => {
              handleBlur("descriptor");
            }}
            required
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm
                       focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.descriptor && (
            <p className="text-xs text-red-600 mt-1">{errors.descriptor}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Race / Species
          </label>
          <input
            name="race"
            value={formData.race}
            onChange={handleChange}
            onBlur={() => {
              handleBlur("race");
            }}
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm
                       focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.race && (
            <p className="text-xs text-red-600 mt-1">{errors.race}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Agenda (GM Only)
          </label>
          <textarea
            name="agenda"
            value={formData.agenda}
            onChange={handleChange}
            onBlur={() => {
              handleBlur("agenda");
            }}
            rows={3}
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm
                       focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.agenda && (
            <p className="text-xs text-red-600 mt-1">{errors.agenda}</p>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting || !isFormValid}
          className="px-4 py-2 rounded bg-black text-white
             hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Saving..."
            : initialNpc
            ? "Update NPC"
            : "Create NPC"}
        </button>
      </div>
    </form>
  );
};

export default NpcForm;
