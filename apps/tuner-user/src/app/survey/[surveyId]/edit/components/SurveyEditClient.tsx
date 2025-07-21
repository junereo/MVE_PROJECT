"use client";

import { useState, useEffect } from "react";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import { useSurveyStore } from "@/features/survey/store/useSurveyStore";
import { useFunnel } from "@/features/survey/hooks/useFunnel";
import Step1YouTube from "@/app/survey/[surveyId]/edit/components/Step1YouTube";
import Step2Meta from "@/app/survey/[surveyId]/edit/components/Step2Meta";
import Step3Type from "@/app/survey/[surveyId]/edit/components/Step3Type";
import Step4Question from "@/app/survey/[surveyId]/edit/components/Step4Question";
import Step5Result from "@/app/survey/[surveyId]/edit/components/Step5Result";
import type { SurveyResponse } from "@/features/survey/types/surveyResponse";

export default function SurveyEditClient({
  initialSurvey,
}: {
  initialSurvey: SurveyResponse;
}) {
  const { isInitialized } = useAuthGuard();

  const { setStep1, setStep2, setStep3, setStep4 } = useSurveyStore();
  const { Funnel, setStep } = useFunnel<string>("step1");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized) return; // 로그인 확인 전이면 아무것도 안 함
    if (initialized) return;
    // survey_question이 string이면 파싱
    const surveyQuestions: SurveyResponse["survey_question"] =
      typeof initialSurvey.survey_question === "string"
        ? JSON.parse(initialSurvey.survey_question)
        : initialSurvey.survey_question || [];

    setStep1({
      video: {
        artist: initialSurvey.artist,
        music_title: initialSurvey.music_title,
        thumbnail_uri: initialSurvey.thumbnail_uri,
        music_uri: initialSurvey.music_uri,
        channelTitle: "", // 필요시 채널명 등 추가, 없으면 빈 문자열
        select_url: initialSurvey.music_uri, // 필요시 적절히 매핑
      },
      start_at: new Date(initialSurvey.start_at),
      end_at: new Date(initialSurvey.end_at),
    });
    setStep2({
      survey_title: initialSurvey.survey_title,
      is_released: initialSurvey.released_date ? true : false,
      released_date: initialSurvey.released_date,
      genre: initialSurvey.genre,
    });
    setStep3({
      surveyType: initialSurvey.type,
      reward_amount: initialSurvey.reward_amount,
      reward: initialSurvey.reward,
      expert_reward: initialSurvey.expert_reward,

      // 기타 reward 관련 필드도 필요시 추가
    });
    setStep4({
      questions: surveyQuestions.map((q) => ({
        ...q,
        id: q.id ?? 0,
        max_num: typeof q.max_num === "number" ? q.max_num : undefined,
      })),
      customQuestions: [], // 필요시 분리
    });
    setInitialized(true);
  }, [
    initialSurvey,
    initialized,
    isInitialized,
    setStep1,
    setStep2,
    setStep3,
    setStep4,
  ]);

  if (!isInitialized) return null; // 아직 로그인 여부 확인 중이면 렌더링 X

  // 이후 create의 Step 컴포넌트 재활용
  return (
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
          initialSurvey={initialSurvey}
          onPrev={() => setStep("step3")}
          onNext={() => setStep("step5")}
        />
      </Funnel.Step>
      <Funnel.Step name="step5">
        <Step5Result onPrev={() => setStep("step4")} />
      </Funnel.Step>
    </Funnel>
  );
}
