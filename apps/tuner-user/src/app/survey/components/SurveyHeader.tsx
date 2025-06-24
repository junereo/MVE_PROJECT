"use client";

import { ArrowLeft } from "lucide-react";
import { useFunnel } from "@/features/servey/hooks/useFunnel";

const steps = ["step1", "step2", "step3", "step4", "step5"] as const;

type Step = (typeof steps)[number];
export default function SurveyHeader() {
  const mutableSteps = [...steps] as Step[];
  const { hasPrev, prevStep } = useFunnel<Step>("step1", mutableSteps);
  console.log(hasPrev);

  return (
    <header className="w-full flex items-center px-4 py-3">
      {hasPrev && (
        <button onClick={prevStep} className="text-blue-500">
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}
      <h1 className="mx-auto font-semibold text-lg">설문 생성</h1>
    </header>
  );
}
