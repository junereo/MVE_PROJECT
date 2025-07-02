"use client";

import { useState, useEffect } from "react";
import { useSurveyStore } from "@/store/useSurveyCreateStore";
import { useRouter } from "next/navigation";
import SurveyTabs from "@/app/survey/create/step2/components/SurveyTabs";
import SurveyQuestionBase from "@/app/survey/create/step2/components/SurveyQuestionBase";
import SurveyCustomForm from "@/app/survey/create/step2/components/SurveyCustomForm";
import SurveyActions from "@/app/survey/create/step2/components/SurveyActions";
import SurveyNavigation from "@/app/survey/create/step2/components/SurveyNavigation";
// import TagCreate from "./components/SurveyTag";
import { fetchTemplates } from "@/lib/network/api";
import { QuestionTypeEnum } from "@/app/survey/create/complete/type";

//템플릿 타입
interface RawTemplateQuestion {
  question_text?: string;
  text?: string;
  question?: string;
  type?: string; // 백엔드 JSON 구조
  question_type?: string;
  options?: string[] | string;
}
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
  // 질문 타입 옵션 정의
  const typeOptions = [
    { label: "객관식", value: QuestionTypeEnum.MULTIPLE },
    { label: "체크박스형", value: QuestionTypeEnum.CHECKBOX },
    { label: "서술형", value: QuestionTypeEnum.SUBJECTIVE },
  ];

  const mapToQuestionTypeEnum = (question_type?: string): QuestionTypeEnum => {
    switch (question_type?.toLowerCase()) {
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
    question_type: QuestionTypeEnum;
    options: string[];
  };

  // 기본 설문 문항 상태
  const [categoryQuestions, setCategoryQuestions] = useState<
    Record<string, Question[]>
  >({});

  // 커스텀 문항 상태
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);

  // 템플릿 불러오기 (최초 렌더링 시 실행)
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const templateId = 1;
        const { data } = await fetchTemplates(templateId);
        const template = data.template;

        // 카테고리별 질문 변환 및 상태 저장
        const parsed: Record<string, Question[]> = {};
        baseCategories.forEach((cat) => {
          const list = template?.[cat.key] || [];
          parsed[cat.key] = list.map((q: RawTemplateQuestion, i: number) => ({
            id: i,
            question_text: q.text || q.question || "",
            question_type: mapToQuestionTypeEnum(q.question_type || q.type),
            options: q.options || [],
          }));
        });

        setCategoryQuestions(parsed);
        setTemplateSetKey(JSON.stringify(parsed));
        setStep2({ template_id: data.id });
      } catch (err) {
        console.error("템플릿 불러오기 실패:", err);
      }
    };

    loadTemplate();
  }, []);

  // 커스텀 탭 생성
  const createCustomTab = () => {
    if (!customTabCreated) {
      setCustomTabCreated(true);
      setTabIndex(baseCategories.length);
      addCustomQuestion();
    }
  };

  // 커스텀 질문 추가
  const addCustomQuestion = () => {
    const newId = customQuestions.length + 1;
    setCustomQuestions([
      ...customQuestions,
      {
        id: newId,
        question_text: "",
        question_type: QuestionTypeEnum.MULTIPLE,
        options: ["", "", "", ""],
      },
    ]);
  };

  // 질문 텍스트 변경 핸들러
  const handleQuestionChange = (index: number, question_text: string) => {
    setCustomQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, question_text } : q))
    );
  };

  // 선택지 변경 핸들러
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

  // 질문 타입 변경 핸들러
  const handleTypeChange = (index: number, newType: QuestionTypeEnum) => {
    console.log("질문 타입 변경:", index, newType);
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

  // 선택지 추가 핸들러
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

  // 설문 생성 완료 시 동작
  const handleComplete = () => {
    if (customTabCreated) {
      for (const q of customQuestions) {
        if (q.question_text.trim() === "") {
          alert("질문 내용을 모두 입력해주세요.");
          return;
        }

        if (
          (q.question_type === QuestionTypeEnum.MULTIPLE ||
            q.question_type === QuestionTypeEnum.CHECKBOX) &&
          q.options.some((opt) => opt.trim() === "")
        ) {
          alert("모든 선택지를 빠짐없이 입력해주세요.");
          return;
        }
      }
    }

    // 유효한 질문만 필터링
    const validCustomQuestions = customQuestions.filter(
      (q) =>
        q.question_text.trim() !== "" &&
        (q.question_type === QuestionTypeEnum.SUBJECTIVE ||
          q.options.every((opt) => opt.trim() !== ""))
    );

    setStep2({ customQuestions: validCustomQuestions });
    router.push("/survey/create/complete");
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

          {/* <TagCreate /> */}

          {/* 기본 설문 탭 */}
          {!isCustomTab ? (
            <>
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

              <SurveyQuestionBase
                label={currentTab.label}
                showCustomButton={isStardomTab && !customTabCreated}
                onCustomClick={createCustomTab}
              />
            </>
          ) : (
            // 커스텀 탭
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

          {/* 하단 이동 및 완료 버튼 */}
          <SurveyNavigation
            tabIndex={tabIndex}
            totalTabs={allTabs.length}
            onPrev={goBack}
            onNext={goNext}
          />

          {(isStardomTab || isCustomTab) && (
            <SurveyActions onTempSave={() => {}} onComplete={handleComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
