"use client";
import { useState } from "react";

interface DropdownProps {
  className?: string; // 드롭다운의 클래스 이름
  value?: string; // 드롭다운의 현재 선택된 값
  onChange?: (value: string) => void; // 선택 변경 시 호출되는 함수
  options: string[]; // 드롭다운 문항  배열
  selected: string; // 드롭다운 명칭;
  onSelect: (option: string) => void; // 선택된 옵션을 처리하는 함수
}

const Dropdown = ({ options, selected, onSelect }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false); // 드롭다운 열림 여부

  const handleSelect = (option: string) => {
    onSelect(option); // 선택된 옵션 처리
    setIsOpen(false); // 선택 후 드롭다운 닫기
  };

  return (
    <div className="relative inline-block text-left ">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-100 min-w-[120px] flex items-center justify-between"
      >
        <span>{selected}</span>
        <span className="ml-2">{isOpen ? "▲" : "▼"}</span> {/* 화살표 변경 */}
      </button>

      {/* 드롭다운 옵션 영역 */}
      <div
        className={`absolute z-10 mt-2 w-full bg-white border rounded-md shadow-md overflow-y-auto transition-all duration-300 ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="py-1">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className="px-5 py-2 hover:bg-gray-200 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
