"use client";

import Button from "@/components/ui/Button";

interface Step4Props {
  onNext: () => void;
}

export default function Step4Default({ onNext }: Step4Props) {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Step 4: 기본 설문</h2>
      <input type="text" placeholder="Default" className="border p-2 w-full" />
      <button
        onClick={onNext}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        다음
      </button>
    </div>
  );
}
