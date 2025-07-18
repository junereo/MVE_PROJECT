"use client";

interface TabItem {
  key: string;
  label: string;
}
interface TabProps {
  tabs: readonly TabItem[]; // readonly 배열도 허용
  current: number; // 현재 선택된 tap 인덱스
  setTab: (index: number) => void; // 탭 변경 함수
}

export default function SurveyTabs({ tabs, current, setTab }: TabProps) {
  return (
    <div className="sticky top-0 z-10 w-full bg-white overflow-hidden flex justify-between">
      {tabs.map((cat, i) => {
        const isActive = current === i;
        return (
          <button
            key={cat.key}
            onClick={() => setTab(i)}
            className={`
                flex-1 min-w-0 py-2 text-sm sm:text-base transition
                ${
                  isActive
                    ? "bg-[#57CC7E] text-white font-semibold shadow-sm"
                    : "bg-gray-100 text-gray-800 hover:bg-[#E8FDF0]"
                }
              `}
          >
            <span className="block text-center">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
