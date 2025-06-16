"use client";

import { useSessionCheck } from "@/hooks/useSessionCheck";

export default function SessionChecker() {
    useSessionCheck(); // 클라이언트 훅 호출
    return null; // 렌더링은 하지 않음
}
