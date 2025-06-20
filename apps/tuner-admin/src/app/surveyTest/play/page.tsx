"use client";
import { useState } from "react";

// 예시용 미리보기 데이터 (추후 fetch로 대체)

//max-w 485px
const mockSurveyData = {
  youtubeTitle: "예시 곡 제목",
  youtubeVideoId: "abcd1234",
  channelTitle: "뮤직채널",
  customQuestions: [
    {
      id: 1,
      text: "이 곡의 분위기는 어떤가요?",
      options: ["차분함", "신남", "몽환적", "기타"],
    },
  ],
  categories: [
    "originality",
    "popularity",
    "sustainability",
    "expandability",
    "stardom",
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
  const [scores, setScores] = useState<Record<string, number>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<number, string>>(
    {}
  );

  const handleScoreSelect = (category: string, score: number) => {
    setScores((prev) => ({ ...prev, [category]: score }));
  };

  const handleCustomAnswer = (questionId: number, answer: string) => {
    setCustomAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    const result = {
      videoId: mockSurveyData.youtubeVideoId,
      scores,
      customAnswers,
    };

    console.log("제출할 데이터:", result);
    alert("설문이 제출되었습니다! (콘솔 확인)");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 🎵 영상 */}
      <h1 className="text-xl font-bold mb-2">
        🎵 {mockSurveyData.youtubeTitle}
      </h1>
      <iframe
        className="w-full h-64 rounded mb-4"
        src={`https://www.youtube.com/embed/${mockSurveyData.youtubeVideoId}`}
        title={mockSurveyData.youtubeTitle}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      {/* 📊 기본 항목 점수 */}
      <h2 className="text-lg font-semibold mb-4">기본 평가 항목</h2>
      {mockSurveyData.categories.map((cat) => (
        <div key={cat} className="mb-6">
          <p className="mb-2">{labelMap[cat]}에 대한 평가</p>
          <div className="flex gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`px-3 py-1 border rounded ${
                  scores[cat] === num ? "bg-blue-600 text-white" : "bg-white"
                }`}
                onClick={() => handleScoreSelect(cat, num)}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* 📋 커스텀 질문 */}
      <h2 className="text-lg font-semibold mb-4">추가 질문</h2>
      {mockSurveyData.customQuestions.map((q) => (
        <div key={q.id} className="mb-6 border p-4 rounded">
          <p className="mb-2 font-medium">{q.text}</p>
          {q.options.map((opt) => (
            <label key={opt} className="block mb-1">
              <input
                type="radio"
                name={`question-${q.id}`}
                value={opt}
                checked={customAnswers[q.id] === opt}
                onChange={() => handleCustomAnswer(q.id, opt)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      {/* ✅ 제출 */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded text-lg"
        >
          설문 제출하기
        </button>
      </div>
    </div>
  );
}
