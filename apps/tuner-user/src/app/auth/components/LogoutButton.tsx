"use client";

import Modal from "@/components/ui/Modal";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { logoutRequest } from "@/features/auth/services/login";

interface LogoutButtonProps {
  onClose?: () => void; // 사이드바 닫기
}

export default function LogoutButton({ onClose }: LogoutButtonProps) {
  const [openModal, setOpenModal] = useState(false);
  const { logout } = useAuthStore(); // 상태 리셋 함수 가져옴
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    const res = await logoutRequest(); // 백엔드 api 로그아웃 요청

    // api 요청 성공 200번일 때 아래 처리되도록-!
    if (res.status === 200) {
      logout(); // Zustand 상태 초기화 (token, user → null)
      queryClient.removeQueries({ queryKey: ["user"] }); // React Query 캐시 삭제
      onClose?.(); // 사이드바 닫기
      router.push("/"); // 메인 페이지로 이동
    }
  };

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  return (
    <>
      <button onClick={handleOpen} className="text-sm hover:underline">
        LOGOUT
      </button>
      {openModal && (
        <Modal
          image="check.png"
          description="로그아웃 하시겠습니까?"
          buttonLabel="확인"
          cancelLabel="취소"
          color="blue"
          showCancel
          onClick={handleLogout}
          onClose={handleClose}
        />
      )}
    </>
  );
}
