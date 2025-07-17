"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/features/users/store/useUserStore";
import FormInput from "./FormInput";
import Modal from "@/components/ui/Modal";
import { getUserInfo, updateUserInfo } from "@/features/users/services/user";
import { validateSignupField } from "@/features/auth/utils/validateSignup";

export default function MemberEditForm() {
  const router = useRouter();

  const user = useUserStore((state) => state.userInfo);
  const { setUserInfo } = useUserStore();

  const [nickname, setNickname] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    image: "",
    description: "",
    buttonLabel: "",
    redirectTo: "",
  });

  useEffect(() => {
    if (user) {
      setNickname(user.nickname);
      setRole(user.role);
      setPhone(user.phone_number ?? "");
      setEmail(user.email);
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

    try {
      await updateUserInfo(user.id, {
        nickname,
        phone_number: phone,
        email,
      });

      const res = await getUserInfo(user.id);
      setUserInfo(res.data);

      setModalContent({
        image: "check.png",
        description: "회원 정보 수정을 완료했습니다.",
        buttonLabel: "확인",
        redirectTo: "/mypage/profile",
      });
      setIsModalOpen(true);
    } catch (error) {
      console.error("회원 정보 수정 실패:", error);
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
          label="이름"
          value={nickname}
          onChange={(value) => {
            setNickname(value);
            setNicknameError(validateSignupField("nickname", value));
          }}
          error={nicknameError}
        />
        <FormInput label="회원 등급" value={role} />
        <FormInput
          label="휴대전화번호"
          value={phone}
          onChange={(value) => {
            setPhone(value);
            setPhoneError(validateSignupField("phone_number", value));
          }}
          error={phoneError}
          type="tel"
          maxLength={11}
          placeholder="010-1234-5678"
        />
        <FormInput
          label="이메일"
          value={email}
          onChange={(value) => {
            setEmail(value);
            setEmailError(validateSignupField("email", value));
          }}
          error={emailError}
          type="email"
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
