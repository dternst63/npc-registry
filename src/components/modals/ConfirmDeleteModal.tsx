import { useState } from "react";
import ModalShell from "./ModalShell";
import LoadingBar from "../ui/LoadingBar";
import type { AsyncStatus } from "../../types/AsyncStatus";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  message?: string;
}

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message = "Are you sure you want to delete this item? This action cannot be undone.",
}: ConfirmDeleteModalProps) => {
  const [status, setStatus] = useState<AsyncStatus>("idle");

  const handleDelete = async () => {
    try {
      setStatus("submitting");
      await onConfirm();
      setStatus("success");

      // Give user feedback before closing
    } catch {
      setStatus("error");
    }
  };

  const handleClose = () => {
    setStatus("idle");
    onClose();
  };

  return (
    <ModalShell isOpen={isOpen} onClose={handleClose} title={title}>
      <LoadingBar active={status === "submitting"} />
      <p className="text-sm text-gray-700">{message}</p>

      {/* Status message */}
      {status === "submitting" && (
        <p className="mt-2 text-sm text-blue-600">Deleting…</p>
      )}

      {status === "success" && (
        <p className="mt-2 text-sm text-green-600">Deleted successfully.</p>
      )}

      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">
          Delete failed. Please try again.
        </p>
      )}

      {/* Actions */}
      {status === "success" ? (
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded bg-black px-4 py-2 text-white"
          >
            Close
          </button>
        </div>
      ) : (
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={status === "submitting"}
            className="rounded border px-3 py-1 text-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={status === "submitting"}
            className="rounded bg-red-600 px-3 py-1 text-sm text-white"
          >
            {status === "submitting" ? "Deleting…" : "Delete"}
          </button>
        </div>
      )}
    </ModalShell>
  );
};

export default ConfirmDeleteModal;
