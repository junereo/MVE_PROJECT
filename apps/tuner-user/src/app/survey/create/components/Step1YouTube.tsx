"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import DateRangePicker from "../../components/DateRangePicker";
import { useState } from "react";

interface Step1Props {
  onNext: () => void;
}

export default function Step1YouTube({ onNext }: Step1Props) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Step 1: 유튜브</h2>

      <div className="flex gap-2">
        <Input placeholder="YouTube" />
        <Button type="submit" color="white">
          검색
        </Button>
      </div>

      <div className="space-y-4">
        <Input label="곡 제목" placeholder="곡 제목을 입력해주세요." />
        <Input label="아티스트" placeholder="아티스트명을 입력해주세요." />
      </div>

      <DateRangePicker
        label="설문 기간"
        startDate={startDate}
        endDate={endDate}
        onChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
      />

      <Button onClick={onNext} color="blue">
        다음
      </Button>
    </div>
  );
}
