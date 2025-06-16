"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";

export default function Home() {
  const router = useRouter();

  const handleNext = () => {
    router.push("/auth");
  };

  return (
    <div className="content">
      <h1 className="title">HOME</h1>
      <p>메인페이지</p>
      <Modal
        image="check.png"
        description="로그인 하시겠습니까?"
        buttonLabel="로그인하러 가기"
        onClick={handleNext}
      />
    </div>
  );
}
