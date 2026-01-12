import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        className="relative w-full max-w-lg bg-white rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()} // ⬅️ KEY LINE
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="
            absolute top-2.5 right-2.5
            flex items-center justify-center
            h-7 w-7
            rounded-md
            bg-gray-100
            text-gray-600 text-sm
            hover:bg-gray-200 hover:text-gray-800
          "
        >
          ✕
        </button>

        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};


export default Modal;
