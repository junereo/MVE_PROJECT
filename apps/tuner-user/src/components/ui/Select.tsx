"use client";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  options: Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Select({
  label,
  options,
  value,
  onChange,
  placeholder,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="" disabled>
          {placeholder || "선택하세요"}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
