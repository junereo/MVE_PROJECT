"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { requestPassword } from "@/features/auth/services/find";
import { validateEmail } from "@/features/auth/utils/validateCommon";

export default function RequestPasswordForm() {
  const [email, setEmail] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [errorModal, setErrorModal] = useState<null | { message: string }>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResultMessage("");
    setIsLoading(true);

    const error = validateEmail(email);
    if (error) {
      setErrorModal({ message: error });
      setIsLoading(false);
      return;
    }

    try {
      const res = await requestPassword(email);

      if (res.success) {
        setResultMessage("비밀번호 재설정 링크가 전송되었습니다.");
        setEmail("");
      } else {
        setErrorModal({ message: res.message || "요청에 실패했습니다." });
      }
    } catch (err) {
      console.error("비밀번호 재설정 요청 에러", err);
      setErrorModal({ message: "존재하지 않는 이메일입니다." });
      setIsLoading(false);
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

      {!resultMessage ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="가입한 이메일 주소를 입력하세요"
            required
          />
          {errorModal && (
            <p className="text-sm text-red-500 mt-1 pl-1">
              {errorModal.message}
            </p>
          )}
          <Button type="submit" disabled={isLoading} color="green">
            {isLoading ? "요청 중..." : "비밀번호 재설정 메일 받기"}
          </Button>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="text-center space-y-4 border border-gray-100 bg-gray-50 px-6 py-8">
            <p className="text-sm text-gray-500">안내 메시지</p>
            <p className="text-base font-semibold text-gray-800 break-words">
              비밀번호 재설정 링크가
              <br />
              이메일로 전송되었습니다.
              <br />
              메일함을 확인해 주세요.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
