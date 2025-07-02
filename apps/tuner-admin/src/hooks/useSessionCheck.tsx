// src/hooks/useSessionCheck.tsx
"use client";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/network/axios";
import { useSessionStore } from "@/store/useAuthmeStore";
import { useEffect } from "react";

// 로그인할 때, setAdmin으로 저장 => 쿠키 저장
export const useSessionCheck = () => {
  const { setAdmin } = useSessionStore();
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      try {
        const { data } = await axiosClient.post("/auth/me"); //  서버는 쿠키 보고 사용자 확인
        console.log(data);

        if (
          !data ||
          (data.user.role !== "admin" && data.user.role !== "superadmin")
        ) {
          router.push("/login");
        }
        setAdmin(data.user);
      } catch (err) {
        console.log(err);
        // 세션관리 후 정보가 없을시
        // 로그인 페이지로 보내기
        router.push("/login");
      }
    };

    check();
  }, []);
};
