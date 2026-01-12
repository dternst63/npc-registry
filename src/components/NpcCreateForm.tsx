import { useState } from "react";
import type { Npc } from "../types/Npc";


interface NpcCreateFormProps {
  campaignId: string;
  onCreated?: (npc: Npc) => void;
  onClose?: () => void;
  standalone?: boolean;
}

interface NpcFormData {
  name: string;
  role: string;
  descriptor: string;
  race: string;
  agenda: string;
}

const NpcCreateForm = ({
  campaignId,
  onCreated,
  onClose,
}: NpcCreateFormProps) => {
  const [formData, setFormData] = useState<NpcFormData>({
    name: "",
    role: "",
    descriptor: "",
    race: "",
    agenda: "",
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:3001/api/npcs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error("Failed to create NPC");
    }

    const createdNpc: Npc = await res.json();

    onCreated?.(createdNpc);
    onClose?.();
  } catch (err) {
    console.error(err);
    alert("Failed to create NPC");
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="border-b border-gray-200 pb-3">
        <h3 className="text-lg font-semibold text-gray-800">Create NPC</h3>
        <p className="text-sm text-gray-500 mt-1">
          Quick reference card for on-the-fly NPCs
        </p>
      </div>
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm
                   focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role *
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm
                   focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Descriptor */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descriptor *
          </label>
          <input
            type="text"
            name="descriptor"
            value={formData.descriptor}
            onChange={handleChange}
            required
            placeholder="e.g. nervous, arrogant, weary"
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm
                   focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Race */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Race / Species
          </label>
          <input
            type="text"
            name="race"
            value={formData.race}
            onChange={handleChange}
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm
                   focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Agenda (GM Only)
          </label>
          <textarea
            name="agenda"
            value={formData.agenda}
            onChange={handleChange}
            rows={3}
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm
                   focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
        >
          Create NPC
        </button>
      </div>
    </form>
  );
};

export default NpcCreateForm;
