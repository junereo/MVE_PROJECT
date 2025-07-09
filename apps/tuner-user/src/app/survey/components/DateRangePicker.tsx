"use client";

import { useEffect, useState } from "react";

interface DateRangePickerProps {
  label?: string;
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null) => void;
}

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export default function DateRangePicker({
  label,
  startDate,
  endDate,
  onChange,
}: DateRangePickerProps) {
  const todayStr = formatDate(new Date());
  const [start, setStart] = useState<string>(
    startDate ? formatDate(startDate) : todayStr
  );
  const [end, setEnd] = useState<string>(
    endDate ? formatDate(endDate) : todayStr
  );

  useEffect(() => {
    // 최초 로드 시 디폴트 설정
    if (!startDate && !endDate) {
      const today = new Date();
      onChange(today, today);
    }
  }, []);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newStart = value ? new Date(value) : null;

    if (newStart && newStart < new Date(todayStr)) return; // 과거 금지
    setStart(value);
    onChange(
      newStart,
      endDate && newStart && endDate < newStart ? newStart : endDate
    );
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newEnd = value ? new Date(value) : null;

    if (!startDate || (newEnd && newEnd < startDate)) return; // 시작일보다 과거 금지
    setEnd(value);
    onChange(startDate, newEnd);
  };

  const handleQuickRange = (days: number) => {
    const newStart = new Date();
    const newEnd = new Date();
    newEnd.setDate(newEnd.getDate() + days);

    setStart(formatDate(newStart));
    setEnd(formatDate(newEnd));
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
            className="px-3 py-1.5 rounded-full border border-blue-700 text-sm text-blue-700 hover:text-white hover:bg-blue-700 transition"
          >
            {d === 0 ? "오늘" : `${d}일`}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="date"
          min={todayStr}
          value={start}
          onChange={handleStartChange}
          className="border rounded px-3 py-2 text-sm w-full"
        />
        <span className="text-gray-500 text-sm">~</span>
        <input
          type="date"
          min={start}
          value={end}
          onChange={handleEndChange}
          className="border rounded px-3 py-2 text-sm w-full"
        />
      </div>
    </div>
  );
}
