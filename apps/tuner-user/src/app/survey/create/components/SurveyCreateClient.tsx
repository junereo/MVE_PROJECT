"use client";

import { useFunnel } from "@/features/survey/hooks/useFunnel";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import Step1YouTube from "./Step1YouTube";
import Step2Meta from "./Step2Meta";
import Step3Type from "./Step3Type";
import Step4Question from "./Step4Question";
import Step5Result from "./Step5Result";

type Step = "step1" | "step2" | "step3" | "step4" | "step5";

export default function SurveyCreateClient() {
  const { isInitialized } = useAuthGuard();
  const { Funnel, setStep } = useFunnel<Step>("step1");

  if (!isInitialized) return null; // 아직 로그인 여부 확인 중이면 렌더링 X

  return (
    <div>
      <Funnel>
        <Funnel.Step name="step1">
          <Step1YouTube onNext={() => setStep("step2")} />
        </Funnel.Step>
        <Funnel.Step name="step2">
          <Step2Meta
            onPrev={() => setStep("step1")}
            onNext={() => setStep("step3")}
          />
        </Funnel.Step>
        <Funnel.Step name="step3">
          <Step3Type
            onPrev={() => setStep("step2")}
            onNext={() => setStep("step4")}
          />
        </Funnel.Step>
        <Funnel.Step name="step4">
          <Step4Question
            onPrev={() => setStep("step3")}
            onNext={() => setStep("step5")}
          />
        </Funnel.Step>
        <Funnel.Step name="step5">
          <Step5Result onPrev={() => setStep("step4")} />
        </Funnel.Step>
      </Funnel>
    </div>
  );
}
