"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import { useRouter } from "next/navigation";
import { logoutRequest } from "@/features/auth/services/api";

export default function LogoutButton() {
  const { logout } = useAuthStore(); // 상태 리셋 함수 가져옴
  const router = useRouter();

  const handleLogout = async () => {
    await logoutRequest(); // 로그아웃 요청
    logout(); // Zustand 상태 초기화 (token, user → null)
    router.push("/auth"); // 로그인 페이지로 이동
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-500 text-sm hover:underline"
    >
      Logout
    </button>
  );
}
