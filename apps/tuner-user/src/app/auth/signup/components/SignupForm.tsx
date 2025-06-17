"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useState } from "react";
import { SignupFormData, SignupFormErrors } from "@/features/auth/types";
import {
  allSignupFields,
  validateSignupField,
} from "@/features/auth/utils/validateSignup";
import { useRouter } from "next/navigation";
import { signup } from "@/features/auth/services/api";
// import { mockSignup } from "@/features/auth/services/api"; // 테스트용

const initialFormData: SignupFormData = {
  email: "",
  password: "",
  confirmPassword: "",
  nickname: "",
  phone_number: "",
};

export default function SignupForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<SignupFormErrors>({}); // 에러 상태 관리
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    const error = validateSignupField(
      name as keyof SignupFormData,
      value,
      updated
    );
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = allSignupFields(formData);

    // 에러가 있는 경우 에러 상태 업데이트
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // !-수정 필요함, 모달창으로 회원가입 성공 안내-!
    try {
      const res = await signup(formData); // 백엔드에 요청
      console.log(res);
      if (res.status >= 200 && res.status < 300) {
        router.push("/login"); // 로그인으로 이동
      }
    } catch (err) {
      alert(err);
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

    {email: 'choa323@naver.com', password: 'skdi3487', confirmPassword: 'skdi3487', nickname: '조상', phoneNumber: '01012344567'}
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
              placeholder="이메일"
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
            placeholder="비밀번호"
            required
          />
          <Input
            label="비밀번호 확인"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="비밀번호 확인"
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
          placeholder="닉네임"
          required
        />
        <Input
          label="휴대전화번호"
          name="phone_number"
          type="tel"
          value={formData.phone_number}
          onChange={handleChange}
          error={errors.phone_number}
          maxLength={11}
          placeholder="휴대폰 번호"
          required
        />
      </div>
      <Button type="submit" color="blue">
        가입하기
      </Button>
    </form>
  );
}
