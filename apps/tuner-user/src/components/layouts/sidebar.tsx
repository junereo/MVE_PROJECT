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
      className="fixed inset-0 z-60 bg-black bg-opacity-50 flex justify-center"
      onClick={onClose}
    >
      <aside
        className="relative w-full max-w-[485px] h-full"
        onClick={(e) => e.stopPropagation()} // 내부 클릭 이벤트 버블링 막기
      >
        <div className="absolute top-0 right-0 w-64 h-full bg-white p-6 shadow-lg">
          <button onClick={onClose} className="text-right w-full mb-4">
            X
          </button>
          <nav className="flex flex-col gap-4 items-center">
            <Link href="/">Home</Link>
            <Link href="/survey">Survey</Link>
            <Link href="/mypage">My Page</Link>
          </nav>
          <nav className="flex flex-col-reverse place-items-end mt-8">
            {user ? <LogoutButton /> : <Link href="/auth">Login</Link>}
          </nav>
        </div>
      </aside>
    </div>
  );
}
