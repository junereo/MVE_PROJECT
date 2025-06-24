"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // 햄버거 아이콘 (lucide-react 설치 필요)

export default function Navigate() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 햄버거 버튼 (모바일에서만 보임) */}
      <button
        className="fixed top-4 left-4 z-50 text-white bg-blue-600 p-2 rounded-md shadow-lg lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 네비게이션 바 */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-blue-600 text-white shadow-lg z-40
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:w-[8%] lg:min-w-[72px]
        `}
      >
        <div className="p-4 font-bold text-lg">네비게이션</div>
        <ul className="space-y-2 p-4">
          <li>
            <Link href="/dashboard" className="block hover:text-blue-300">
              - Dashboard
            </Link>
          </li>
          <li>
            <Link href="/survey" className="block hover:text-blue-300">
              - Surveys
            </Link>
          </li>
          <li>
            <Link href="/signup" className="block hover:text-blue-300">
              - Sign up
            </Link>
          </li>
          <li>
            <Link href="/template" className="block hover:text-blue-300">
              - Template
            </Link>
          </li>
          <li>
            <Link href="/mypage" className="block hover:text-blue-300">
              - My Page
            </Link>
          </li>
          <li>
            <Link
              href="/surveyTest/create/step1"
              className="block hover:text-blue-300"
            >
              - Survey Test
            </Link>
          </li>
          <li>
            <Link href="/wallet" className="block hover:text-blue-300">
              - Wallet
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
