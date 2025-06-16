"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { getMe } from "../services/api";

export default function AuthInitializer() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    getMe() // 쿠키 자동 전송
      .then((user) => {
        setUser(user); // 사용자 정보 저장
      })
      .catch(() => {}); // 토큰 만료 시 무시
  }, []);

  return null;
}
