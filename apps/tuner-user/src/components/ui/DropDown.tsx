"use client";
import { useState } from "react";

interface DropdownProps {
  className?: string; // 드롭다운의 클래스 이름
  value?: string; // 드롭다운의 현재 선택된 값
  onChange?: (value: string) => void; // 선택 변경 시 호출되는 함수
  options: string[]; //드롭다운 문항  배열
  selected: string; // 드롭다운 명칭;
  onSelect: (option: string) => void; // 선택된 옵션을 처리하는 함수
}

const Dropdown = ({ options, selected, onSelect }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="z-10 mt-2 w-full px-4 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-100"
      >
        {selected} ▼
      </button>

      {isOpen && (
        <ul className="absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto bg-white border rounded-md shadow-md">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => handleSelect(option)}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
