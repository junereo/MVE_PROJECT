"use client";

import { useState, useMemo, useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useAnswerStore } from "@/features/survey/store/useAnswerStore";
import {
  useSurveyStore,
  Questions,
} from "@/features/survey/store/useSurveyStore";
import { useSurveyInfo } from "@/features/users/store/useSurveyInfo";
import {
  getSurveyById,
  postSurveyAnswer,
} from "@/features/survey/services/survey";
import { updateUserInfo } from "@/features/users/services/user";
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
import { userUpdatePayload } from "@/features/users/utils/userUpdatePayload";

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
  const { answers, setAnswer, resetAnswers, setSubmitStatus } =
    useAnswerStore();
  const { gender, age, genre, jobDomain, resetUserInfo } = useSurveyInfo();
  const { user } = useAuthStore();

  const questions = useMemo(
    () => [...step4.questions, ...step4.customQuestions],
    [step4]
  );

  const [tabIndex, setTabIndex] = useState(0);
  const [showErrors, setShowErrors] = useState(false);

  const currentKey = baseCategories[tabIndex]?.key ?? "";
  const currentAnswers = useMemo(() => {
    return answers[currentKey] || {};
  }, [answers, currentKey]);

  const currentQuestions = useMemo(
    () => questions.filter((q) => q.category === currentKey),
    [questions, currentKey]
  );

  const isValid = useMemo(() => {
    return currentQuestions.every((q) => {
      const val = currentAnswers[q.id];
      return Array.isArray(val)
        ? val.length > 0
        : val !== undefined && val !== "";
    });
  }, [currentAnswers, currentQuestions]);

  const invalidQuestions = useMemo(() => {
    return currentQuestions.filter((q) => {
      const val = currentAnswers[q.id];
      return Array.isArray(val) ? val.length === 0 : !val;
    });
  }, [currentAnswers, currentQuestions]);

  const invalidMap = useMemo(() => {
    return invalidQuestions.reduce((acc, q) => {
      acc[q.id] = true;
      return acc;
    }, {} as Record<number, boolean>);
  }, [invalidQuestions]);

  useEffect(() => {
    if (step4.questions.length === 0 && step4.customQuestions.length === 0) {
      getSurveyById(surveyId).then((res) => {
        const rawQuestions = res.survey_question;
        if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
          console.error("질문이 없습니다.");
          return;
        }

        const fixedQuestions: Questions[] = [];
        const customQuestions: Questions[] = [];

        let idCounter = 0;

        rawQuestions.forEach((q) => {
          const question = {
            id: idCounter++,
            category: q.category ?? "step1",
            question_text: q.question_text,
            type: q.type,
            options: q.options ?? [],
            max_num: typeof q.max_num === "number" ? q.max_num : undefined,
            question_type: q.question_type ?? QuestionTypeEnum.FIXED,
          };

          if (question.question_type === QuestionTypeEnum.FIXED) {
            fixedQuestions.push(question);
          } else {
            customQuestions.push(question);
          }
        });

        setStep4({ questions: fixedQuestions, customQuestions });
      });
    }
  }, [surveyId, step4, setStep4]);

  const handlePrev = () => {
    if (tabIndex > 0) setTabIndex((prev) => prev - 1);
    else onPrev();
  };

  const handleNext = () => {
    if (!isValid) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    if (tabIndex < baseCategories.length - 1) setTabIndex((prev) => prev + 1);
    else onNext();
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      setSubmitStatus("error");
      return;
    }

    const {
      step4: { questions, customQuestions },
    } = useSurveyStore.getState();
    const formattedAnswers = formatDefaultAnswers(answers, [
      ...questions,
      ...customQuestions,
    ]);
    const userPayload = userUpdatePayload({ gender, age, genre, jobDomain });
    const surveyPayload = {
      user_id: user.id,
      survey_id: surveyId,
      answers: formattedAnswers,
      status: SurveyStatusEnum.COMPLETE,
      user_info: userPayload,
    };

    try {
      await updateUserInfo(Number(user.id), userPayload);
      await postSurveyAnswer(surveyPayload);
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

  const handleSave = async () => {
    if (!user?.id) {
      setSubmitStatus("error");
      return;
    }

    const {
      step4: { questions, customQuestions },
    } = useSurveyStore.getState();
    const formattedAnswers = formatDefaultAnswers(answers, [
      ...questions,
      ...customQuestions,
    ]);
    const payload = {
      user_id: user.id,
      survey_id: surveyId,
      user_info: { gender, age, genre, jobDomain },
      answers: formattedAnswers,
      status: SurveyStatusEnum.DRAFT,
    };

    try {
      await postSurveyAnswer(payload);
      setSubmitStatus("saved");
      resetAnswers();
      resetUserInfo();
      onNext();
    } catch (err) {
      console.error("임시저장 실패", err);
      setSubmitStatus("save-error");
      onNext();
    }
  };

  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[56px] flex justify-between items-center bg-white text-black border-b border-gray-200 px-4 z-30">
        <button onClick={handlePrev}>←</button>
        <h1 className="font-bold text-lg text-center flex-1">{surveyTitle}</h1>
      </header>

      <div className="space-y-4">
        <Breadcrumb
          crumbs={[
            { label: "설문", href: "/survey" },
            { label: surveyTitle, href: `/survey/${surveyId}` },
            { label: "설문" },
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
                <>
                  <QuestionSubjective
                    name={`question-${q.id}`}
                    value={typeof saved === "string" ? saved : ""}
                    onChange={(val) => setAnswer(currentKey, q.id, val)}
                  />
                  {showErrors && invalidMap[q.id] && (
                    <p className="text-red-500 text-sm mt-1">
                      답변을 입력해주세요.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <QuestionOptions
                    options={q.options ?? []}
                    value={saved}
                    type={q.type}
                    maxSelect={q.max_num}
                    onChange={(val) => setAnswer(currentKey, q.id, val)}
                    layout="horizontal"
                  />
                  {showErrors && invalidMap[q.id] && (
                    <p className="text-red-500 text-sm mt-1">
                      답변을 선택해주세요.
                    </p>
                  )}
                </>
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
        {tabIndex < baseCategories.length - 1 ? (
          <div className="w-[180px] sm:w-[400px]">
            <Button onClick={handleNext} color="blue">
              다음
            </Button>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="w-[70px] sm:w-[100px]">
              <Button onClick={handleSave} disabled={!isValid} color="white">
                임시저장
              </Button>
            </div>
            <div className="w-[110px] sm:w-[300px]">
              <Button onClick={handleSubmit} disabled={!isValid} color="blue">
                설문 참여
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
