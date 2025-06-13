"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/input";
import { useState } from "react";
import { SignupFormData, SignupFormErrors } from "@/features/auth/types";
import {
  validateAllFields,
  validateField,
} from "@/features/auth/utils/validate";
import { signup } from "@/features/auth/services/api";
// import { mockSignup } from "@/features/auth/services/api"; 테스트용

const initialFormData: SignupFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  nickname: "",
  phoneNumber: "",
};

export default function SignupForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<SignupFormErrors>({}); // 에러 상태 관리

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    const error = validateField(name as keyof SignupFormData, value, updated);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateAllFields(formData);

    // 에러가 있는 경우 에러 상태 업데이트
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // !-수정 필요함-!
    try {
      const res = await signup(formData);
      alert("회원가입 성공");
    } catch (err) {
      alert("회원가입 실패");
    }

    /*
      테스트용

    try {
      const res = await mockSignup(formData);
      if (res.status === 201) {
        alert("회원가입 성공!");
        setFormData(initialFormData);
      }
    } catch (err) {
      alert("회원가입 실패");
    }
    */
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
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="이메일을 입력해주세요"
              required
            />
          </div>
          <Input
            label="비밀번호"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="비밀번호를 입력해주세요"
            required
          />
          <Input
            label="비밀번호 확인"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="비밀번호를 다시 입력해주세요"
            required
          />
        </div>
        <Input
          label="닉네임"
          name="nickname"
          type="text"
          value={formData.nickname}
          onChange={handleChange}
          error={errors.nickname}
          maxLength={8}
          placeholder="닉네임을 입력해주세요"
          required
        />
        <Input
          label="휴대전화번호"
          name="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
          onChange={handleChange}
          error={errors.phoneNumber}
          maxLength={11}
          placeholder="휴대전화번호를 입력해주세요"
          required
        />
      </div>
      <Button type="submit" color="blue">
        회원가입
      </Button>
    </form>
  );
}
