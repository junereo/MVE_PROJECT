"use client";

import { useUserStore } from "@/features/users/store/useUserStore";
import { useEffect, useState } from "react";
import FormInput from "./FormInput";
import { getUserInfo, updateUserInfo } from "@/features/users/services/user";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";

export default function PasswordEditForm() {
  const router = useRouter();

  const user = useUserStore((state) => state.userInfo);
  const { setUserInfo } = useUserStore();

  const [simplePassword, setsimplePassword] = useState("");
  const [simplePasswordError, setSimplePasswordError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    image: "",
    description: "",
    buttonLabel: "",
    redirectTo: "",
  });

  useEffect(() => {
    if (user) {
      setsimplePassword(user.simple_password ?? "");
    }
  }, [user]);

  if (!user) return null;

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleNext = () => {
    setIsModalOpen(false);
    router.push(modalContent.redirectTo);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("제출할 데이터", { simplePassword });

    if (!/^\d{6}$/.test(simplePassword)) {
      setSimplePasswordError("6자리 숫자로 입력해주세요.");
      return;
    }
    setSimplePasswordError("");

    try {
      await updateUserInfo(user.id, {
        simple_password: simplePassword,
      });

      const res = await getUserInfo(user.id);
      setUserInfo(res.data);

      setModalContent({
        image: "check.png",
        description: "간편 비밀번호 수정을 완료했습니다.",
        buttonLabel: "확인",
        redirectTo: "/mypage/profile",
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error("간편 비밀번호 수정 실패:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      {isModalOpen && (
        <Modal
          image={modalContent.image}
          description={modalContent.description}
          buttonLabel={modalContent.buttonLabel}
          onClick={handleNext}
          onClose={handleClose}
          color={modalContent.image === "check.png" ? "blue" : "red"}
        />
      )}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4">
        <FormInput
          label="포인트"
          value={
            typeof user?.balance === "number"
              ? user.balance.toString() + "point"
              : "보유하고 있는 포인트가 없습니다."
          }
        />
        <FormInput
          label="TUNER 토큰"
          value={
            typeof user?.balance === "number"
              ? user.balance.toString()
              : "보유하고 있는 TUNER 토큰이 없습니다."
          }
        />

        <FormInput
          label="간편 비밀번호"
          value={simplePassword}
          onChange={(val) => {
            if (/^\d*$/.test(val)) setsimplePassword(val);
            setSimplePasswordError("");
          }}
          type="text"
          placeholder="6자리 숫자"
          inputMode="numeric"
          pattern="\d*"
          maxLength={6}
          error={simplePasswordError}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          수정
        </button>
      </form>
    </>
  );
}
