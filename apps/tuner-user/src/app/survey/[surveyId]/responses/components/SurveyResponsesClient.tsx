"use client";

import { useFunnel } from "@/features/survey/hooks/useFunnel";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import Step1Default from "./Step1Default";
import Step2Custom from "./Step2Custom";
import Step3Review from "./Step3Review";

type Step = "step1" | "step2" | "step3";

export default function SurveyResponsesClient() {
  const { isInitialized } = useAuthGuard();
  const { Funnel, setStep, currentStep } = useFunnel<Step>("step1");
  if (!isInitialized) return null;

  return (
    <div className="mx-auto py-8">
      <Funnel>
        <Funnel.Step name="step1">
          <Step1Default onNext={() => setStep("step2")} />
        </Funnel.Step>
        <Funnel.Step name="step2">
          <Step2Custom
            onPrev={() => setStep("step1")}
            onNext={() => setStep("step3")}
          />
        </Funnel.Step>
        <Funnel.Step name="step3">
          <Step3Review onPrev={() => setStep("step2")} />
        </Funnel.Step>
      </Funnel>

      <p className="text-center text-sm text-gray-400">
        현재 단계: {currentStep}
      </p>
    </div>
  );
}
