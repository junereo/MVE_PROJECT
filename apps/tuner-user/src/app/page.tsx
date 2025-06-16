"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";
import { useState } from "react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleNext = () => {
    setIsModalOpen(false);
    router.push("/auth");
  };

  return (
    <div className="content">
      <h1 className="title">HOME</h1>
      <p>메인페이지</p>
      <button
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md"
        onClick={() => setIsModalOpen(true)}
      >
        모달 열기
      </button>
      {isModalOpen && (
        <Modal
          image="check.png"
          description="TUNER 회원가입을 완료했어요"
          buttonLabel="로그인 하기"
          color="blue"
          onClick={handleNext}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
