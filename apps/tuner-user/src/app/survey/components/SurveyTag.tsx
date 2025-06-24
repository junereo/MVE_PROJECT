"use client";

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

export default function SurveyTag() {
  return (
    <div className="pt-5 mb-6">
      <p className="text-sm font-semibold mb-2 text-gray-700">
        이 설문에 사용될 해시태그
      </p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(predefinedTags).map(([key, tag]) => (
          <span
            key={key}
            className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-sm border border-blue-200"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
