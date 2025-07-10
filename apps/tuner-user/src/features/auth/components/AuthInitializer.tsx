"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { getMe } from "@/features/auth/services/login";

// 사용자 로그인 상태 동기화
export default function AuthInitializer() {
  const { setUser, setInitialized } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      try {
        const user = await getMe(); // 사용자 {id, nickname} 요청
        setUser(user); // 성공 시 setUser에 상태 저장
      } catch {
        setUser(null); // 실패 시 null
      } finally {
        setInitialized(true); // 완료 후 로그인 체크 true
      }
    };

    init();
  }, [setUser, setInitialized]);

  return null;
}
