"use client";

import { useState, useEffect } from "react";
import { useSurveyStore } from "@/store/useSurveyCreateStore";
import { useRouter } from "next/navigation";
import SurveyTabs from "@/app/survey/create/step2/components/SurveyTabs";
import SurveyQuestionBase from "@/app/survey/create/step2/components/SurveyQuestionBase";
import SurveyCustomForm from "@/app/survey/create/step2/components/SurveyCustomForm";
import SurveyActions from "@/app/survey/create/step2/components/SurveyActions";
import SurveyNavigation from "@/app/survey/create/step2/components/SurveyNavigation";
import { fetchTemplates, surveyCreate } from "@/lib/network/api";
import { QuestionTypeEnum } from "@/app/survey/create/complete/type";
import { Question_type, SurveyStatus } from "@/types";

// 🔷 백엔드에서 받아오는 질문 타입 정의
interface RawTemplateQuestion {
  question_text: string;
  question_type: string;
  options: string[];
  category: string;
  type?: string;
}

// 🔷 프론트에서 사용하는 질문 타입 정의
interface Question {
  id: number;
  question_text: string;
  question_type: QuestionTypeEnum;
  options: string[];
  category?: string;
}

export default function SurveyStep2() {
  const router = useRouter();
  const { step1, step2, setStep2, setTemplateSetKey } = useSurveyStore();

  // 🔹 탭 카테고리 정의
  const baseCategories = [
    { key: "originality", label: "작품성" },
    { key: "popularity", label: "대중성" },
    { key: "sustainability", label: "지속성" },
    { key: "expandability", label: "확장성" },
    { key: "stardom", label: "스타성" },
  ];

  // 🔹 질문 타입 선택 옵션
  const typeOptions = [
    { label: "객관식", value: QuestionTypeEnum.MULTIPLE },
    { label: "체크박스형", value: QuestionTypeEnum.CHECKBOX },
    { label: "서술형", value: QuestionTypeEnum.SUBJECTIVE },
  ];

  const mapToQuestionTypeEnum = (type?: string): QuestionTypeEnum => {
    switch (type?.toLowerCase()) {
      case "multiple":
        return QuestionTypeEnum.MULTIPLE;
      case "checkbox":
        return QuestionTypeEnum.CHECKBOX;
      case "text":
      case "subjective":
        return QuestionTypeEnum.SUBJECTIVE;
      default:
        return QuestionTypeEnum.MULTIPLE;
    }
  };

  // 🔹 탭 인덱스 및 커스텀 여부
  const [tabIndex, setTabIndex] = useState(0);
  const [customTabCreated, setCustomTabCreated] = useState(false);
  const allTabs = [
    ...baseCategories,
    ...(customTabCreated ? [{ key: "custom", label: "커스텀" }] : []),
  ];
  const currentTab = allTabs[tabIndex];
  const isCustomTab = currentTab.key === "custom";
  const isStardomTab = currentTab.key === "stardom";

  // 🔹 상태 - 템플릿 기반 질문, 커스텀 질문
  const [categoryQuestions, setCategoryQuestions] = useState<
    Record<string, Question[]>
  >({});
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);

  // 🔹 템플릿 데이터 불러오기
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const templateId = 1;
        const { data } = await fetchTemplates(templateId);
        console.log("불러온 템플릿 데이터:", data);

        const template = data[0]?.question;

        const parsed: Record<string, Question[]> = {};

        for (const [category, questions] of Object.entries(template)) {
          parsed[category] = (questions as RawTemplateQuestion[]).map(
            (q: RawTemplateQuestion, i) => ({
              id: i,
              category,
              question_text: q.question_text,
              question_type: mapToQuestionTypeEnum(q.question_type || q.type),
              options: Array.isArray(q.options) ? q.options : [],
            })
          );
        }

        setCategoryQuestions(parsed);
        setTemplateSetKey(JSON.stringify(parsed));
        setStep2({ template_id: data[0].id });
      } catch (error) {
        console.error("템플릿 불러오기 실패:", error);
      }
    };

    loadTemplate();
  }, [setStep2, setTemplateSetKey]);

  const basePayload = {
    survey_title: step1.survey_title,
    title: step1.title,
    music_uri: step1.url,
    thumbnail_uri: step1.youtubeThumbnail,
    artist: step1.artist,
    release_date: step1.releaseDate,
    thumbnail_url: step1.youtubeThumbnail,
    music_title: step1.title,
    genre: step1.genre,
    start_at: step1.start_at,
    end_at: step1.end_at,
    type: step1.surveyType,
    reward_amount: step1.reward_amount ?? 0,
    reward: step1.reward ?? 0,
    expert_reward: step1.expertReward ?? 0,
    questions: step2.template_id!,
    question_type: "fixed" as Question_type,
    is_released: step1.isReleased,
  };
  const handleTempSave = async () => {
    const draftPayload = {
      ...basePayload,
      status: SurveyStatus.draft,
    };

    try {
      console.log("임시 저장 데이터:", draftPayload);
      const res = await surveyCreate(draftPayload);
      console.log("서버 응답:", res);
      alert("임시 저장 완료!");
    } catch (error) {
      console.error("임시 저장 오류:", error);
      alert("임시 저장 실패");
    }
  };

  // 🔹 커스텀 탭 생성
  const createCustomTab = () => {
    if (!customTabCreated) {
      setCustomTabCreated(true);
      setTabIndex(baseCategories.length);
      addCustomQuestion();
    }
  };

  // 🔹 커스텀 질문 추가
  const addCustomQuestion = () => {
    setCustomQuestions((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        question_text: "",
        question_type: QuestionTypeEnum.MULTIPLE,
        options: ["", "", "", ""],
      },
    ]);
  };

  // 🔹 커스텀 질문 핸들러들
  const handleQuestionChange = (index: number, text: string) => {
    setCustomQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, question_text: text } : q))
    );
  };

  const handleOptionChange = (
    qIndex: number,
    optIndex: number,
    value: string
  ) => {
    setCustomQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((opt, j) =>
                j === optIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const handleTypeChange = (index: number, newType: QuestionTypeEnum) => {
    setCustomQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              question_type: newType,
              options:
                newType === QuestionTypeEnum.SUBJECTIVE
                  ? []
                  : q.options.length
                  ? q.options
                  : ["", "", "", ""],
            }
          : q
      )
    );
  };

  const handleAddOption = (qIndex: number) => {
    setCustomQuestions((prev) =>
      prev.map((q, i) => {
        if (i === qIndex) {
          if (q.options.length >= 8) {
            alert("선택지는 최대 8개까지 추가할 수 있습니다.");
            return q;
          }
          return { ...q, options: [...q.options, ""] };
        }
        return q;
      })
    );
  };

  // 🔹 설문 완료 시 상태 저장
  const handleComplete = () => {
    const validCustom = customQuestions.filter(
      (q) =>
        q.question_text.trim() !== "" &&
        (q.question_type === QuestionTypeEnum.SUBJECTIVE ||
          q.options.every((opt) => opt.trim() !== ""))
    );

    setStep2({ customQuestions: validCustom });
    router.push("/survey/create/complete");
  };

  return (
    <div>
      <div className="w-full text-black font-bold text-2xl py-3">
        Survey create Step2
      </div>
      <div className="p-6">
        <div className="w-[50%] min-h-[800px] pb-[20px] rounded-xl max-w-[485px] md:max-w-3xl bg-white px-4 sm:px-6 md:px-8">
          <SurveyTabs tabs={allTabs} current={tabIndex} setTab={setTabIndex} />

          <h1 className="text-lg md:text-2xl font-bold mb-4 pt-[30px]">
            🎵 {step1.title || step1.youtubeTitle || "제목 없음"}
          </h1>

          {/* 🔹 기본 템플릿 탭 */}
          {!isCustomTab ? (
            <>
              {(categoryQuestions[currentTab.key] || []).map((q) => (
                <div key={q.id} className="mb-6 border p-4 rounded">
                  <p className="font-medium mb-1">{q.question_text}</p>
                  {q.options.map((opt, i) => (
                    <div key={i} className="text-sm text-gray-600">
                      ⦿ {opt}
                    </div>
                  ))}
                </div>
              ))}

              <SurveyQuestionBase
                label={currentTab.label}
                showCustomButton={isStardomTab && !customTabCreated}
                onCustomClick={createCustomTab}
              />
            </>
          ) : (
            // 🔹 커스텀 탭
            <SurveyCustomForm
              typeOptions={typeOptions}
              questions={customQuestions}
              onAdd={addCustomQuestion}
              onChangeText={handleQuestionChange}
              onChangeType={handleTypeChange}
              onChangeOption={handleOptionChange}
              onAddOption={handleAddOption}
            />
          )}

          {/* 🔹 네비게이션 버튼 */}
          <SurveyNavigation
            tabIndex={tabIndex}
            totalTabs={allTabs.length}
            onPrev={() => setTabIndex((prev) => Math.max(0, prev - 1))}
            onNext={() =>
              setTabIndex((prev) => Math.min(allTabs.length - 1, prev + 1))
            }
          />

          {/* 🔹 완료 버튼 */}
          {(isStardomTab || isCustomTab) && (
            <SurveyActions
              onTempSave={handleTempSave}
              onComplete={handleComplete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
