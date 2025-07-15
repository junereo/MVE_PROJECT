"use client";

import { useFunnel } from "@/features/survey/hooks/useFunnel";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import Step1Info from "./Step1Info";
import Step2Question from "./Step2Question";
import Step3Result from "./Step3Result";
import { AnswerItem } from "@/features/users/types/updateSurveyResponse";

interface EditResponseClientProps {
  surveyId: number;
  surveyTitle: string;
  submitAnswers: AnswerItem[];
}

type Step = "step1" | "step2" | "step3";

export default function EditResponseClient({
  surveyId,
  surveyTitle,
  submitAnswers,
}: EditResponseClientProps) {
  const { isInitialized } = useAuthGuard();
  const { Funnel, setStep } = useFunnel<Step>("step1");

  console.log("🔍 [EditResponseClient] props", {
    surveyId,
    surveyTitle,
    submitAnswers,
  });

  if (!isInitialized) return null;

  return (
    <>
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
            submitAnswers={submitAnswers}
            onPrev={() => setStep("step1")}
            onNext={() => setStep("step3")}
          />
        </Funnel.Step>
        <Funnel.Step name="step3">
          <Step3Result surveyId={surveyId} onPrev={() => setStep("step2")} />
        </Funnel.Step>
      </Funnel>
    </>
  );
}
