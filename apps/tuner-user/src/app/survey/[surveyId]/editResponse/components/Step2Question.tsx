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
import { UserSurveyInfo } from "@/features/users/types/userInfo";
import { AnswerItem } from "@/features/users/types/updateSurveyResponse";

interface Step2Props {
  surveyId: number;
  surveyTitle: string;
  submitAnswers: AnswerItem[];
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
  submitAnswers,
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
  const currentKey = baseCategories[tabIndex]?.key ?? "";

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
    if (step4.questions.length === 0 && step4.customQuestions.length === 0) {
      getSurveyById(surveyId).then((res) => {
        const rawQuestions = res.survey_question;
        console.log("rawQuestions", rawQuestions);
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

        setStep4({
          questions: fixedQuestions,
          customQuestions,
        });
      });
    }
  }, [surveyId, step4, setStep4]);

  useEffect(() => {
    if (submitAnswers?.length && questions.length) {
      submitAnswers.forEach((ans) => {
        const question = questions.find((q) => q.id === ans.id);
        if (!question) return;
        const category = question.category;
        const validAnswer =
          typeof ans.answer === "string" || Array.isArray(ans.answer)
            ? ans.answer
            : String(ans.answer); // 숫자 등도 문자열로 안전 처리
        setAnswer(category, question.id, validAnswer);
      });
    }
  }, [submitAnswers, questions]);

  useEffect(() => {
    console.log("설문 답변", answers);
  }, [answers]);

  useEffect(() => {
    console.log("user.id 확인:", user?.id);
  }, [user]);

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
    if (!user?.id) {
      console.error("로그인 정보가 없습니다.");
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

    const userInfo: UserSurveyInfo = {
      gender,
      age,
      genre,
      jobDomain,
    };
    const userPayload = userUpdatePayload(userInfo);
    const surveyPayload = {
      user_id: user.id,
      survey_id: surveyId,
      answers: formattedAnswers,
      status: SurveyStatusEnum.COMPLETE,
      user_info: userPayload,
    };
    console.log("userPayload", userPayload);
    console.log("payload", surveyPayload);

    try {
      const response = await updateUserInfo(Number(user.id), userPayload);
      console.log("기본 정보", response);
      const res = await postSurveyAnswer(surveyPayload);
      console.log("설문 참여", res);
      sessionStorage.removeItem("editResponseData");
      setSubmitStatus("success");
      resetAnswers();
      resetUserInfo();
      onNext(); // 여기서 에러 터지는 것 같음
    } catch (err) {
      console.error("설문 제출 실패", err);
      setSubmitStatus("error");
      onNext();
    }
  };

  // 임시저장
  const handleSave = async () => {
    if (!user?.id) {
      console.error("로그인 정보가 없습니다.");
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
    console.log("payload", payload);

    try {
      await postSurveyAnswer(payload);
      sessionStorage.removeItem("editResponseData");
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
        <h1 className="font-bold text-lg text-center flex-1">설문 참여</h1>
      </header>

      <div className="space-y-4">
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
                  maxSelect={q.max_num}
                  onChange={(val) => setAnswer(currentKey, q.id, val)}
                  layout="horizontal"
                />
              )}
            </div>
          );
        })}
      </div>

      {tabIndex < baseCategories.length - 1 ? (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[72px] bg-white border-t border-gray-200 z-30 flex items-center justify-between gap-3 px-4 py-3">
          <div className="w-[140px] sm:w-[200px]">
            <Button onClick={handlePrev} color="white">
              이전
            </Button>
          </div>
          <div className="w-[180px] sm:w-[400px]">
            <Button onClick={handleNext} disabled={!isValid} color="blue">
              다음
            </Button>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[72px] bg-white border-t border-gray-200 z-30 flex items-center justify-between gap-3 px-4 py-3">
          <div className="w-[140px] sm:w-[200px]">
            <Button onClick={handlePrev} color="white">
              이전
            </Button>
          </div>
          <div className="flex items-center">
            <div className="w-[70px] sm:w-[100px]">
              <Button onClick={handleSave} color="white">
                임시저장
              </Button>
            </div>
            <div className="w-[110px] sm:w-[300px]">
              <Button onClick={handleSubmit} disabled={!isValid} color="blue">
                설문 참여
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
