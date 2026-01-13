// src/components/NpcDashboard.tsx
import type { Npc } from "../types/Npc";
import NpcList from "./NpcList";
import NpcCard from "./NpcCard";
import Modal from "./Modal";
import NpcForm from "./NpcForm";
import { useEffect, useState } from "react";

const NpcDashboard = () => {
  const [npcs, setNpcs] = useState<Npc[]>([]);
  const [selectedNpc, setSelectedNpc] = useState<Npc | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<"confirm" | "deleted">(
    "confirm"
  );

 const isModalOpen = isCreateOpen || isDeleteOpen || isEditOpen;

  const deleteSelectedNpc = async () => {
    if (!selectedNpc || !selectedNpc.id) {
      console.warn("Delete attempted with no selected NPC");
      return;
    }

    await fetch(`http://localhost:3001/api/npcs/${selectedNpc.id}`, {
      method: "DELETE",
    });

    setNpcs((prev) => prev.filter((npc) => npc.id !== selectedNpc.id));
    setSelectedNpc(null);
  };

  useEffect(() => {
    fetch("http://localhost:3001/api/npcs")
      .then((res) => res.json())
      .then((data: Npc[]) => {
        setNpcs(data);
      })
      .catch((err) => {
        console.error("Failed to load NPCs", err);
      });
  }, []);

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
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          + Create NPC
        </button>
        <button
          onClick={() => {
            setDeleteStatus("confirm");
            setIsDeleteOpen(true);
          }}
          disabled={!selectedNpc}
          className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-red-700"
        >
          - Delete NPC
        </button>
        <button
          onClick={() => setIsEditOpen(true)}
          disabled={!selectedNpc || isModalOpen}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          Edit NPC
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
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
        <NpcForm
          campaignId="demo"
          onClose={() => setIsCreateOpen(false)}
          onSubmitSuccess={(npc) => {
            setNpcs((prev) => [...prev, npc]);
            setSelectedNpc(npc);
            setIsCreateOpen(false);
          }}
        />
      </Modal>
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)}>
        {deleteStatus === "confirm" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Delete NPC</h2>

            <p className="text-sm text-gray-700">
              Are you sure you want to delete{" "}
              <span className="font-medium">{selectedNpc?.name}</span>? This
              action cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 rounded border text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await deleteSelectedNpc();
                  setDeleteStatus("deleted");
                }}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {deleteStatus === "deleted" && (
          <div className="space-y-4 text-center">
            <h2 className="text-lg font-semibold text-gray-900">NPC Deleted</h2>

            <p className="text-sm text-gray-700">
              The NPC has been successfully deleted.
            </p>

            <div className="flex justify-center">
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
        {selectedNpc && (
          <NpcForm
            campaignId="demo"
            initialNpc={selectedNpc}
            onClose={() => setIsEditOpen(false)}
            onSubmitSuccess={(updatedNpc) => {
              setNpcs((prev) =>
                prev.map((npc) => (npc.id === updatedNpc.id ? updatedNpc : npc))
              );
              setSelectedNpc(updatedNpc);
              setIsEditOpen(false);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default NpcDashboard;
