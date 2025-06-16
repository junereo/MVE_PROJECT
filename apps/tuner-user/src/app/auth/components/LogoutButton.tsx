"use client";

import { useAuthStore } from "@/features/auth/store/authStore";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { logout } = useAuthStore(); // 상태 리셋 함수 가져옴
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Zustand 상태 초기화 (token, user → null)
    localStorage.removeItem("token"); // 로컬스토리지에서 토큰 제거
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
