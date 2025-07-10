"use client";

import { useState, useMemo, useEffect } from "react";
import { useAnswerStore } from "@/features/survey/store/useAnswerStore";
import {
  useSurveyStore,
  Questions,
} from "@/features/survey/store/useSurveyStore";
import { useSurveyInfo } from "@/features/users/store/useSurveyInfo";
import {
  fetchSurveyQuestions,
  postSurveyAnswer,
} from "@/features/survey/services/survey";
import {
  InputTypeEnum,
  QuestionTypeEnum,
  SurveyStatusEnum,
} from "@/features/survey/types/enums";

import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SurveyTabs from "@/app/survey/components/SurveyTabs";
import QuestionText from "@/app/survey/components/QuestionText";
import QuestionOptions from "@/app/survey/components/QuestionOptions";
import QuestionSubjective from "@/app/survey/components/QuestionSubjective";
import { formatDefaultAnswers } from "@/features/survey/utils/fotmatAnswers";

interface Step2Props {
  surveyId: number;
  surveyTitle: string;
  onPrev: () => void;
  onNext: () => void;
}

const baseCategories = [
  { key: "step1", label: "step1" },
  { key: "step2", label: "step2" },
  { key: "step3", label: "step3" },
];

export default function Step2Question({
  surveyId,
  surveyTitle,
  onPrev,
  onNext,
}: Step2Props) {
  const { step4, setStep4 } = useSurveyStore();
  const { answers, setAnswer, resetAnswers } = useAnswerStore();
  const { gender, age, genres, isMusicRelated, resetUserInfo } =
    useSurveyInfo();

  const questions = useMemo(
    () => [...step4.questions, ...step4.customQuestions],
    [step4]
  );

  const [tabIndex, setTabIndex] = useState(0);
  const currentKey = baseCategories[tabIndex]?.key ?? "";
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const currentQuestions = useMemo(
    () => questions.filter((q) => q.category === currentKey),
    [questions, currentKey]
  );

  const isValid = useMemo(() => {
    const currentAnswers = answers[currentKey] || {};
    return currentQuestions.every((q) => {
      const val = currentAnswers[q.id];
      return Array.isArray(val)
        ? val.length > 0
        : val !== undefined && val !== "";
    });
  }, [answers, currentKey, currentQuestions]);

  useEffect(() => {
    if (step4.questions.length === 0) {
      fetchSurveyQuestions(surveyId).then((res) => {
        console.log("fetchSurveyQuestions response:", res.data);

        const data = res.data?.[0];
        const questions = data?.question;

        if (!questions || questions.length === 0) {
          console.error("❌ 설문 항목이 없습니다.", questions);
          return;
        }


        const fixedQuestions: Questions[] = [];
        const customQuestions: Questions[] = [];

        Object.entries(questions).forEach(([category, items]) => {
          (items as any[]).forEach((q) => {
            const question: Questions = {
              id: q.id,
              category,
              question_text: q.question_text,
              type: q.type,
              options: q.options,
              question_type: q.question_type ?? QuestionTypeEnum.FIXED,
            };

            if (question.question_type === QuestionTypeEnum.FIXED) {
              fixedQuestions.push(question);
            } else {
              customQuestions.push(question);
            }
          });
        });

        setStep4({
          ...step4,
          questions: fixedQuestions,
          customQuestions: customQuestions,
        });
      });
    }
  }, [step4, setStep4, surveyId]);

  const handlePrev = () => {
    if (tabIndex > 0) {
      setTabIndex((prev) => prev - 1);
    } else {
      onPrev();
    }
  };

  const handleNext = () => {
    if (tabIndex < baseCategories.length - 1) {
      setTabIndex((prev) => prev + 1);
    } else {
      onNext();
    }
  };

  const handleSubmit = async () => {
    const {
      step4: { questions, customQuestions },
    } = useSurveyStore.getState();
    const formattedAnswers = formatDefaultAnswers(answers, [
      ...questions,
      ...customQuestions,
    ]);

    const payload = {
      user_id: "1", // 실제 유저 ID로 대체
      survey_id: surveyId,
      user_info: { gender, age, genres, isMusicRelated },
      answers: formattedAnswers,
      status: SurveyStatusEnum.COMPLETE,
    };
    console.log("payload", payload);

    try {
      const res = await postSurveyAnswer(payload);
      console.log("참여 결과", res);
      setSubmitStatus("success");
      resetAnswers();
      resetUserInfo();
      onNext();
    } catch (err) {
      console.error("설문 제출 실패", err);
      setSubmitStatus("error");
      onNext();
    }
  };

  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[56px] flex justify-between items-center bg-white text-black border-b border-gray-200 px-4 z-30">
        <button onClick={handlePrev}>←</button>
        <h1 className="font-bold text-lg text-center flex-1">설문 참여</h1>
      </header>

      <div className="space-y-4 min-h-screen">
        <Breadcrumb
          crumbs={[
            { label: "설문", href: "/survey" },
            { label: surveyTitle, href: `/survey/${surveyId}` },
            { label: "기본 설문" },
          ]}
        />

        <SurveyTabs
          tabs={baseCategories}
          current={tabIndex}
          setTab={setTabIndex}
        />

        {currentQuestions.map((q, idx) => {
          const saved = answers[currentKey]?.[q.id] as
            | string
            | string[]
            | undefined;

          return (
            <div
              key={q.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4"
            >
              <QuestionText text={`Q${idx + 1}. ${q.question_text}`} />

              {q.type === InputTypeEnum.SUBJECTIVE ? (
                <QuestionSubjective
                  name={`question-${q.id}`}
                  value={typeof saved === "string" ? saved : ""}
                  onChange={(val) => setAnswer(currentKey, q.id, val)}
                />
              ) : (
                <QuestionOptions
                  options={q.options ?? []}
                  value={saved}
                  type={q.type}
                  onChange={(val) => setAnswer(currentKey, q.id, val)}
                  layout="horizontal"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[72px] bg-white border-t border-gray-200 z-30 flex items-center justify-between gap-3 px-4 py-3">
        <div className="w-[140px] sm:w-[200px]">
          <Button onClick={handlePrev} color="white">
            이전
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {tabIndex < baseCategories.length - 1 ? (
            <div className="w-[180px] sm:w-[400px]">
              <Button onClick={handleNext} disabled={!isValid} color="blue">
                다음
              </Button>
            </div>
          ) : (
            <div className="w-[180px] sm:w-[400px]">
              <Button onClick={handleSubmit} disabled={!isValid} color="blue">
                설문 제출
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
