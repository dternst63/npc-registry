import { useState } from "react";
import ModalShell from "../ModalShell";
import NpcForm from "../npc/NpcForm";
import type { Npc } from "../../types/Npc";
import type { NpcFormData } from "../../types/NpcForm";
import { npcService } from "../../services/npcService";
import type { AsyncStatus } from "../../types/AsyncStatus";
import LoadingBar from "../ui/LoadingBar";

interface NpcFormModalProps {
  onClose: () => void;
  campaignId: string;
  initialNpc?: Npc;
  title: string;
  onSubmitSuccess: (npc: Npc) => void;
}


const NpcFormModal = ({
  onClose,
  campaignId,
  initialNpc,
  title,
  onSubmitSuccess,
}: NpcFormModalProps) => {
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  
  const handleSubmit = async (data: NpcFormData) => {
    try {
      setStatus("submitting");
      setMessage("Saving NPC…");

      const savedNpc = initialNpc
        ? await npcService.update(initialNpc.id, campaignId, data)
        : await npcService.create(campaignId, data);

      onSubmitSuccess(savedNpc);

      setStatus("success");
      setMessage("NPC saved successfully.");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Failed to save NPC.");
    }
  };

  return (
    <ModalShell onClose={onClose} title={title}>
      <LoadingBar active={status === "submitting"} />
      {status !== "idle" && message && (
        <div
          className={`mb-3 rounded px-3 py-2 text-sm ${
            status === "success"
              ? "bg-green-50 text-green-700"
              : status === "error"
              ? "bg-red-50 text-red-700"
              : "bg-blue-50 text-blue-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* SUCCESS STATE */}
      {status === "success" ? (
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-black px-4 py-2 text-white"
          >
            Close
          </button>
        </div>
      ) : (
        <NpcForm
          initialNpc={initialNpc}
          disabled={status === "submitting"}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      )}
    </ModalShell>
  );
};

export default NpcFormModal;
