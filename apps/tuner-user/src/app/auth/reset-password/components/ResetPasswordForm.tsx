"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { validateSignupField } from "@/features/auth/utils/validateSignup";
import { resetPassword } from "@/features/auth/services/find";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });

  const [errorModal, setErrorModal] = useState<null | { message: string }>(
    null
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClose = () => setErrorModal(null);

  const handleChange =
    (field: "password" | "confirmPassword") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (field === "password") {
        setPassword(value);
        const error = validateSignupField("password", value);
        setErrors((prev) => ({ ...prev, password: error }));
      } else {
        setConfirmPassword(value);
        const error = validateSignupField("confirmPassword", value, {
          password,
        });
        setErrors((prev) => ({ ...prev, confirmPassword: error }));
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrorModal({ message: "유효하지 않은 요청입니다." });
      return;
    }

    const passwordError = validateSignupField("password", password);
    const confirmError = validateSignupField(
      "confirmPassword",
      confirmPassword,
      { password }
    );
    setErrors({ password: passwordError, confirmPassword: confirmError });

    if (passwordError || confirmError) return;

    try {
      const res = await resetPassword(token, password);
      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorModal({
          message: res.message || "비밀번호 재설정에 실패했습니다.",
        });
      }
    } catch (err) {
      console.error("비밀번호 재설정 에러", err);
      setErrorModal({ message: "링크가 만료되었거나 잘못되었습니다." });
    }
  };

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

      {isSuccess ? (
        <div className="space-y-6 text-center border border-gray-100 bg-gray-50 px-6 py-10 rounded-lg shadow-sm">
          <p className="text-gray-700 text-sm">
            비밀번호가 성공적으로 변경되었습니다.
          </p>
          <Button color="green" onClick={() => router.push("/auth")}>
            로그인하러 가기
          </Button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 max-w-md w-full mx-auto"
        >
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={handleChange("password")}
            error={errors.password}
            placeholder="새 비밀번호"
            required
          />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={handleChange("confirmPassword")}
            error={errors.confirmPassword}
            placeholder="비밀번호 확인"
            required
          />
          <Button type="submit" color="green">
            비밀번호 재설정
          </Button>
        </form>
      )}
    </>
  );
}
