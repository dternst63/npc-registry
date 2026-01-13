import type { ReactNode } from "react";

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const ModalShell = ({
  isOpen,
  onClose,
  title,
  children,
}: ModalShellProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg rounded bg-white p-4 shadow-lg">
        
        {/* Header */}
        {(title || onClose()) && (
          <div className="mb-3 flex items-center justify-between">
            {title && (
              <h2 className="text-lg font-semibold">{title}</h2>
            )}

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default ModalShell;
