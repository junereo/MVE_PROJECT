"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import LogoutButton from "@/app/auth/components/LogoutButton";
import Sidebar from "./sidebar";

export default function Header() {
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[485px] min-h-[52px] flex justify-between items-center bg-white text-black border border-red-500 px-4 py-2 z-50">
        <div>
          <Link href="/" className="text-2xl font-bold">
            LOGO
          </Link>
        </div>
        <nav className="flex gap-4 items-center">
          <Link href="/search">Search</Link>
          {user ? <LogoutButton /> : <Link href="/auth">Login</Link>}
          <div onClick={() => setSidebarOpen(true)} className="text-xl">
            ☰
          </div>
        </nav>
      </header>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
