// src/components/NpcDashboard.tsx
import { useEffect, useState } from "react";
import type { Npc } from "../types/Npc";
import NpcList from "./NpcList";
import NpcCard from "./NpcCard";
import NpcFormModal from "./modals/NpcFormModal";
import ConfirmDeleteModal from "./modals/ConfirmDeleteModal";

const CAMPAIGN_ID = "demo"; // replace later with real campaign logic

const NpcDashboard = () => {
  const [npcs, setNpcs] = useState<Npc[]>([]);
  const [selectedNpc, setSelectedNpc] = useState<Npc | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isModalOpen = isCreateOpen || isEditOpen || isDeleteOpen;

  // -----------------------
  // Data loading
  // -----------------------
  const refreshNpcs = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/npcs");
      const data: Npc[] = await res.json();
      setNpcs(data);
    } catch (err) {
      console.error("Failed to load NPCs", err);
    }
  };

  useEffect(() => {
    refreshNpcs();
  }, []);

  // -----------------------
  // Update handler
  // -----------------------
  const handleNpcUpdated = (updatedNpc: Npc) => {
    setNpcs((prev) =>
      prev.map((npc) => (npc.id === updatedNpc.id ? updatedNpc : npc))
    );

    setSelectedNpc(updatedNpc);
  };

  // -----------------------
  // Delete handler
  // -----------------------
  const deleteSelectedNpc = async () => {
    if (!selectedNpc?.id) return;

    await fetch(`http://localhost:3001/api/npcs/${selectedNpc.id}`, {
      method: "DELETE",
    });

    setNpcs((prev) => prev.filter((n) => n.id !== selectedNpc.id));
    setSelectedNpc(null);
  };

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <header className="mb-4">
        <h1 className="text-3xl font-bold">NPC Registry</h1>
      </header>

      {/* Toolbar */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setIsCreateOpen(true)}
          disabled={isModalOpen}
          className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
        >
          + Create NPC
        </button>

        <button
          onClick={() => setIsEditOpen(true)}
          disabled={!selectedNpc || isModalOpen}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Edit NPC
        </button>

        <button
          onClick={() => setIsDeleteOpen(true)}
          disabled={!selectedNpc || isModalOpen}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
        >
          Delete NPC
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-6">
        <NpcList
          npcs={npcs}
          selectedId={selectedNpc?.id ?? null}
          onSelect={setSelectedNpc}
          isDisabled={isModalOpen}
        />

        <NpcCard npc={selectedNpc} />
      </div>

      {/* Create Modal */}
      <NpcFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        campaignId={CAMPAIGN_ID}
        title="Create NPC"
        onSubmitSuccess={(newNpc: Npc) => {
          setNpcs((prev) => [...prev, newNpc]);
          setSelectedNpc(newNpc);
        }}
      />

      {/* Edit Modal */}
      <NpcFormModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        campaignId={CAMPAIGN_ID}
        initialNpc={selectedNpc ?? undefined}
        title="Edit NPC"
        onSubmitSuccess={(updatedNpc: Npc) => {
          setNpcs((prev) =>
            prev.map((npc) => (npc.id === updatedNpc.id ? updatedNpc : npc))
          );

          setSelectedNpc(updatedNpc);
        }}
      />

      {/* Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={deleteSelectedNpc}
        message={
          selectedNpc
            ? `Delete ${selectedNpc.name}? This cannot be undone.`
            : "Delete this NPC?"
        }
      />
    </div>
  );
};

export default NpcDashboard;
