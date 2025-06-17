import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col">
      {label && <label className="text-sm text-gray-600">{label}</label>}
      <input
        className={`w-full px-4 py-2 rounded-md placeholder:text-gray-400 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        {...props}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
}
