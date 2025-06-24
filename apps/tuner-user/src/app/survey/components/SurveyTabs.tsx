"use client";

interface TabProps {
  tabs: { key: string; label: string }[]; // tap 항목
  current: number; // 현재 선택된 tap 인덱스
  setTab: (index: number) => void; // 탭 변경 함수
}

export default function SurveyTabs({ tabs, current, setTab }: TabProps) {
  return (
    <div className="sticky top-0 z-10 bg-white">
      <div className="flex whitespace-nowrap scrollbar-hide justify-between items-center">
        {tabs.map((cat, i) => (
          <button
            key={cat.key}
            onClick={() => setTab(i)}
            className={`px-3 py-1.5 text-xs sm:text-sm md:text-base rounded-md text-center flex ${
              current === i ? "bg-blue-500 text-white" : "border-transparent"
            }`}
          >
            <span className="inline-block max-w-[90px] sm:max-w-[100px] truncate">
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
