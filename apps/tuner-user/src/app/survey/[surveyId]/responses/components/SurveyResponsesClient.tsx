"use client";

import { useFunnel } from "@/features/survey/hooks/useFunnel";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import Step1Info from "./Step1Info";
import Step2Question from "./Step2Question";
import Step3Result from "./Step3Result";

interface SurveyResponsesClientProps {
  surveyId: number;
  surveyTitle: string;
}

type Step = "step1" | "step2" | "step3";

export default function SurveyResponsesClient({
  surveyId,
  surveyTitle,
}: SurveyResponsesClientProps) {
  const { isInitialized } = useAuthGuard();
  const { Funnel, setStep, currentStep } = useFunnel<Step>("step1");
  if (!isInitialized) return null;

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
          <Step2Question
            surveyId={surveyId}
            surveyTitle={surveyTitle}
            onPrev={() => setStep("step1")}
            onNext={() => setStep("step3")}
          />
        </Funnel.Step>
        <Funnel.Step name="step3">
          <Step3Result surveyId={surveyId} onPrev={() => setStep("step2")} />
        </Funnel.Step>
      </Funnel>

      <p className="text-center text-sm text-gray-400">
        현재 단계: {currentStep}
      </p>
    </div>
  );
}
