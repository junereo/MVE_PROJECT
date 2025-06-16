"use client";

import { useUser } from "../hooks/useUser";

// 최초 실행 시 Zustand에 로그인 사용자 저장
export default function AuthInitializer() {
  useUser(); // 로그인 상태 확인 자동으로 실행, 페이지 진입 => `/auth/me` => zustand user 저장

  return null;
}
