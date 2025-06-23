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
          <button
            onClick={onClose}
            className="font-bold text-right w-full mb-4"
          >
            X
          </button>
          <nav className="flex flex-col gap-4 items-center">
            <Link href="/" onClick={onClose}>
              Home
            </Link>
            <Link href="/survey" onClick={onClose}>
              Survey
            </Link>
            <Link href="/survey/create" onClick={onClose}>
              Create
            </Link>
            <Link href="/mypage" onClick={onClose}>
              My Page
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
