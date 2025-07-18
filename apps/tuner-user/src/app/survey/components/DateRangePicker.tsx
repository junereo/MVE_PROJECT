"use client";

import React from "react";

interface DateRangePickerProps {
  label?: string;
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
}

const formatDate = (date: Date): string => date.toISOString().split("T")[0];

const parseDate = (value: string): Date | null => {
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
};

export default function DateRangePicker({
  label,
  startDate,
  endDate,
  onChange,
}: DateRangePickerProps) {
  const todayStr = formatDate(new Date());

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = parseDate(e.target.value);
    onChange(newStart, endDate);
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = parseDate(e.target.value);
    onChange(startDate, newEnd);
  };

  const handleQuickRange = (days: number) => {
    const newStart = new Date();
    const newEnd = new Date();
    newEnd.setDate(newEnd.getDate() + days);
    onChange(newStart, newEnd);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {label && (
        <label className="text-base font-semibold text-gray-700">{label}</label>
      )}

      <div className="flex flex-wrap gap-2">
        {[0, 7, 15, 30].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => handleQuickRange(d)}
            className="px-3 py-1.5 rounded-full border border-[#57CC7E] text-[#57CC7E] text-sm  hover:text-white hover:bg-[#57CC7E] font-semibold transition"
          >
            {d === 0 ? "오늘" : `${d}일`}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="date"
          min={todayStr}
          value={startDate ? formatDate(startDate) : ""}
          onChange={handleStartChange}
          className="border rounded px-3 py-2 text-sm w-full"
        />
        <span className="text-gray-500 text-sm">~</span>
        <input
          type="date"
          min={startDate ? formatDate(startDate) : todayStr}
          value={endDate ? formatDate(endDate) : ""}
          onChange={handleEndChange}
          className="border rounded px-3 py-2 text-sm w-full"
        />
      </div>
    </div>
  );
}
