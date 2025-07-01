import { useAuthStore } from "../store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// 로그인 후 사용 가능한 페이지 접근 시 인증 상태 확인 후 미로그인 시 /auth로 이동
export const useAuthGuard = () => {
  const { user, isInitialized } = useAuthStore(); // zustand 로그인 상태
  const router = useRouter();

  useEffect(() => {
    if (!isInitialized) return; // 초기화 전 아무것도 안보여줌
    if (!user) router.replace("/auth"); // 로그인 페이지로 이동
  }, [user, isInitialized, router]);

  return { user, isInitialized };
};
