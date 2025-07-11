"use client";

import { InputHTMLAttributes } from "react";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  error?: string;
  optionClassName?: string;
}

export default function FormInput({
  label,
  value,
  onChange,
  type = "text",
  maxLength,
  error,
  ...props
}: InputProps) {
  const isReadOnly = !onChange;

  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        maxLength={maxLength}
        className={`block w-full mt-1 px-3 py-2 border rounded ${
          isReadOnly ? "bg-gray-100 text-gray-500" : ""
        } ${
          error ? "border-red-500 focus:outline-red-500" : "border-gray-300"
        }`}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={isReadOnly}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
