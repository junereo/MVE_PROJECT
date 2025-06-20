// ✅ SurveyStep2: 스타성에서 커스텀 탭 생성 + 자동 이동 + 기본 설문 포함
"use client";
import { useState } from "react";
import { useSurveyStore } from "@/store/surceyStore";
import { useRouter } from "next/navigation";

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

  const [customQuestions, setCustomQuestions] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);

  const [customTabCreated, setCustomTabCreated] = useState(false);

  const allTabs = [
    ...baseCategories,
    ...(customTabCreated ? [{ key: "custom", label: "커스텀" }] : []),
  ];
  const currentTab = allTabs[tabIndex];
  const isStardomTab = currentTab.key === "stardom";
  const isCustomTab = currentTab.key === "custom";

  const createCustomTab = () => {
    if (!customTabCreated) {
      setCustomQuestions([{ id: 1, text: "", options: ["", "", "", ""] }]);
      setCustomTabCreated(true);
      setTabIndex(baseCategories.length); // 커스텀으로 자동 이동
    }
  };

  const addCustomQuestion = () => {
    const newId = customQuestions.length + 1;
    setCustomQuestions([
      ...customQuestions,
      { id: newId, text: "", options: ["", "", "", ""] },
    ]);
  };

  const handleQuestionChange = (index, text) => {
    const updated = [...customQuestions];
    updated[index].text = text;
    setCustomQuestions(updated);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...customQuestions];
    updated[qIndex].options[optIndex] = value;
    setCustomQuestions(updated);
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
      {/* 탭 라벨 영역 */}
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

      <h1 className="text-2xl font-bold mb-2">
        🎵 {step1.youtubeTitle}에 대한 설문
      </h1>

      {/* 기본 평가 영역 */}
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

          {/* 스타성 탭에서만 버튼 노출 */}
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
          {/* 커스텀 질문 전체 누적형 */}
          <div className="mb-12">
            <p className="text-lg font-semibold mb-4">커스텀 객관식 설문</p>
            {customQuestions.map((q, qIndex) => (
              <div key={q.id} className="mb-6 border p-4 rounded">
                <input
                  type="text"
                  placeholder="질문을 입력해주세요"
                  className="w-full mb-3 p-2 border rounded"
                  value={q.text}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                />
                {q.options.map((opt, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    placeholder={`선택지 ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(qIndex, optIndex, e.target.value)
                    }
                    className="w-full mb-2 p-2 border rounded"
                  />
                ))}
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

      {/* 해시태그, 완료버튼, 임시저장 → 스타성 또는 커스텀 탭 */}
      {isStardomTab || isCustomTab ? (
        <>
          {/* 버튼들 */}
          <div className="flex justify-center gap-4">
            <button className="bg-gray-400 text-white px-6 py-2 rounded">
              임시 저장
            </button>
            <button
              onClick={handleComplete}
              className="bg-green-600 text-white px-6 py-2 rounded"
            >
              설문지 생성 완료
            </button>
          </div>
        </>
      ) : null}

      {/* 이전/다음 버튼 */}
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
