"use client";

import { useFunnel } from "@/features/survey/hooks/useFunnel";
import Step1YouTube from "./Step1YouTube";
import Step2Meta from "./Step2Meta";
import Step3Type from "./Step3Type";
import Step4Default from "./Step4Default";
import Step5Custom from "./Step5Custom";
import Step6Result from "./Step6Result";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useRouter } from "next/navigation";

type Step = "step1" | "step2" | "step3" | "step4" | "step5" | "step6";

export default function SurveyCreateClient() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/auth"); // 로그인 페이지 경로에 맞게 수정
    }
  }, [user, router]);

  if (!user) return null;

  const steps: Step[] = ["step1", "step2", "step3", "step4", "step5", "step6"];
  const { Funnel, setStep, currentStep } = useFunnel<Step>(steps, "step1");

  return (
    <div className="mx-auto py-8">
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
          <Step4Default
            onPrev={() => setStep("step3")}
            onNext={() => setStep("step5")}
          />
        </Funnel.Step>
        <Funnel.Step name="step5">
          <Step5Custom
            onPrev={() => setStep("step4")}
            onNext={() => setStep("step6")}
          />
        </Funnel.Step>
        <Funnel.Step name="step6">
          <Step6Result onPrev={() => setStep("step5")} />
        </Funnel.Step>
      </Funnel>

      <p className="text-center text-sm text-gray-400">
        현재 단계: {currentStep}
      </p>
    </div>
  );
}
