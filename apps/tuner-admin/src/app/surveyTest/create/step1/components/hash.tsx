import { useState } from "react";
import { useSurveyStore } from "@/store/surceyStore";
const HashTag = () => {
  const [hashtagInput, setHashtagInput] = useState("");
  const { step2, setStep2 } = useSurveyStore();
  const addHashtag = () => {
    if (
      step2.hashtags.length >= 4 ||
      !hashtagInput.trim() ||
      step2.hashtags.includes(hashtagInput)
    )
      return;
    setStep2({ hashtags: [...step2.hashtags, hashtagInput] });
    setHashtagInput("");
  };

  interface RemoveHashtagFn {
    (tag: string): void;
  }

  const removeHashtag: RemoveHashtagFn = (tag) => {
    setStep2({ hashtags: step2.hashtags.filter((t: string) => t !== tag) });
  };

  {
    /* 해시태그 입력 */
  }
  return (
    <div className="mb-8">
      <p className="font-semibold mb-2">해시태그 입력 (최대 4개)</p>
      <div className="flex gap-2 mb-2">
        <input
          value={hashtagInput}
          onChange={(e) => setHashtagInput(e.target.value)}
          className="border p-2 rounded"
          placeholder="#예시"
        />
        <button
          onClick={addHashtag}
          className="bg-blue-500 text-white px-4 rounded"
        >
          추가
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
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
  );
};
export default HashTag;
