// ✅ SurveyStep2.tsx - 반응형 + 컴포넌트 분리 완성본 (with 주석)
"use client";
import { useState } from "react";
import { useSurveyStore } from "@/store/surceyStore";
import { useRouter } from "next/navigation";
import SurveyTabs from "@/app/surveyTest/create/step2/components/SurveyTabs";
import SurveyQuestionBase from "@/app/surveyTest/create/step2/components/SurveyQuestionBase";
import SurveyCustomForm from "@/app/surveyTest/create/step2/components/SurveyCustomForm";
import SurveyActions from "@/app/surveyTest/create/step2/components/SurveyActions";
import SurveyNavigation from "@/app/surveyTest/create/step2/components/SurveyNavigation";

export default function SurveyStep2() {
  const router = useRouter();
  const { step1, setStep2 } = useSurveyStore();

  // 기본 카테고리 탭
  const baseCategories = [
    { key: "originality", label: "작품성" },
    { key: "popularity", label: "대중성" },
    { key: "sustainability", label: "지속성" },
    { key: "expandability", label: "확장성" },
    { key: "stardom", label: "스타성" },
  ];

  // 상태 정의
  const [customQuestions, setCustomQuestions] = useState([
    { id: 1, text: "", type: "multiple", options: ["", "", "", ""] },
  ]);
  const [tabIndex, setTabIndex] = useState(0);
  const [customTabCreated, setCustomTabCreated] = useState(false);

  // 질문 유형 옵션
  const typeOptions = [
    { label: "객관식", value: "multiple" },
    { label: "체크박스형", value: "checkbox" },
    { label: "서술형", value: "subjective" },
  ] as const;
  type QuestionType = (typeof typeOptions)[number]["value"];

  // 전체 탭 (기본 + 커스텀)
  const allTabs = [
    ...baseCategories,
    ...(customTabCreated ? [{ key: "custom", label: "커스텀" }] : []),
  ];

  const currentTab = allTabs[tabIndex];
  const isStardomTab = currentTab.key === "stardom";
  const isCustomTab = currentTab.key === "custom";

  // 커스텀 탭 생성
  const createCustomTab = () => {
    if (!customTabCreated) {
      setCustomQuestions([
        { id: 1, text: "", type: "multiple", options: ["", "", "", ""] },
      ]);
      setCustomTabCreated(true);
      setTabIndex(baseCategories.length); // 커스텀 탭으로 자동 이동
    }
  };

  // 커스텀 질문 추가
  const addCustomQuestion = () => {
    const newId = customQuestions.length + 1;
    setCustomQuestions([
      ...customQuestions,
      { id: newId, text: "", type: "multiple", options: ["", "", "", ""] },
    ]);
  };

  // 질문 텍스트 수정
  const handleQuestionChange = (index: number, text: string) => {
    setCustomQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, text } : q))
    );
  };

  // 객관식 옵션 텍스트 수정
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
  // 체크박스 옵션 증가
  // const handleAddOption = (qIndex: number) => {
  //   setCustomQuestions((prev) =>
  //     prev.map((q, i) => {
  //       if (i === qIndex && q.options.length < 8) {
  //         return { ...q, options: [...q.options, ""] };
  //       }
  //       return q;
  //     })
  //   );
  // };

  // 질문 유형 수정
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

  // 설문 완료 처리
  const handleComplete = () => {
    setStep2({ customQuestions });
    router.push("/surveyTest/create/complete");
  };

  // 다음 탭 이동
  const goNext = () => {
    if (tabIndex < allTabs.length - 1) setTabIndex(tabIndex + 1);
  };

  // 이전 탭 이동
  const goBack = () => {
    if (tabIndex > 0) setTabIndex(tabIndex - 1);
  };

  return (
    <div className="w-full max-w-[485px] md:max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
      {/* 탭 영역 */}
      <SurveyTabs tabs={allTabs} current={tabIndex} setTab={setTabIndex} />

      {/* 유튜브 타이틀 */}
      <h1 className="text-lg md:text-2xl font-bold mb-4">
        🎵 {step1.youtubeTitle}에 대한 설문
      </h1>

      {/* 탭 콘텐츠 렌더링 */}
      {!isCustomTab ? (
        <SurveyQuestionBase
          label={currentTab.label}
          showCustomButton={isStardomTab && !customTabCreated}
          onCustomClick={createCustomTab}
        />
      ) : (
        <SurveyCustomForm
          questions={customQuestions}
          typeOptions={typeOptions as any}
          onAdd={addCustomQuestion}
          onChangeText={handleQuestionChange}
          onChangeType={handleTypeChange}
          onChangeOption={handleOptionChange}
          //onAddOption={handleAddOption}
        />
      )}

      {/* 커스텀/스타성 탭일 경우에만 버튼 보임 */}
      {(isStardomTab || isCustomTab) && (
        <SurveyActions onTempSave={() => {}} onComplete={handleComplete} />
      )}

      {/* 하단 이전/다음 내비게이션 */}
      <SurveyNavigation
        tabIndex={tabIndex}
        totalTabs={allTabs.length}
        onPrev={goBack}
        onNext={goNext}
      />
    </div>
  );
}
