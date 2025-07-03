"use client";
import React from "react";

interface TagSelectorProps {
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
}

const predefinedTags = [
  "감각적인",
  "화려한",
  "감성적인",
  "몽환적인",
  "트렌디한",
  "복고풍",
  "중독성 있는",
  "잔잔한",
  "역동적인",
  "독창적인",
];

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  setSelectedTags,
}) => {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length < 4) {
        setSelectedTags([...selectedTags, tag]);
      } else {
        alert("최대 4개까지 선택 가능합니다.");
      }
    }
  };

  return (
    <div className="mt-8">
      <p className="font-semibold mb-2">
        🎵 해당 음원에 대한 해시태그를 선택해주세요! (최대 4개)
      </p>
      <div className="flex flex-wrap gap-2">
        {predefinedTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              className={`px-4 py-2 rounded-full border text-sm transition ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TagSelector;
