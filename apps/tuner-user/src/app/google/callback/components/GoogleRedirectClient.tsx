"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { googleLogin } from "@/features/auth/services/login";

export default function GoogleRedirectClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      googleLogin("google", code)
        .then((res) => {
          setUser(res.data.user);
          router.push("/"); // 로그인 후 홈으로
        })
        .catch(() => {
          router.push("/auth");
        });
    }
  }, [searchParams, setUser, router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-gray-600 text-sm animate-pulse">
        구글 로그인 처리 중입니다. 잠시만 기다려주세요...
      </p>
    </div>
  );
}
