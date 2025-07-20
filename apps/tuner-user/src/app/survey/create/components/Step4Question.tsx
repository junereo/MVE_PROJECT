"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import SurveyTabs from "../../components/SurveyTabs";
import QuestionText from "../../components/QuestionText";
import QuestionOptions from "../../components/QuestionOptions";
import QuestionSubjective from "../../components/QuestionSubjective";
import {
  fetchSurveyQuestions,
  createSurvey,
} from "@/features/survey/services/survey";
import {
  InputTypeEnum,
  QuestionTypeEnum,
  SurveyStatusEnum,
} from "@/features/survey/types/enums";
import { formatSurveyPayload } from "@/features/survey/utils/formatSurveyPayload";
import CustomForm from "../../components/CustomForm";
import {
  useSurveyStore,
  Questions,
} from "@/features/survey/store/useSurveyStore";

interface Step4Props {
  onPrev: () => void;
  onNext: () => void;
}

const questionsId = 1;

const baseCategories = [
  { key: "step1", label: "step1" },
  { key: "step2", label: "step2" },
  { key: "step3", label: "step3" },
];

const typeOptions = [
  { label: "객관식", value: InputTypeEnum.MULTIPLE },
  { label: "체크박스형", value: InputTypeEnum.CHECKBOX },
  { label: "서술형", value: InputTypeEnum.SUBJECTIVE },
];

