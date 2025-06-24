"use client";
import { useState } from "react";
import TagSelectorParticipate from "./components/TagSelectorParticipate";
import templates from "@/app/template/components/Templates";

const surveyData = {
  youtubeInfo: {
    title: "감자는 무조건 이렇게 만들어보세요! ...",
    url: "https://www.youtube.com/watch?v=a9COV3d_lzc",
    thumbnail: "https://i.ytimg.com/vi/a9COV3d_lzc/mqdefault.jpg",
    channelTitle: "쿡언니네 cookunnyne",
  },
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
      options: ["1.", "2.", "3.", "4.", "5."],
    },
    {
      id: 3,
      text: "서술형",
      type: "subjective",
      options: [],
    },
  ],
};

const labelMap: Record<string, { label: string; description: string }> = {
  originality: {
    label: "작품성",
    description: "작품의 독창성과 완성도를 평가해주세요.",
  },
  popularity: {
    label: "대중성",
    description: "대중적인 매력을 느꼈는지 평가해주세요.",
  },
  sustainability: {
    label: "지속성",
    description: "지속적으로 관심을 끌 수 있을지 평가해주세요.",
  },
  expandability: {
    label: "확장성",
    description: "다른 콘텐츠로 확장될 수 있을지 평가해주세요.",
  },
  stardom: {
    label: "스타성",
    description: "화제성이나 주목도를 평가해주세요.",
  },
};

export default function SurveyParticipatePage() {
  const categories = Object.keys(labelMap);
  const [stepIndex, setStepIndex] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [templateAnswers, setTemplateAnswers] = useState<
    Record<string, string>
  >({});
  const [customAnswers, setCustomAnswers] = useState<
    Record<number, string | string[]>
  >({});
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleScoreSelect = (category: string, score: number) => {
    setScores((prev) => ({ ...prev, [category]: score }));
  };

  const handleTemplateAnswer = (category: string, answer: string) => {
    setTemplateAnswers((prev) => ({ ...prev, [category]: answer }));
  };

  const handleRadioAnswer = (questionId: number, option: string) => {
    setCustomAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

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

  const handleSubmit = () => {
    const result = {
      videoUrl: surveyData.youtubeInfo.url,
      tags: selectedTags,
      scores,
      templateAnswers,
      customAnswers,
      submittedAt: new Date().toISOString(),
    };
    console.log("제출할 데이터:", result);
    alert("설문이 제출되었습니다! 콘솔을 확인해주세요.");
  };

  const isLastStep = stepIndex === categories.length;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* 유튜브 정보 */}
      <h1 className="text-xl font-bold mb-1">{surveyData.youtubeInfo.title}</h1>
      <TagSelectorParticipate
        tags={[
          "emotional",
          "fancy",
          "sentimental",
          "dreamy",
          "trendy",
          "retro",
          "addictive",
          "calm",
          "dynamic",
          "original",
        ]}
        onChange={setSelectedTags}
      />
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

      {/* 탭 */}
      <div className="overflow-x-auto flex gap-2 pb-2 mb-4 border-b">
        {[...categories, "custom"].map((cat, i) => (
          <button
            key={cat}
            onClick={() => setStepIndex(i)}
            className={`flex-shrink-0 px-3 py-1 rounded-t-md border-b-2 text-sm sm:text-base whitespace-nowrap transition-all duration-200 ${
              stepIndex === i
                ? "border-pink-400 bg-pink-100"
                : "border-transparent text-gray-500"
            }`}
          >
            {cat === "custom" ? "커스텀 질문" : labelMap[cat].label}
          </button>
        ))}
      </div>

      {/* 본문 */}
      {!isLastStep ? (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">
            {labelMap[categories[stepIndex]].label} 점수를 선택해주세요
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {labelMap[categories[stepIndex]].description}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => handleScoreSelect(categories[stepIndex], num)}
                className={`px-4 py-2 rounded border text-sm ${
                  scores[categories[stepIndex]] === num
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {templates[categories[stepIndex]]?.map((template, i) => (
            <div key={i} className="mb-4">
              <p className="mb-2 font-medium">{template.question}</p>
              {template.options.map((opt) => (
                <label key={opt} className="block mb-1">
                  <input
                    type="radio"
                    name={`template-${categories[stepIndex]}`}
                    value={opt}
                    checked={templateAnswers[categories[stepIndex]] === opt}
                    onChange={() =>
                      handleTemplateAnswer(categories[stepIndex], opt)
                    }
                    className="mr-2"
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">추가 질문</h2>
          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
            {surveyData.customQuestions.map((q) => (
              <div key={q.id} className="border p-4 rounded">
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
                    onChange={(e) =>
                      handleSubjectiveAnswer(q.id, e.target.value)
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 버튼 */}
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
