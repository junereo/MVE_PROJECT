"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/input";
import { useState } from "react";
import { mockSignup } from "@/features/auth/services/api";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // 에러 상태 관리

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // 에러가 있는 경우 에러 상태 업데이트
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setErrors({});

      const resolve = await mockSignup({
        email,
        password,
        nickname,
        phoneNumber,
      });

      // 회원가입 성공 여부 확인, 수정 필요함-!!
      if (resolve.status === 201) {
      }
      console.log("회원가입 성공: ", resolve.data.message);
    } catch (error) {
      console.log(`회원가입 실패 : ${error}`);
    }
  };

  // 입력값 유효성 검사
  const validateField = (field: string, value: string) => {
    switch (field) {
      case "email":
        if (!value.includes("@")) {
          setErrors((prev) => ({
            ...prev,
            email: "유효한 이메일 주소를 입력해주세요.",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            email: "",
          }));
        }
        setEmail(value);
        break;
      case "password":
        if (value.length < 6) {
          setErrors((prev) => ({
            ...prev,
            password: "비밀번호는 6자 이상으로 입력해주세요.",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            password: "",
          }));
        }
        setPassword(value);
        break;
      case "confirmPassword":
        if (password !== value) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "비밀번호가 일치하지 않습니다.",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "",
          }));
        }
        setConfirmPassword(value);
        break;
      case "nickname":
        if (value.trim().length < 2 || value.trim().length > 8) {
          setErrors((prev) => ({
            ...prev,
            nickname: "닉네임은 2자 이상 8자 이하로 입력해주세요.",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            nickname: "",
          }));
        }
        setNickname(value);
        // return "닉네임은 2자 이상 8자 이하로 입력해주세요.";
        break;
      case "phoneNumber":
        if (!/^\d{10,11}$/.test(value)) {
          setErrors((prev) => ({
            ...prev,
            phoneNumber:
              "휴대전화번호는 10자리 또는 11자리 숫자로 입력해주세요.",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            phoneNumber: "",
          }));
        }
        setPhoneNumber(value);
        break;
    }
    return "";
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-[400px] mx-auto mt-10 p-6"
    >
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex flex-col gap-2 mb-4">
          <div>
            <Input
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => validateField("email", e.target.value)}
              error={errors["email"]}
              placeholder="이메일을 입력해주세요"
              required
            />
          </div>
          <Input
            label="비밀번호"
            type="password"
            value={password}
            onChange={(e) => validateField("password", e.target.value)}
            error={errors.password}
            placeholder="비밀번호를 입력해주세요"
            required
          />
          <Input
            label="비밀번호 확인"
            type="password"
            value={confirmPassword}
            onChange={(e) => validateField("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
            placeholder="비밀번호를 다시 입력해주세요"
            required
          />
        </div>
        <Input
          label="닉네임"
          type="text"
          value={nickname}
          onChange={(e) => validateField("nickname", e.target.value)}
          error={errors.nickname}
          placeholder="닉네임을 입력해주세요"
          maxLength={8}
          required
        />
        <Input
          label="휴대전화번호"
          type="tel"
          value={phoneNumber}
          onChange={(e) => validateField("phoneNumber", e.target.value)}
          error={errors.phoneNumber}
          placeholder="휴대전화번호를 입력해주세요"
          maxLength={11}
          required
        />
      </div>
      <Button type="submit" color="blue">
        회원가입
      </Button>
    </form>
  );
}
