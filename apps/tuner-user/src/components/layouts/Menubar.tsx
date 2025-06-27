"use client";

import Link from "next/link";
import { useAuthStore } from "@/features/auth/store/authStore";
import LogoutButton from "@/app/auth/components/LogoutButton";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Menubar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuthStore();

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black bg-opacity-50"
    >
      <div className="relative w-full h-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] mx-auto">
        <aside
          onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          className="absolute top-0 right-0 h-full w-4/5 max-w-[300px] bg-white shadow-2xl px-6 py-8 rounded-l-2xl flex flex-col animate-slide-in-right"
        >
          <div className="flex justify-end mb-6">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black text-xl font-bold"
              aria-label="Close menu"
            >
              ×
            </button>
          </div>

          <nav className="flex flex-col gap-4 text-base font-medium text-left px-1">
            <Link
              href="/"
              onClick={onClose}
              className="hover:text-blue-500 transition"
            >
              홈
            </Link>
            <Link
              href="/survey"
              onClick={onClose}
              className="hover:text-blue-500 transition"
            >
              설문 목록
            </Link>
            <Link
              href="/survey/create"
              onClick={onClose}
              className="hover:text-blue-500 transition"
            >
              설문 생성
            </Link>
            <Link
              href="/mypage"
              onClick={onClose}
              className="hover:text-blue-500 transition"
            >
              마이페이지
            </Link>
          </nav>

          <div className="flex flex-col items-start mt-6 pt-6 border-t border-gray-200 text-sm text-left px-1">
            {user ? (
              <LogoutButton />
            ) : (
              <Link
                href="/auth"
                onClick={onClose}
                className="text-gray-600 hover:text-black font-bold"
              >
                LOGIN
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
