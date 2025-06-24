"use client";

import Button from "@/components/ui/Button";
import { useFunnel } from "@/features/servey/hooks/useFunnel";

const steps = ["step1", "step2", "step3", "step4", "step5"] as const;

type Step = (typeof steps)[number];
export default function SurveyFooter() {
  const mutableSteps = [...steps] as Step[];
  const { hasPrev, prevStep, hasNext, nextStep } = useFunnel<Step>(
    "step1",
    mutableSteps
  );

  return (
    <footer className="w-full fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-[485px] px-4 py-3 bg-white shadow-md flex justify-between">
      {hasPrev && (
        <Button onClick={prevStep} color="white">
          이전
        </Button>
      )}
      {hasNext && (
        <Button onClick={nextStep} color="blue">
          다음
        </Button>
      )}
    </footer>
  );
}
