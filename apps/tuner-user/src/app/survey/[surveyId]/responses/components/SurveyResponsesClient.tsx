"use client";

import { useFunnel } from "@/features/survey/hooks/useFunnel";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import Step1Info from "./Step1Info";
import Step2Default from "./Step2Default";
import Step3Custom from "./Step3Custom";
import Step4Result from "./Step4Result";

interface SurveyResponsesClientProps {
  surveyId: number;
  surveyTitle: string;
}

type Step = "step1" | "step2" | "step3" | "step4";

export default function SurveyResponsesClient({
  surveyId,
  surveyTitle,
}: SurveyResponsesClientProps) {
  const { isInitialized } = useAuthGuard();
  const { Funnel, setStep, currentStep } = useFunnel<Step>("step1");
  if (!isInitialized) return null;
  console.log("설문 ID:", surveyId);

  return (
    <div className="mx-auto py-8">
      <Funnel>
        <Funnel.Step name="step1">
          <Step1Info
            surveyId={surveyId}
            surveyTitle={surveyTitle}
            onNext={() => setStep("step2")}
          />
        </Funnel.Step>
        <Funnel.Step name="step2">
          <Step2Default
            surveyId={surveyId}
            surveyTitle={surveyTitle}
            onPrev={() => setStep("step1")}
            onNext={() => setStep("step3")}
          />
        </Funnel.Step>
        <Funnel.Step name="step3">
          <Step3Custom
            surveyId={surveyId}
            surveyTitle={surveyTitle}
            onPrev={() => setStep("step2")}
            onNext={() => setStep("step4")}
          />
        </Funnel.Step>
        <Funnel.Step name="step4">
          <Step4Result surveyId={surveyId} onPrev={() => setStep("step3")} />
        </Funnel.Step>
      </Funnel>

      <p className="text-center text-sm text-gray-400">
        현재 단계: {currentStep}
      </p>
    </div>
  );
}
