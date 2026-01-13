import { useState, useEffect, useRef } from "react";
import ModalShell from "./ModalShell";
import NpcForm from "../NpcForm";
import type { Npc } from "../../types/Npc";
import type { NpcFormData } from "../../types/NpcForm";
import type { AsyncStatus } from "../../types/AsyncStatus";
import LoadingBar from "../ui/LoadingBar";

interface NpcFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  initialNpc?: Npc;
  title: string;
  onSubmitSuccess: (npc: Npc) => void;
}

const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));


const NpcFormModal = ({
  isOpen,
  onClose,
  campaignId,
  initialNpc,
  title,
  onSubmitSuccess,
}: NpcFormModalProps) => {
  const [status, setStatus] = useState<AsyncStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const prevIsOpen = useRef(false);

  useEffect(() => {
    if (isOpen && !prevIsOpen.current) {
      setStatus("idle");
      setMessage(null);
    }

    prevIsOpen.current = isOpen;
  }, [isOpen]);

  const handleSubmit = async (data: NpcFormData) => {
    try {
      setStatus("submitting");
      setMessage("Saving NPC…");

      // 🔧 DEV-ONLY DELAY (remove later)
      await sleep(1500);

      const url = initialNpc?.id
        ? `http://localhost:3001/api/npcs/${initialNpc.id}`
        : `http://localhost:3001/api/npcs`;

      const method = initialNpc ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, campaignId }),
      });

      if (!res.ok) {
        throw new Error("Save failed");
      }

      const savedNpc: Npc = await res.json();
      onSubmitSuccess(savedNpc);

      setStatus("success");
      setMessage("NPC saved successfully.");
    } catch {
      setStatus("error");
      setMessage("Failed to save NPC.");
    }
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title={title}>
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
