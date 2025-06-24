"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface Step5Props {
  onPrev: () => void;
}

export default function Step5Custom({ onPrev }: Step5Props) {
  return (
    <>
      <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] flex  bg-white text-black border border-red-500 z-30flex items-center justify-between px-4 py-3">
        <button onClick={onPrev}>←</button>
        <h1 className="font-bold text-lg text-center flex-1">설문 생성</h1>
      </div>

      <div className="p-4 space-y-6 min-h-screen">
        <h2 className="text-xl font-bold">Step 5: 커스텀 설문</h2>

        <div className="space-y-2">
          <div className="text-sm font-medium">커스텀 설문</div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] items-center bg-white text-black border border-green-700 px-4 py-2 z-30 flex justify-end pt-4">
        <Button onClick={onPrev} color="white">
          이전
        </Button>
        <Button color="blue">작성 완료</Button>
      </div>
    </>
  );
}
