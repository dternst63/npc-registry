// src/components/NpcDashboard.tsx
import { useEffect, useState } from "react";
import type { Npc } from "../../types/Npc";
import NpcList from "./NpcList";
import NpcCard from "./NpcCard";
import NpcFormModal from "../modals/NpcFormModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import { npcService } from "../../services/npcService";

const CAMPAIGN_ID = "demo"; // replace later with real campaign logic

const NpcDashboard = () => {
  const [npcs, setNpcs] = useState<Npc[]>([]);
  const [selectedNpc, setSelectedNpc] = useState<Npc | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formModalKey, setFormModalKey] = useState(0);

  const isModalOpen = isCreateOpen || isEditOpen || isDeleteOpen;

  const openCreateModal = () => {
    setFormModalKey(Date.now());
    setIsCreateOpen(true);
  };
  const openEditModal = () => {
    setFormModalKey(Date.now());
    setIsEditOpen(true);
  };

  // -----------------------
  // Data loading
  // -----------------------
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await npcService.getAll();
        if (active) {
          setNpcs(data);
        }
      } catch (err) {
        console.error("Failed to load NPCs", err);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  // -----------------------
  // Delete handler
  // -----------------------
  const handleDelete = async () => {
    if (!selectedNpc) return;

    await npcService.remove(selectedNpc.id);
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
          onClick={openCreateModal}
          disabled={isModalOpen}
          className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
        >
          + Create NPC
        </button>

        <button
          onClick={openEditModal}
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
        key={`create-${formModalKey}`}
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
        key={`edit-${formModalKey}`}
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
        title="Confirm Delete"
        onConfirm={handleDelete}
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
