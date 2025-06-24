"use client";

import { useState } from "react";

interface DateRangePickerProps {
  label?: string;
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date, end: Date) => void;
}

export default function DateRangePicker({
  label,
  startDate,
  endDate,
  onChange,
}: DateRangePickerProps) {
  const [start, setStart] = useState<string>(
    startDate?.toISOString().split("T")[0] || ""
  );
  const [end, setEnd] = useState<string>(
    endDate?.toISOString().split("T")[0] || ""
  );

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = new Date(e.target.value);
    setStart(e.target.value);
    onChange(newStart, endDate ?? newStart); // endDate가 없으면 start랑 동일
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = new Date(e.target.value);
    setEnd(e.target.value);
    onChange(startDate ?? newEnd, newEnd);
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="flex gap-2">
        <input
          type="date"
          value={start}
          onChange={handleStartChange}
          className="border rounded px-3 py-2 text-sm w-full"
        />
        <span className="text-gray-500 text-sm">~</span>
        <input
          type="date"
          value={end}
          onChange={handleEndChange}
          className="border rounded px-3 py-2 text-sm w-full"
        />
      </div>
    </div>
  );
}
