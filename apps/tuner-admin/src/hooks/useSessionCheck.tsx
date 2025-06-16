// src/hooks/useSessionCheck.tsx
"use client"
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/network/axios";
import { useSessionStore } from "@/store/authmeStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// const fetchSession = async () => {
//     const response = await axiosClient.get("https://jsonplaceholder.typicode.com/todos/1");
//     return response.data
// }

// 로그인할 때, setAdmin으로 저장 => 쿠키 저장
// 그 후에 이 함수가 다시 발동되겠지
export const useSessionCheck = () => {

    const { setAdmin } = useSessionStore()
    const router = useRouter()

    useEffect(() => {
        const check = async () => {
            try {
                const { data } = await axiosClient.get("/auth/admin/me"); // ✅ 서버는 쿠키 보고 사용자 확인
                if (!data) {
                    router.push("/login")
                }
                setAdmin(data)
            } catch (err) {
                console.log(err);
                // router.push("/login")
            }

        };

        check();
    }, []);

};
