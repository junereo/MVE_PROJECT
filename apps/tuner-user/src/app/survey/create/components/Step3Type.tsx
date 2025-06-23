"use client";

import Button from "@/components/ui/Button";

interface Step3Props {
  onNext: () => void;
}

export default function Step3Type({ onNext }: Step3Props) {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Step 3: 설문 유형</h2>
      <input
        type="text"
        placeholder="Survey Type"
        className="border p-2 w-full"
      />
      <button
        onClick={onNext}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        다음
      </button>
    </div>
  );
}
