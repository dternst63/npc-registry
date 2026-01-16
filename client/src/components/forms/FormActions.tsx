interface FormActionsProps {
  submitLabel: string;
  onCancel: () => void;
  disabled?: boolean;
  canSubmit?: boolean;
}

const FormActions = ({
  submitLabel,
  onCancel,
  disabled = false,
  canSubmit = true,
}: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-3 pt-6">
      <button
        type="button"
        onClick={onCancel}
        disabled={disabled}
        className="rounded border px-4 py-2 text-gray-700
                   hover:bg-gray-100 disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={disabled || !canSubmit}
        className="rounded bg-black px-4 py-2 text-white
                   hover:bg-gray-800 disabled:opacity-50"
      >
        {submitLabel}
      </button>
    </div>
  );
};

export default FormActions;
