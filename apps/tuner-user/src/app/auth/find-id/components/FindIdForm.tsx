"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { findUserId } from "@/features/auth/services/find";
import Modal from "@/components/ui/Modal";
import { validatePhoneNumber } from "@/features/auth/utils/validateCommon";

export default function FindIdForm() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailResult, setEmailResult] = useState("");
  const [errorModal, setErrorModal] = useState<null | { message: string }>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailResult("");

    const error = validatePhoneNumber(phoneNumber);
    if (error) {
      setErrorModal({ message: error });
      return;
    }

    try {
      const res = await findUserId(phoneNumber);

      if (res.data.success) {
        setEmailResult(res.data.email);
        setPhoneNumber("");
      }
    } catch (err) {
      setPhoneNumber("");
      console.error("아이디 찾기 에러", err);
      setErrorModal({ message: "일치하는 회원 정보를 찾을 수 없습니다." });
    }
  };

  const handleClose = () => setErrorModal(null);

  return (
    <>
      {errorModal && (
        <Modal
          image="x.png"
          description={errorModal.message}
          buttonLabel="닫기"
          color="red"
          onClick={handleClose}
          onClose={handleClose}
        />
      )}
      {!emailResult ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={phoneNumber}
            maxLength={11}
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, ""); // 숫자만 남김
              setPhoneNumber(onlyNums);
            }}
            placeholder="‘-’ 없이 숫자만 입력"
            required
          />
          {errorModal && (
            <p className="text-sm text-red-500 mt-1 pl-1">
              {errorModal.message}
            </p>
          )}
          <Button type="submit" color="blue">
            아이디 찾기
          </Button>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="text-center space-y-4 border border-gray-100 bg-gray-50 px-6 py-8">
            <p className="text-sm text-gray-500">가입된 이메일</p>
            <p className="text-base font-semibold text-gray-800 break-words">
              {emailResult}
            </p>
          </div>
          <Button color="blue" onClick={() => router.push("/auth")}>
            로그인하러 가기
          </Button>
        </div>
      )}
    </>
  );
}
