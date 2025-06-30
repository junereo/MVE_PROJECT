"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { socialLogin } from "@/features/auth/services/login";

export default function KakaoRedirectClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser, setInitialized } = useAuthStore();

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      socialLogin("kakao", code)
        .then((res) => {
          setUser(res.data.user);
          setInitialized(true);
          router.push("/"); // 로그인 후 홈으로
        })
        .catch(() => {
          router.push("/auth");
        });
    }
  }, [searchParams, setUser, router, setInitialized]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-600 text-sm animate-pulse">
        카카오 로그인 처리 중입니다. 잠시만 기다려주세요...
      </p>
    </div>
  );
}
