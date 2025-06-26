"use client";

import { useState, useEffect } from "react";
import { useSurveyStore } from "@/store/useSurveyCreateStore";
import { useRouter } from "next/navigation";
import SurveyTabs from "@/app/survey/create/step2/components/SurveyTabs";
import SurveyQuestionBase from "@/app/survey/create/step2/components/SurveyQuestionBase";
import SurveyCustomForm from "@/app/survey/create/step2/components/SurveyCustomForm";
import SurveyActions from "@/app/survey/create/step2/components/SurveyActions";
import SurveyNavigation from "@/app/survey/create/step2/components/SurveyNavigation";
import TagCreate from "./components/SurveyTag";
import { fetchTemplates } from "@/lib/network/api";

export default function SurveyStep2() {
  const router = useRouter();
  const { step1, setStep2, setTemplateSetKey } = useSurveyStore();

  // 기본 설문 카테고리 정의
  const baseCategories = [
    { key: "originality", label: "작품성" },
    { key: "popularity", label: "대중성" },
    { key: "sustainability", label: "지속성" },
    { key: "expandability", label: "확장성" },
    { key: "stardom", label: "스타성" },
  ];

  // 탭 인덱스 및 커스텀 탭 상태
  const [tabIndex, setTabIndex] = useState(0);
  const [customTabCreated, setCustomTabCreated] = useState(false);

  // 전체 탭 구성 (기본 + 커스텀)
  const allTabs = [
    ...baseCategories,
    ...(customTabCreated ? [{ key: "custom", label: "커스텀" }] : []),
  ];
  const currentTab = allTabs[tabIndex];
  const isStardomTab = currentTab.key === "stardom";
  const isCustomTab = currentTab.key === "custom";

  // 질문 타입 정의
  type Question = {
    id: number;
    question_text: string;
    question_type: string;
    options: string[];
  };

  // 기본 설문 문항 상태
  const [categoryQuestions, setCategoryQuestions] = useState<
    Record<string, Question[]>
  >({});

  // 커스텀 문항 상태
  const [customQuestions, setCustomQuestions] = useState([
    {
      id: 1,
      question_text: "",
      question_type: "multiple",
      options: ["", "", "", ""],
    },
  ]);

  // 질문 유형 옵션 정의
  const typeOptions = [
    { label: "객관식", value: "multiple" },
    { label: "체크박스형", value: "checkbox" },
    { label: "서술형", value: "subjective" },
  ];
  type QuestionType = (typeof typeOptions)[number]["value"];

  // 템플릿 불러오기 (최초 렌더링 시 실행)
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const data = await fetchTemplates();
        const template = data.template;

        // 카테고리별 질문 변환 및 상태 저장
        const parsed: Record<string, Question[]> = {};
        baseCategories.forEach((cat) => {
          const list = template?.[cat.key] || [];
          parsed[cat.key] = list.map((q: any, i: number) => ({
            id: i,
            text: q.text || q.question,
            type: q.type || "multiple",
            options: q.options || [],
          }));
        });

        setCategoryQuestions(parsed);
        setTemplateSetKey(JSON.stringify(parsed));
      } catch (err) {
        console.error("템플릿 불러오기 실패:", err);
      }
    };

    loadTemplate();
  }, []);

  // 커스텀 탭 생성 (스타성 탭에서 생성 버튼 클릭 시)
  const createCustomTab = () => {
    if (!customTabCreated) {
      setCustomTabCreated(true);
      setTabIndex(baseCategories.length);
    }
  };

  // 커스텀 문항 추가
  const addCustomQuestion = () => {
    const newId = customQuestions.length + 1;
    setCustomQuestions([
      ...customQuestions,
      {
        id: newId,
        question_text: "",
        question_type: "multiple",
        options: ["", "", "", ""],
      },
    ]);
  };

  // 커스텀 질문 텍스트 변경
  const handleQuestionChange = (index: number, question_text: string) => {
    setCustomQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, question_text } : q))
    );
  };

  // 커스텀 질문 옵션 변경
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

  // 커스텀 질문 타입 변경
  const handleTypeChange = (index: number, newType: string) => {
    setCustomQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              question_type: newType as QuestionType,
              options:
                newType === "subjective"
                  ? []
                  : q.options.length
                  ? q.options
                  : ["", "", "", ""],
            }
          : q
      )
    );
  };

  // 객관식 선택지 추가 (최대 8개)
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

  // 설문 완료 → Zustand에 저장 후 다음 페이지로 이동
  const handleComplete = () => {
    setStep2({ customQuestions });
    router.push("/survey/create/complete");
  };

  // 탭 다음/이전 이동
  const goNext = () => {
    if (tabIndex < allTabs.length - 1) setTabIndex(tabIndex + 1);
  };
  const goBack = () => {
    if (tabIndex > 0) setTabIndex(tabIndex - 1);
  };

  return (
    <div>
      <div className="w-full text-black font-bold text-2xl py-3">
        Survey create Step2
      </div>
      <div className="p-6">
        <div className="w-[50%] min-h-[800px] pb-[20px] rounded-xl max-w-[485px] md:max-w-3xl bg-white px-4 sm:px-6 md:px-8">
          {/* 탭 컴포넌트 */}
          <SurveyTabs tabs={allTabs} current={tabIndex} setTab={setTabIndex} />

          {/* 음원 제목 */}
          <h1 className="text-lg md:text-2xl font-bold mb-4 pt-[30px]">
            🎵 {step1.title || step1.youtubeTitle || "제목 없음"}
          </h1>

          {/* 해시태그 선택 */}
          <TagCreate />

          {/* 기본 카테고리 탭 또는 커스텀 탭 */}
          {!isCustomTab ? (
            <>
              {/* 기본 질문 리스트 */}
              {(categoryQuestions[currentTab.key] || []).map((q) => (
                <div key={q.id} className="mb-6 border p-4 rounded">
                  <p className="font-medium mb-1">{q.question_text}</p>
                  {q.options.map((opt: string, i: number) => (
                    <div key={i} className="text-sm text-gray-600">
                      ⦿ {opt}
                    </div>
                  ))}
                </div>
              ))}

              {/* 점수입력 + 커스텀 탭 생성 버튼 */}
              <SurveyQuestionBase
                label={currentTab.label}
                showCustomButton={isStardomTab && !customTabCreated}
                onCustomClick={createCustomTab}
              />
            </>
          ) : (
            // 커스텀 질문 입력 UI
            <SurveyCustomForm
              questions={customQuestions}
              typeOptions={typeOptions}
              onAdd={addCustomQuestion}
              onChangeText={handleQuestionChange}
              onChangeType={handleTypeChange}
              onChangeOption={handleOptionChange}
              onAddOption={handleAddOption}
            />
          )}

          {/* 네비게이션 (이전/다음 탭 이동) */}
          <SurveyNavigation
            tabIndex={tabIndex}
            totalTabs={allTabs.length}
            onPrev={goBack}
            onNext={goNext}
          />

          {/* 마지막 탭일 때만 완료/임시저장 버튼 표시 */}
          {(isStardomTab || isCustomTab) && (
            <SurveyActions onTempSave={() => {}} onComplete={handleComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
