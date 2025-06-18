// components/Dropdown.tsx
'use client';
import { useState } from 'react';

interface DropdownProps {
    options: string[]; //드롭다운 문항  배열
    selected: string; // 드롭다운 명칭;
    onSelect: (option: string) => void;
}

const Dropdown = ({ options, selected, onSelect }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option: string) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-100"
            >
                {selected} ▼
            </button>

            {isOpen && (
                <ul className="absolute z-10 mt-2 w-full bg-white border rounded-md shadow-md">
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
