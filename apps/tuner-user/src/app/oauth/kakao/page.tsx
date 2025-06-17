"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { socialLogin } from "@/features/auth/services/api";

export default function KakaoRedirectPage() {
  const searchParams = useSearchParams(); // 쿼리 파라미터 추출 (e.g., ?code=xxxx)
  const router = useRouter();
  const { setToken, setUser } = useAuthStore(); // Zustand 로그인 상태

  useEffect(() => {
    const code = searchParams.get("code"); // 카카오가 보내준 인가 코드 추출

    // !-수정 필요-!
    if (code) {
      socialLogin("kakao", code)
        .then((res) => {
          setToken(res.data.token); // 토큰 상태 저장
          setUser(res.data.user); // 로그인 상태 저장
          router.push("/"); // 로그인 성공 시 메인으로 이동
        })
        .catch((error) => {
          router.push("/auth");
        });
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-600 text-sm animate-pulse">
        카카오 로그인 처리 중입니다. 잠시만 기다려주세요...
      </p>
    </div>
  ); // 사용자에게 로딩 안내
}
