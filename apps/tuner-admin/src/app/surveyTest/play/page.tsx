"use client";
import { useState } from "react";

// 🔄 설문지 데이터 (실제 서버 요청으로 대체 예정)
const surveyData = {
  youtubeInfo: {
    title:
      "감자는 무조건 이렇게 만들어보세요! 식구들이 맛있다고 하루에 한끼는 밥대신 먹어요!",
    url: "https://www.youtube.com/watch?v=a9COV3d_lzc",
    thumbnail: "https://i.ytimg.com/vi/a9COV3d_lzc/mqdefault.jpg",
    channelTitle: "쿡언니네 cookunnyne",
  },
  evaluationScores: {},
  customQuestions: [
    {
      id: 1,
      text: "객관식",
      type: "multiple",
      options: ["1.", "2.", "3.", "4."],
    },
    {
      id: 2,
      text: "체크박스",
      type: "checkbox",
      options: ["1.", "2.", "3.", "4.", "5.", "6.", "7.", "8."],
    },
    {
      id: 3,
      text: "서술형",
      type: "subjective",
      options: [],
    },
  ],
};

const labelMap: Record<string, string> = {
  originality: "작품성",
  popularity: "대중성",
  sustainability: "지속성",
  expandability: "확장성",
  stardom: "스타성",
};

export default function SurveyParticipatePage() {
  const categories = Object.keys(labelMap);
  const [stepIndex, setStepIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [customAnswers, setCustomAnswers] = useState<
    Record<number, string | string[]>
  >({});

  // 점수 선택
  const handleScoreSelect = (category: string, score: number) => {
    setScores((prev) => ({ ...prev, [category]: score }));
  };
  // 커스텀 질문 답변
  const handleRadioAnswer = (questionId: number, option: string) => {
    setCustomAnswers((prev) => ({ ...prev, [questionId]: option }));
  };
  // 체크박스 답변
  const handleCheckboxAnswer = (questionId: number, option: string) => {
    const current = Array.isArray(customAnswers[questionId])
      ? (customAnswers[questionId] as string[])
      : [];
    const updated = current.includes(option)
      ? current.filter((o: string) => o !== option)
      : [...current, option];
    setCustomAnswers((prev) => ({ ...prev, [questionId]: updated }));
  };
  const handleSubjectiveAnswer = (questionId: number, text: string) => {
    setCustomAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  // 제출
  const handleSubmit = () => {
    const result = {
      videoUrl: surveyData.youtubeInfo.url,
      scores,
      customAnswers,
    };
    console.log("제출할 데이터:", result);
    alert("설문이 제출되었습니다! 콘솔을 확인해주세요.");
  };

  const isLastStep = stepIndex === categories.length;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* 🎵 유튜브 정보 */}
      <h1 className="text-xl font-bold mb-1">
        🎵 {surveyData.youtubeInfo.title}
      </h1>
      <p className="text-sm text-gray-600 mb-2">
        {surveyData.youtubeInfo.channelTitle}
      </p>
      <iframe
        className="w-full h-64 rounded mb-4"
        src={`https://www.youtube.com/embed/${new URL(
          surveyData.youtubeInfo.url
        ).searchParams.get("v")}`}
        title={surveyData.youtubeInfo.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      {/* 🔖 탭 표시 */}
      <div className="overflow-x-auto flex gap-2 pb-2 mb-4 border-b">
        {[...categories, "custom"].map((cat, i) => (
          <button
            key={cat}
            onClick={() => setStepIndex(i)}
            className={`flex-shrink-0 px-3 py-1 rounded-t-md border-b-2 text-sm sm:text-base whitespace-nowrap transition-all duration-200
              ${
                stepIndex === i
                  ? "border-pink-400 bg-pink-100"
                  : "border-transparent text-gray-500"
              }`}
          >
            {cat === "custom" ? "커스텀 질문" : labelMap[cat]}
          </button>
        ))}
      </div>

      {/* 📋 설문 본문 */}
      {!isLastStep ? (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">
            {labelMap[categories[stepIndex]]} 점수를 선택해주세요
          </h2>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => handleScoreSelect(categories[stepIndex], num)}
                className={`px-4 py-2 rounded border text-sm
                  ${
                    scores[categories[stepIndex]] === num
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">추가 질문</h2>
          {surveyData.customQuestions.map((q) => (
            <div key={q.id} className="mb-6 border p-4 rounded">
              <p className="mb-2 font-medium">{q.text}</p>

              {q.type === "multiple" &&
                q.options.map((opt) => (
                  <label key={opt} className="block mb-1">
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={opt}
                      checked={customAnswers[q.id] === opt}
                      onChange={() => handleRadioAnswer(q.id, opt)}
                      className="mr-2"
                    />
                    {opt}
                  </label>
                ))}

              {q.type === "checkbox" &&
                q.options.map((opt) => (
                  <label key={opt} className="block mb-1">
                    <input
                      type="checkbox"
                      name={`question-${q.id}`}
                      value={opt}
                      checked={(customAnswers[q.id] || []).includes(opt)}
                      onChange={() => handleCheckboxAnswer(q.id, opt)}
                      className="mr-2"
                    />
                    {opt}
                  </label>
                ))}

              {q.type === "subjective" && (
                <textarea
                  className="w-full border rounded p-2"
                  rows={4}
                  placeholder="의견을 입력해주세요"
                  value={customAnswers[q.id] || ""}
                  onChange={(e) => handleSubjectiveAnswer(q.id, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ⏩ 버튼 */}
      <div className="flex justify-between">
        {stepIndex > 0 && (
          <button
            onClick={() => setStepIndex((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-300 text-black rounded"
          >
            이전
          </button>
        )}
        {!isLastStep ? (
          <button
            onClick={() => setStepIndex((prev) => prev + 1)}
            className="px-4 py-2 bg-black text-white rounded"
          >
            다음
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-green-600 text-white rounded"
          >
            설문 제출하기
          </button>
        )}
      </div>
    </div>
  );
}
