"use client";
import { useSurveyStore } from "@/store/useSurveyCreateStore";

// key: 영어, value: 한글
export const predefinedTags: { [key: string]: string } = {
  emotional: "감각적인",
  fancy: "화려한",
  sentimental: "감성적인",
  dreamy: "몽환적인",
  trendy: "트렌디한",
  retro: "복고풍",
  addictive: "중독성 있는",
  calm: "잔잔한",
  dynamic: "역동적인",
  original: "독창적인",
};

interface TagSelectorParticipateProps {
  tags: string[]; // 영어 key 배열로 수정
}

const TagSelectorParticipate = ({ tags }: TagSelectorParticipateProps) => {
  const { step2, setStep2 } = useSurveyStore();

  const toggleTag = (tagKey: string) => {
    const isSelected = step2.selectedTags.includes(tagKey);

    // 이미 선택된 태그라면 제거, 아니면 추가
    if (isSelected) {
      setStep2({
        selectedTags: step2.selectedTags.filter((t) => t !== tagKey),
      });
    } else {
      if (step2.selectedTags.length >= 10) return; // 최대 4개 제한
      setStep2({
        selectedTags: [...step2.selectedTags, tagKey],
      });
    }
  };
  // useEffect(() => {
  //   fetch("/api/survey/123")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setTags(data.tags); // 예: ["emotional", "retro", ...]
  //     });
  // }, []);
  return (
    <div className="mb-8">
      <p className="font-semibold mb-2">
        해당 음원에 대해 느낀 해시태그를 선택해주세요 (최대 4개)
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tagKey) => {
          const isSelected = step2.selectedTags.includes(tagKey);
          return (
            <button
              key={tagKey}
              onClick={() => toggleTag(tagKey)}
              className={`px-4 py-2 rounded-full border transition ${
                isSelected
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-blue-100"
              }`}
            >
              #{predefinedTags[tagKey]}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TagSelectorParticipate;
