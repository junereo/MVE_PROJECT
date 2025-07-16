"use client";

import Link from "next/link";
import { useState } from "react";
import Menubar from "@/components/layouts/Menubar";
import Image from "next/image";

export default function Header() {
  const [MenubarOpen, setMenubarOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[56px] flex justify-between items-center bg-white text-black border-b border-gray-200 px-4 z-30">
        <div>
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="로고 이미지"
              width={100}
              height={24}
            />
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <button
            onClick={() => setMenubarOpen(true)}
            aria-label="Open menu"
            className="text-xl font-bold text-gray-800 hover:text-black transition"
          >
            ☰
          </button>
        </nav>
      </header>
      <Menubar isOpen={MenubarOpen} onClose={() => setMenubarOpen(false)} />
    </>
  );
}
