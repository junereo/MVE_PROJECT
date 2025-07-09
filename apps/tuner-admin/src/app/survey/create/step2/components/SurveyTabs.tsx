'use client';
import { useRef, useEffect } from 'react';

interface TabProps {
    tabs: { key: string; label: string }[];
    current: number;
    setTab: (index: number) => void;
}
export default function SurveyTabs({ tabs, current, setTab }: TabProps) {
    const customTabRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (tabs[current]?.key === 'custom' && customTabRef.current) {
            customTabRef.current.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
            });
        }
    }, [current, tabs]);

    return (
        <div className="sticky top-0 z-10 border-b shadow-sm">
            <div className="flex gap-2 sm:gap-4 overflow-x-auto whitespace-nowrap scrollbar-hide px-4 py-2">
                {tabs.map((cat, i) => (
                    <button
                        key={cat.key}
                        ref={cat.key === 'custom' ? customTabRef : undefined}
                        onClick={() => setTab(i)}
                        className={`px-2 sm:px-3 py-1 text-xs sm:text-sm md:text-base rounded-md border-b-2 transition-colors duration-200
            ${
                current === i
                    ? 'border-blue-400 bg-blue-500 text-white'
                    : 'border-transparent text-gray-600 hover:bg-blue-100'
            }`}
                    >
                        <span className="inline-block max-w-[70px] sm:max-w-[100px] truncate">
                            {cat.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
