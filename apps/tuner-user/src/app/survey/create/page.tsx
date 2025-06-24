"use client";

import { useFunnel } from "@/features/servey/hooks/useFunnel";
import Step1YouTube from "./components/Step1YouTube";
import Step2Meta from "./components/Step2Meta";
import Step3Type from "./components/Step3Type";
import Step4Default from "./components/Step4Default";
import Step5Custom from "./components/Step5Custom";

type Step = "step1" | "step2" | "step3" | "step4" | "step5";

export default function SurveyCreatePage() {
  const { Funnel, setStep, currentStep } = useFunnel<Step>("step1");
  return (
    <div className="max-w-lg mx-auto py-8">
      <Funnel>
        <Funnel.Step name="step1">
          <Step1YouTube onNext={() => setStep("step2")} />
        </Funnel.Step>
        <Funnel.Step name="step2">
          <Step2Meta onNext={() => setStep("step3")} />
        </Funnel.Step>
        <Funnel.Step name="step3">
          <Step3Type onNext={() => setStep("step4")} />
        </Funnel.Step>
        <Funnel.Step name="step4">
          <Step4Default onNext={() => setStep("step5")} />
        </Funnel.Step>
        <Funnel.Step name="step5">
          <Step5Custom />
        </Funnel.Step>
      </Funnel>

      <p className="text-center text-sm text-gray-400 mt-4">
        현재 단계: {currentStep}
      </p>
    </div>
  );
}
