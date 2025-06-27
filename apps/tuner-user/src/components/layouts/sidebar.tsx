"use client";

import Link from "next/link";
import { useAuthStore } from "@/features/auth/store/authStore";
import LogoutButton from "@/app/auth/components/LogoutButton";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuthStore();

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center"
    >
      <aside className="relative w-full max-w-[485px] h-full">
        <div
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()} // 내부 클릭 이벤트 버블링 막기
          className="absolute top-0 right-0 w-64 h-full bg-white p-6 shadow-lg"
        >
          {/* 닫기 버튼 */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-gray-700 font-bold text-xl"
            >
              ✕
            </button>
          </div>

          {/* 네비게이션 */}
          <nav className="flex flex-col items-start ml-6 mt-6 space-y-4">
            <Link href="/" onClick={onClose} className="text-lg font-medium ">
              홈
            </Link>
            <Link href="/survey" onClick={onClose}>
              Survey
            </Link>
            <Link
              href="/survey/create"
              onClick={onClose}
              className="text-lg font-medium"
            >
              설문 생성
            </Link>
            <Link
              href="/mypage"
              onClick={onClose}
              className="text-lg font-medium"
            >
              마이페이지
            </Link>
          </nav>
          <nav className="text-right mt-8">
            {user ? (
              <LogoutButton />
            ) : (
              <Link href="/auth" onClick={onClose}>
                Login
              </Link>
            )}
          </nav>
        </div>
      </aside>
    </div>
  );
}