export default function Step4Question({ onPrev, onNext }: Step4Props) {
  const [tabIndex, setTabIndex] = useState(0);
  const currentKey = baseCategories[tabIndex]?.key ?? "";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    step4: { questions, customQuestions },
    setStep4,
    addCustomQuestion,
    updateCustomQuestion,
    removeCustomQuestion,
    setSurveySubmitStatus,
    setCreatedSurveyId,
    resetSurvey,
  } = useSurveyStore();

  const currentQuestions = questions.filter((q) => q.category === currentKey);
  const currentCustomQuestions = customQuestions.filter(
    (q) => q.category === currentKey
  );

  // 기본 설문 불러옴
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchSurveyQuestions(questionsId);

        if (!response.success || !Array.isArray(response.data)) {
          throw new Error("응답 형식이 올바르지 않습니다.");
        }

        type QuestionMap = Record<string, Omit<Questions, "category">[]>;
        const surveyQuestions = response.data[0];

        let parsedQuestion: QuestionMap = {};
        try {
          parsedQuestion =
            typeof surveyQuestions.question === "string"
              ? JSON.parse(surveyQuestions.question)
              : surveyQuestions.question;
        } catch (e) {
          console.error("설문 질문 JSON 파싱 실패:", e);
        }

        const defaultQuestions: Questions[] = Object.entries(
          parsedQuestion
        ).flatMap(([category, items]) =>
          items.map((q) => ({ category, ...q }))
        );

        setStep4({
          questions: defaultQuestions,
          customQuestions: [], // 초기화하거나 유지할 값
        });
      } catch (error) {
        console.error("설문 질문 불러오기 실패", error);
      }
    };
    getData();
  }, [setStep4]);

  // 커스텀 질문 추가
  const handleAddCustom = () => {
    const newId = Date.now() + Math.random();

    addCustomQuestion({
      id: newId,
      category: currentKey,
      question_type: QuestionTypeEnum.CUSTOM,
      question_text: "",
      type: InputTypeEnum.MULTIPLE,
      options: ["", "", "", "", ""],
    });
  };

  const handleQuestionChange = (id: number, text: string) => {
    const question = customQuestions.find(
      (q) => q.id === id && q.category === currentKey
    );
    if (!question) return;

    updateCustomQuestion(id, { ...question, question_text: text });
  };

  // 질문 형식 변경
  const handleTypeChange = (id: number, newType: string) => {
    const question = customQuestions.find(
      (q) => q.id === id && q.category === currentKey
    );
    if (!question) return;

    const newQuestion = {
      ...structuredClone(question),
      type: newType as InputTypeEnum,
      question_text: "",
      options: newType === InputTypeEnum.SUBJECTIVE ? [] : ["", "", "", "", ""],
      max_num: newType === InputTypeEnum.CHECKBOX ? 1 : undefined,
    };

    updateCustomQuestion(id, newQuestion);
  };

  // 옵션 추가
  const handleAddOption = (qId: number) => {
    const question = customQuestions.find(
      (q) => q.id === qId && q.category === currentKey
    );
    if (!question || (question.options?.length ?? 0) >= 8) return;
    updateCustomQuestion(qId, {
      ...question,
      options: [...(question.options ?? []), ""],
    });
  };

  const handleOptionChange = (qId: number, optIndex: number, value: string) => {
    const question = customQuestions.find(
      (q) => q.id === qId && q.category === currentKey
    );
    if (!question) return;

    const updatedOptions = [...(question.options ?? [])];

    // 인덱스 맞춰서 길이 채우기
    while (updatedOptions.length <= optIndex) {
      updatedOptions.push("");
    }

    updatedOptions[optIndex] = value;

    updateCustomQuestion(qId, { ...question, options: updatedOptions });
  };

  const handlePrev = () => {
    if (tabIndex > 0) setTabIndex((prev) => prev - 1);
    else onPrev();
  };

  const handleNext = () => {
    if (tabIndex < baseCategories.length - 1) setTabIndex((prev) => prev + 1);
    else onNext();
  };

  // 설문 생성
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = formatSurveyPayload(SurveyStatusEnum.COMPLETE);
      const res = await createSurvey(payload);
      const surveyId = res.data.id;
      setCreatedSurveyId(surveyId);

      setSurveySubmitStatus("success");
      resetSurvey();
      onNext();
    } catch (err) {
      console.error("설문 생성 에러", err);
      setSurveySubmitStatus("error");
      setIsSubmitting(false);
      onNext();
    }
  };

  // 임시저장
  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const payload = formatSurveyPayload(SurveyStatusEnum.DRAFT);
      await createSurvey(payload);
      setSurveySubmitStatus("saved"); // 임시저장 성공 상태로 업데이트
      onNext();
    } catch (err) {
      console.error("임시저장 에러", err);
      setSurveySubmitStatus("save-error"); // 실패 상태로 업데이트
      setIsSubmitting(false);
      onNext();
    }
  };

  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[56px] flex justify-between items-center bg-white text-black border-b border-gray-200 px-4 z-30">
        <button onClick={onPrev} className="text-lg font-medium text-gray-700">
          ←
        </button>
        <h1 className="flex-1 text-center text-base sm:text-lg font-bold text-gray-900">
          설문 생성
        </h1>
      </header>

      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-10">
          Step 4 : 기본 설문
        </h2>

        <SurveyTabs
          tabs={baseCategories}
          current={tabIndex}
          setTab={setTabIndex}
        />

        {currentQuestions.map((q, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-3"
          >
            <QuestionText text={q.question_text} />
            {q.type === InputTypeEnum.SUBJECTIVE ? (
              <QuestionSubjective disabled={true} />
            ) : (
              <QuestionOptions
                options={q.options ?? []}
                layout="horizontal"
                disabled={true}
              />
            )}
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-4">
        <CustomForm
          questions={currentCustomQuestions}
          typeOptions={typeOptions}
          onAdd={handleAddCustom}
          onChangeText={handleQuestionChange}
          onChangeType={handleTypeChange}
          onChangeOption={handleOptionChange}
          onAddOption={handleAddOption}
          onRemove={(index) =>
            removeCustomQuestion(currentCustomQuestions[index].id)
          }
          onChangeMaxNum={(id, max) => {
            const q = customQuestions.find((q) => q.id === id);
            if (!q) return;
            updateCustomQuestion(id, { ...q, max_num: max });
          }}
          onRemoveOption={(qId, optIndex) => {
            const q = customQuestions.find((q) => q.id === qId);
            if (!q) return;
            const updated = {
              ...q,
              options: (q.options ?? []).filter((_, i) => i !== optIndex),
              // max_num도 같이 조정해야 안전
              max_num:
                q.max_num && q.max_num > (q.options?.length ?? 1) - 1
                  ? (q.options?.length ?? 1) - 1
                  : q.max_num,
            };
            updateCustomQuestion(qId, updated);
          }}
        />
      </div>

      {tabIndex < baseCategories.length - 1 ? (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[72px] bg-white border-t border-gray-200 z-30 flex items-center justify-between gap-3 px-4 py-3">
          <div className="w-[140px] sm:w-[200px]">
            <Button onClick={handlePrev} color="white">
              이전
            </Button>
          </div>
          <div className="w-[180px] sm:w-[400px]">
            <Button onClick={handleNext} color="black">
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
              <Button
                onClick={handleSave}
                color="white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "저장 중..." : "임시저장"}
              </Button>
            </div>
            <div className="w-[110px] sm:w-[300px]">
              <Button
                onClick={handleSubmit}
                color="black"
                disabled={isSubmitting}
              >
                {isSubmitting ? "생성 중..." : "설문 생성"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
