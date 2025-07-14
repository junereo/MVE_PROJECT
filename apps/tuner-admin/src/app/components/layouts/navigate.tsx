'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation'; // ✅ 추가

export default function Navigate() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname(); // ✅ 현재 경로 가져오기

    const navItems = [
        { label: '대시보드', href: '/dashboard', activePath: '/dashboard' },
        {
            label: '설문조사',
            href: '/survey',
            activePath: '/survey',
        },
        { label: '회원가입', href: '/signup', activePath: '/signup' },
        {
            label: '고정질문',
            href: '/fixedQuestion',
            activePath: '/fixedQuestion',
        },
        { label: '유저관리', href: '/userService', activePath: '/userService' },
        { label: '지갑관리', href: '/wallet', activePath: '/wallet' },
        {
            label: 'SBT출금',
            href: '/userWithdrawal',
            activePath: '/userWithdrawal',
        },
    ];

    return (
        <>
            {/* 햄버거 버튼 */}
            <button
                className="fixed top-4 left-4 z-50 text-black bg-[#DEDEDE] p-2 rounded-md shadow-lg lg:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* 사이드바 */}
            <div
                className={`
        fixed top-0 left-0 h-screen z-40 bg-[#DEDEDE] shadow-lg
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:w-[8%] 
      `}
            >
                <div className="text-[#888888] font-bold text-lg p-4">
                    네비게이션
                </div>
                <ul className="space-y-2 px-4">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.activePath);

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`block py-1 hover:text-black ${
                                        isActive
                                            ? 'text-black font-semibold underline'
                                            : 'text-[#888888]'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}
