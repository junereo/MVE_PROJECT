"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileText, User } from "lucide-react"; // 아이콘 사용

export default function BottomNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "홈", icon: <Home size={20} /> },
    { href: "/survey", label: "설문", icon: <FileText size={20} /> },
    { href: "/mypage", label: "마이", icon: <User size={20} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[768px] sm:max-w-[640px] xs:max-w-[485px] h-[56px] bg-white border-t border-gray-200 z-30 flex justify-around items-center">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center text-sm font-medium transition ${
              isActive ? "text-blue-600" : "text-gray-500 hover:text-black"
            }`}
          >
            {item.icon}
            <span className="text-[11px] mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
