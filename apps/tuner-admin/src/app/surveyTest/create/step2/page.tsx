// /survey/create/step2/page.tsx
"use client";
import { useState } from "react";
import { useSurveyStore } from "@/store/surceyStore";

const categories = [
  { key: "originality", label: "작품성" },
  { key: "popularity", label: "대중성" },
  { key: "sustainability", label: "지속성" },
  { key: "expandability", label: "확장성" },
  { key: "stardom", label: "스타성" },
] as const;

const options = ["특이했다", "평범했다", "인상깊었다"];

export default function SurveyStep2() {
  const { step2, setStep2 } = useSurveyStore();
  const [currentTab, setCurrentTab] =
    useState<(typeof categories)[number]["key"]>("originality");
  const [hashtagInput, setHashtagInput] = useState("");

  const handleAnswer = (value: string) => {
    setStep2({
      answers: {
        ...step2.answers,
        [currentTab]: value,
      },
    });
  };

  const addHashtag = () => {
    if (step2.hashtags.length >= 4) return;
    if (!hashtagInput.trim()) return;
    if (step2.hashtags.includes(hashtagInput)) return;

    setStep2({
      hashtags: [...step2.hashtags, hashtagInput],
    });
    setHashtagInput("");
  };

  const removeHashtag = (tag: string) => {
    setStep2({
      hashtags: step2.hashtags.filter((t) => t !== tag),
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">기본 평가 설문</h1>

      {/* 카테고리 탭 */}
      <div className="flex gap-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCurrentTab(cat.key)}
            className={`px-4 py-2 rounded border ${
              currentTab === cat.key ? "bg-blue-500 text-white" : "bg-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 선택지 */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          {categories.find((c) => c.key === currentTab)?.label}에 대한 평가
        </h2>
        <div className="flex gap-4">
          {options.map((opt) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="radio"
                name={currentTab}
                checked={step2.answers[currentTab] === opt}
                onChange={() => handleAnswer(opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* 해시태그 입력 */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <input
            value={hashtagInput}
            onChange={(e) => setHashtagInput(e.target.value)}
            className="border p-2 rounded"
            placeholder="#해시태그 입력"
          />
          <button
            onClick={addHashtag}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            추가
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {step2.hashtags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 px-3 py-1 rounded-full cursor-pointer"
              onClick={() => removeHashtag(tag)}
            >
              #{tag} ❌
            </span>
          ))}
        </div>
      </div>

      {/* 다음 버튼 */}
      <div className="mt-8">
        <button className="bg-black text-white px-6 py-2 rounded">
          다음으로 →
        </button>
      </div>
    </div>
  );
}
