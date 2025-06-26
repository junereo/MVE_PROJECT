"use client";

import { useState } from "react";

interface DatePickerProps {
  label?: string;
  selected: Date | null;
  onChange: (date: Date) => void;
}

export default function DatePicker({
  label,
  selected,
  onChange,
}: DatePickerProps) {
  const [value, setValue] = useState(
    selected?.toISOString().split("T")[0] || ""
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    setValue(e.target.value);
    onChange(newDate);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        type="date"
        value={value}
        onChange={handleChange}
        className="border rounded px-3 py-2 text-sm"
      />
    </div>
  );
}
