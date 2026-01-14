import React from "react";
import type { NpcFormField } from "../../types/NpcForm";

interface FormFieldProps {
  label: string;
  name: NpcFormField;
  value: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  maxLength?: number;
  minLength?: number;
  disabled?: boolean;
  as?: "input" | "textarea";
  rows?: number;

  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onBlur: () => void;
}

const FormField = ({
  label,
  name,
  value,
  required = false,
  error,
  touched,
  maxLength,
  minLength,
  disabled,
  as = "input",
  rows = 3,
  onChange,
  onBlur,
}: FormFieldProps) => {
  const showError = touched && error;
  const count = value.length;

  const baseClasses =
    "mt-1 w-full rounded border px-2 py-1 text-sm focus:outline-none focus:ring-1";

  const borderClasses = showError
    ? "border-red-500 focus:ring-red-500"
    : "border-gray-300 focus:ring-blue-500";

  const InputComponent = as === "textarea" ? "textarea" : "input";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && "*"}
      </label>

      <InputComponent
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        minLength={minLength}   
        maxLength={maxLength}   
        rows={as === "textarea" ? rows : undefined}
        className={`${baseClasses} ${borderClasses}`}
      />

      <div className="flex items-center text-xs mt-1">
        <div className="flex-1">
          {showError && (
            <p className="text-red-600">{error}</p>
          )}
        </div>

        {maxLength !== undefined && (
          <span
            className={
              count > maxLength
                ? "text-red-600"
                : "text-gray-500"
            }
          >
            {count} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

export default FormField;
