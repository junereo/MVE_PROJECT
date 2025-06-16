// src/hooks/useSessionCheck.tsx
import { useEffect } from "react";
import axiosClient from "@/lib/network/axios";
import { useSessionStore } from "@/store/authmeStore";

export const useSessionCheck = () => {
    const { setUser, logout } = useSessionStore();

    useEffect(() => {
        const check = async () => {
            try {
                const res = await axiosClient.get("/admin/me"); // ✅ 서버는 쿠키 보고 사용자 확인
                setUser(res.data); // 사용자 정보 상태에 저장
            } catch (err) {
                logout(); // 인증 안 됐으면 로그아웃 처리
            }
        };

        check();
    }, []);
};
