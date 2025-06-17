"use client";

import Link from "next/link";
import { useAuthStore } from "@/features/auth/store/authStore";
import LogoutButton from "@/app/auth/components/LogoutButton";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }): SidebarProps {
  const { user } = useAuthStore();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <aside
        className="fixed top-0 left-0 h-full w-64 bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="text-right w-full mb-4">
          X
        </button>
        <Link href="/">Home</Link>
        <Link href="/survey">Survey</Link>
        <Link href="/mypage">My Page</Link>
        <nav className="flex gap-4 items-center">
          <Link href="/search">Search</Link>
          {user ? <LogoutButton /> : <Link href="/auth">Login</Link>}
          <div className="block">☰</div>
        </nav>
      </aside>
    </div>
  );
}
