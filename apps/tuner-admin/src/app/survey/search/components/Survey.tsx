"use client";

import { useState } from "react";
import Dropdown from "@/app/components/ui/DropDown";

const Survey = () => {
  const typeOptions = [
    { label: "객관식", value: "multiple" },
    { label: "체크박스형", value: "checkbox" },
    { label: "서술형", value: "subjective" },
  ] as const;

  type QuestionType = (typeof typeOptions)[number]["value"]; // ✅ 내부 상태 타입
  const [questions, setQuestions] = useState([
    {
      id: 1,
      type: "multiple",
      options: ["", "", "", ""],
      text: "",
    },
  ]);
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "multiple",
        options: ["", "", "", ""],
        text: "",
      },
    ]);
  };
  // 질문 추가 함수
  const addOption = (qIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };
  // 질문 삭제 함수
  const removeOption = (qIndex: number, optIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, options: q.options.filter((_, idx) => idx !== optIndex) }
          : q
      )
    );
  };
  // 질문 텍스트 변경 함수
  const handleOptionChange = (
    qIndex: number,
    optIndex: number,
    value: string
  ) => {
    setQuestions((prev) =>
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

  const handleTypeChange = (index: number, newType: string) => {
    setQuestions((prev) =>
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

  {
    /* 질문 영역 */
  }
  <div className="mt-6">
    {questions.map((q, index) => (
      <div key={q.id} className="mb-6 border p-4 rounded">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold">질문 {index + 1}</div>
          <Dropdown
            options={typeOptions.map((o) => o.label)}
            selected={
              typeOptions.find((o) => o.value === q.type)?.label ?? "유형 선택"
            }
            onSelect={(label: string) => {
              const found = typeOptions.find((o) => o.label === label);
              if (found) handleTypeChange(index, found.value);
            }}
          />
        </div>
        <input
          type="text"
          placeholder="질문을 입력해주세요"
          className="w-full mb-3 p-2 border rounded"
        />

        {/* 객관식/체크박스 옵션 */}
        {q.type === "multiple" || q.type === "checkbox" ? (
          <div className="space-y-2">
            {q.options.map((option, optIndex) => (
              <div key={optIndex} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`선택지 ${optIndex + 1}`}
                  className="w-full p-2 border rounded"
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(index, optIndex, e.target.value)
                  }
                />
                {q.type === "checkbox" && (
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() => removeOption(index, optIndex)}
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
            {q.type === "checkbox" && (
              <button
                type="button"
                onClick={() => addOption(index)}
                className="text-blue-500 mt-2"
              >
                + 선택지 추가
              </button>
            )}
          </div>
        ) : (
          <input
            type="text"
            placeholder="서술형 답변 예시"
            className="w-full p-2 border rounded"
          />
        )}
      </div>
    ))}

    <div className="flex justify-end mb-8">
      <button
        type="button"
        onClick={addQuestion}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        + 질문 추가하기
      </button>
    </div>
  </div>;
};
export default Survey;
/*
// ✅ SurveyStep2: 스타성에서 커스텀 탭 생성 + 자동 이동 + 기본 설문 포함
"use client";
import { useState } from "react";
import { useSurveyStore } from "@/store/surceyStore";
import { useRouter } from "next/navigation";
import Dropdown from "@/app/components/ui/DropDown";

export default function SurveyStep2() {
  const router = useRouter();
  const { step1, setStep2 } = useSurveyStore();
  const baseCategories = [
    { key: "originality", label: "작품성" },
    { key: "popularity", label: "대중성" },
    { key: "sustainability", label: "지속성" },
    { key: "expandability", label: "확장성" },
    { key: "stardom", label: "스타성" },
  ];

  const [customQuestions, setCustomQuestions] = useState([
    { id: 1, text: "", type: "multiple", options: ["", "", "", ""] },
  ]);
  const [tabIndex, setTabIndex] = useState(0);
  const [customTabCreated, setCustomTabCreated] = useState(false);

  const typeOptions = [
    { label: "객관식", value: "multiple" },
    { label: "체크박스형", value: "checkbox" },
    { label: "서술형", value: "subjective" },
  ] as const;
  type QuestionType = (typeof typeOptions)[number]["value"];

  const allTabs = [
    ...baseCategories,
    ...(customTabCreated ? [{ key: "custom", label: "커스텀" }] : []),
  ];
  const currentTab = allTabs[tabIndex];
  const isStardomTab = currentTab.key === "stardom";
  const isCustomTab = currentTab.key === "custom";

  const createCustomTab = () => {
    if (!customTabCreated) {
      setCustomQuestions([
        { id: 1, text: "", type: "multiple", options: ["", "", "", ""] },
      ]);
      setCustomTabCreated(true);
      setTabIndex(baseCategories.length);
    }
  };

  const addCustomQuestion = () => {
    const newId = customQuestions.length + 1;
    setCustomQuestions([
      ...customQuestions,
      { id: newId, text: "", type: "multiple", options: ["", "", "", ""] },
    ]);
  };

  const handleQuestionChange = (index: number, text: string) => {
    setCustomQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, text } : q))
    );
  };

  const handleOptionChange = (qIndex: number, optIndex: number, value: string) => {
    setCustomQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              options: q.options.map((opt, j) => (j === optIndex ? value : opt)),
            }
          : q
      )
    );
  };

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

  const handleComplete = () => {
    setStep2({ customQuestions });
    router.push("/surveyTest/create/complete");
  };

  const goNext = () => {
    if (tabIndex < allTabs.length - 1) setTabIndex(tabIndex + 1);
  };

  const goBack = () => {
    if (tabIndex > 0) setTabIndex(tabIndex - 1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="sticky top-0 bg-white z-10 pb-2 mb-4 flex justify-between items-center border-b">
        <div className="flex gap-4">
          {allTabs.map((cat, i) => (
            <button
              key={cat.key}
              onClick={() => setTabIndex(i)}
              className={`px-3 py-1 rounded-t-md border-b-2 ${
                tabIndex === i
                  ? "border-pink-400 bg-pink-100"
                  : "border-transparent"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-2">🎵 {step1.youtubeTitle}에 대한 설문</h1>

      {!isCustomTab ? (
        <div className="mb-10">
          <p className="font-semibold mb-2">
            {currentTab.label} 항목은 점수 입력만 가능합니다.
          </p>
          <div className="flex gap-2 mb-4">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className="px-3 py-1 border rounded bg-gray-200 text-gray-500 cursor-not-allowed"
                disabled
              >
                {num}
              </button>
            ))}
          </div>
          {isStardomTab && !customTabCreated && (
            <div className="text-right">
              <button
                onClick={createCustomTab}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                + 커스텀 설문 추가하기
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="mb-12">
            <p className="text-lg font-semibold mb-4">커스텀 설문</p>
            {customQuestions.map((q, qIndex) => (
              <div key={q.id} className="mb-6 border p-4 rounded">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold">질문 {qIndex + 1}</div>
                  <Dropdown
                    options={typeOptions.map((o) => o.label)}
                    selected={
                      typeOptions.find((o) => o.value === q.type)?.label ?? "유형 선택"
                    }
                    onSelect={(label: string) => {
                      const found = typeOptions.find((o) => o.label === label);
                      if (found) handleTypeChange(qIndex, found.value);
                    }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="질문을 입력해주세요"
                  className="w-full mb-3 p-2 border rounded"
                  value={q.text}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                />
                {(q.type === "multiple" || q.type === "checkbox") ? (
                  <div className="space-y-2">
                    {q.options.map((opt, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={`선택지 ${optIndex + 1}`}
                          className="w-full p-2 border rounded"
                          value={opt}
                          onChange={(e) => handleOptionChange(qIndex, optIndex, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="서술형 답변 예시"
                    className="w-full p-2 border rounded"
                  />
                )}
              </div>
            ))}
            <div className="text-right">
              <button
                onClick={addCustomQuestion}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                + 설문 추가하기
              </button>
            </div>
          </div>
        </>
      )}

      {(isStardomTab || isCustomTab) && (
        <div className="flex justify-center gap-4">
          <button className="bg-gray-400 text-white px-6 py-2 rounded">임시 저장</button>
          <button
            onClick={handleComplete}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            설문지 생성 완료
          </button>
        </div>
      )}

      <div className="flex justify-between mt-12">
        <button
          onClick={goBack}
          disabled={tabIndex === 0}
          className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
        >
          이전
        </button>
        <button
          onClick={goNext}
          disabled={tabIndex >= allTabs.length - 1}
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
}


*/
