"use client";
import { useState, useEffect } from "react";
import { useSurveyStore } from "@/store/useSurveyCreateStore";
import { useRouter } from "next/navigation";
import SurveyTabs from "@/app/survey/create/step2/components/SurveyTabs";
import SurveyQuestionBase from "@/app/survey/create/step2/components/SurveyQuestionBase";
import SurveyCustomForm from "@/app/survey/create/step2/components/SurveyCustomForm";
import SurveyActions from "@/app/survey/create/step2/components/SurveyActions";
import SurveyNavigation from "@/app/survey/create/step2/components/SurveyNavigation";
import templates from "@/app/template/components/Templates";
import TagCreate from "./components/SurveyTag";

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

  // 기본 탭 + 커스텀 탭 구성
  const allTabs = [
    ...baseCategories,
    ...(customTabCreated ? [{ key: "custom", label: "커스텀" }] : []),
  ];
  const currentTab = allTabs[tabIndex];
  const isStardomTab = currentTab.key === "stardom";
  const isCustomTab = currentTab.key === "custom";

  // 설문 항목 상태 (기본 질문 및 커스텀 질문)
  type Question = {
    id: number; // 질문 ID
    text: string;
    type: string;
    options: string[];
  };
  const [categoryQuestions, setCategoryQuestions] = useState<
    Record<string, Question[]>
  >({});
  const [customQuestions, setCustomQuestions] = useState([
    { id: 1, text: "", type: "multiple", options: ["", "", "", ""] },
  ]);

  // 질문 타입 옵션 정의
  const typeOptions = [
    { label: "객관식", value: "multiple" },
    { label: "체크박스형", value: "checkbox" },
    { label: "서술형", value: "subjective" },
  ] as const;
  type QuestionType = (typeof typeOptions)[number]["value"];

  // 최초 렌더링 시 템플릿 불러와서 상태에 주입
  useEffect(() => {
    const initialQuestions: Record<string, Question[]> = {};
    for (const cat of baseCategories) {
      const list = templates[cat.key] || [];
      initialQuestions[cat.key] = list.map((q, i) => ({
        id: i, // id가 없으면 랜덤으로 생성
        text: q.question,
        type: "multiple",
        options: q.options,
      }));
    }
    setCategoryQuestions(initialQuestions);
    // JSON 형태로 템플릿 키 저장
    setTemplateSetKey(JSON.stringify(initialQuestions));
  }, []);

  //커스텀 탭 생성 (스타성 탭에서 버튼 누르면 활성화)
  const createCustomTab = () => {
    if (!customTabCreated) {
      setCustomTabCreated(true);
      setTabIndex(baseCategories.length);
    }
  };

  //커스텀 질문 추가
  const addCustomQuestion = () => {
    const newId = customQuestions.length + 1;
    setCustomQuestions([
      ...customQuestions,
      { id: newId, text: "", type: "multiple", options: ["", "", "", ""] },
    ]);
  };

  //커스텀 질문 텍스트 수정
  const handleQuestionChange = (index: number, text: string) => {
    setCustomQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, text } : q))
    );
  };

  //커스텀 질문 옵션 수정
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

  //커스텀 질문 타입 변경 (객관식/서술형/체크박스)
  const handleTypeChange = (index: number, newType: string) => {
    setCustomQuestions((prev) =>
      prev.map((q, i) =>
        i === index
          ? {
              ...q,
              type: newType as QuestionType,
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

  //객관식 옵션 추가 (최대 8개)
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

  //설문 완료 → Zustand 상태 저장 + 완료 페이지로 이동
  const handleComplete = () => {
    setStep2({ customQuestions });
    router.push("/survey/create/complete");
  };

  const goNext = () => {
    if (tabIndex < allTabs.length - 1) setTabIndex(tabIndex + 1);
  };
  const goBack = () => {
    if (tabIndex > 0) setTabIndex(tabIndex - 1);
  };

  return (
    <div>
      <div className="w-full  text-black font-bold text-2xl py-3 ">
        Survey create Step2
      </div>
      <div className="p-6 ">
        <div className=" w-[50%] min-h-[800px] pb-[20px] rounded-xl max-w-[485px] md:max-w-3xl bg-white px-4 sm:px-6 md:px-8">
          {/* 상단 탭 영역 */}
          <SurveyTabs tabs={allTabs} current={tabIndex} setTab={setTabIndex} />

          {/* 음원 타이틀 */}
          <h1 className="text-lg md:text-2xl font-bold mb-4 pt-[30px]">
            🎵 {step1.title?.trim() || step1.youtubeTitle || "제목 없음"}에 대한
            설문
          </h1>

          {/* 해시태그 입력 */}
          <TagCreate />
          {/* 기본 카테고리 */}
          {!isCustomTab ? (
            <>
              {/* 기본 질문 출력 */}
              {(categoryQuestions[currentTab.key] || []).map((q) => (
                <div key={q.id} className="mb-6 border p-4 rounded">
                  <p className="font-medium mb-1">{q.text}</p>
                  {q.options.map((opt: string, i: number) => (
                    <div key={i} className="text-sm text-gray-600">
                      ⦿ {opt}
                    </div>
                  ))}
                </div>
              ))}
              {/* 점수 영역 + 커스텀 버튼 */}
              <SurveyQuestionBase
                label={currentTab.label}
                showCustomButton={isStardomTab && !customTabCreated}
                onCustomClick={createCustomTab}
              />
            </>
          ) : (
            // 커스텀 탭 영역
            <SurveyCustomForm
              questions={customQuestions}
              typeOptions={[...typeOptions]}
              onAdd={addCustomQuestion}
              onChangeText={handleQuestionChange}
              onChangeType={handleTypeChange}
              onChangeOption={handleOptionChange}
              onAddOption={handleAddOption}
            />
          )}

          {/* 하단 이동 네비게이션 */}
          <SurveyNavigation
            tabIndex={tabIndex}
            totalTabs={allTabs.length}
            onPrev={goBack}
            onNext={goNext}
          />
          {/* 완료 버튼 영역 */}
          {(isStardomTab || isCustomTab) && (
            <SurveyActions onTempSave={() => {}} onComplete={handleComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
