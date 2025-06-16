"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { getMe } from "../services/api";

export default function AuthInitializer() {
  const { setToken, setUser } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setToken(token); // 토큰 저장
      getMe(token)
        .then((user) => setUser(user)) // 사용자 상태 유지
        .catch(() => {
          localStorage.removeItem("token"); // 만료된 토큰이면 로그아웃 처리
        });
    }
  }, []);

  return null;
}
