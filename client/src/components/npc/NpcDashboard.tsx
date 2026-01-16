import { useEffect, useState, useReducer } from "react";
import type { Npc } from "../../types/Npc";
import NpcList from "./NpcList";
import NpcCard from "./NpcCard";
import NpcFormModal from "../modals/NpcFormModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import { npcService } from "../../services/npcService";
import { modalReducer, initialModalState } from "../../reducers/modalReducer";
import GmSecretsModal from "../gm/GmSecretsModal";

const CAMPAIGN_ID = "demo"; // replace later with real campaign logic

const NpcDashboard = () => {
  const [npcs, setNpcs] = useState<Npc[]>([]);
  const [selectedNpc, setSelectedNpc] = useState<Npc | null>(null);

  const [modalState, dispatch] = useReducer(modalReducer, initialModalState);

  const isModalOpen = modalState.mode !== "closed";

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
  const handleDelete = async (npc: Npc) => {
    await npcService.remove(npc.id);
    setNpcs((prev) => prev.filter((n) => n.id !== npc.id));
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
          onClick={() => dispatch({ type: "OPEN_CREATE" })}
          disabled={isModalOpen}
          className="rounded bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50"
        >
          + Create NPC
        </button>

        <button
          onClick={() =>
            selectedNpc && dispatch({ type: "OPEN_EDIT", npc: selectedNpc })
          }
          disabled={!selectedNpc || isModalOpen}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Edit NPC
        </button>

        <button
          onClick={() =>
            selectedNpc && dispatch({ type: "OPEN_DELETE", npc: selectedNpc })
          }
          disabled={!selectedNpc || isModalOpen}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
        >
          - Delete NPC
        </button>
        <button
          onClick={() =>
            selectedNpc &&
            dispatch({ type: "OPEN_GM_SECRETS", npc: selectedNpc })
          }
          disabled={!selectedNpc || isModalOpen}
          className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 disabled:opacity-50"
        >
          GM Secrets
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
      {modalState.mode === "create" && (
        <NpcFormModal
          campaignId={CAMPAIGN_ID}
          title="Create NPC"
          onClose={() => dispatch({ type: "CLOSE" })}
          onSubmitSuccess={(newNpc: Npc) => {
            setNpcs((prev) => [...prev, newNpc]);
            setSelectedNpc(newNpc);
            dispatch({ type: "CLOSE" });
          }}
        />
      )}

      {/* Edit Modal */}
      {modalState.mode === "edit" && modalState.npc && (
        <NpcFormModal
          campaignId={CAMPAIGN_ID}
          initialNpc={modalState.npc}
          title="Edit NPC"
          onClose={() => dispatch({ type: "CLOSE" })}
          onSubmitSuccess={(updatedNpc: Npc) => {
            setNpcs((prev) =>
              prev.map((npc) => (npc.id === updatedNpc.id ? updatedNpc : npc))
            );
            setSelectedNpc(updatedNpc);
            dispatch({ type: "CLOSE" });
          }}
        />
      )}

      {/* Delete Modal */}
      {modalState.mode === "confirmDelete" &&
        modalState.npc &&
        (() => {
          const npc = modalState.npc;

          return (
            <ConfirmDeleteModal
              title="Confirm Delete"
              message={`Delete ${npc.name}? This cannot be undone.`}
              onClose={() => dispatch({ type: "CLOSE" })}
              onConfirm={async () => {
                await handleDelete(npc);
                dispatch({ type: "CLOSE" });
              }}
            />
          );
        })()}
      {/*GM Secrets Modal */}
      {modalState.mode === "gmSecrets" && modalState.npc && (
        <GmSecretsModal
          npcId={modalState.npc.id}
          isOpen={true}
          onClose={() => dispatch({ type: "CLOSE" })}
        />
      )}
    </div>
  );
};

export default NpcDashboard;
