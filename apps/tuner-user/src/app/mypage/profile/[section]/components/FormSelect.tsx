"use client";

import Dropdown from "@/components/ui/DropDown";

interface FormSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
}

export default function FormSelect({
  label,
  value,
  onChange,
  options,
}: FormSelectProps) {
  const selectedLabel =
    options.find((opt) => opt.value === value)?.label ?? "선택하세요";

  const handleSelect = (label: string) => {
    const selectedOption = options.find((opt) => opt.label === label);
    if (selectedOption) onChange(selectedOption.value);
  };

  return (
    <div className="w-full">
      <label className="text-sm text-gray-600">{label}</label>
      <Dropdown
        options={options.map((opt) => opt.label)}
        selected={selectedLabel}
        onSelect={handleSelect}
      />
    </div>
  );
}
