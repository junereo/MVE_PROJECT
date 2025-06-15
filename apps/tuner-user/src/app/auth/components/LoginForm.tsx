"use client";

import Input from "@/components/ui/input";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { LoginFormData, LoginFormErrors } from "@/features/auth/types";
import {
  allLoginFields,
  validateLoginField,
} from "@/features/auth/utils/validateLogin";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/authStore";
import { login } from "@/features/auth/services/api";
// import { mockLogin } from "@/features/auth/services/api"; // 테스트용

const initialFormData: LoginFormData = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const { setToken, setUser } = useAuthStore();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    const error = validateLoginField(
      name as keyof LoginFormData,
      value,
      updated
    );
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = allLoginFields(formData);

    // 에러가 있는 경우 에러 상태 업데이트
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // !-수정 필요함-!
    try {
      const res = await login(formData); // 백엔드에 요청
      if (res.token && res.user) {
        setToken(res.token); // 토큰 상태 저장
        setUser(res.user); // 사용자 정보 저장 (email, nickname)
        localStorage.setItem("token", res.token); // 토큰 저장
        router.push("/"); // 메인으로 이동
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
    }

    /*
        테스트
        try {
          const res = await mockLogin(formData);
          alert("로그인 성공");
        } catch (err) {
          alert("로그인 실패");
        }
    */
  };

  return (
    <div className="w-full max-w-[400px] mx-auto mt-12">
      <p className="text-center text-gray-400 text-sm mt-2 mb-6">
        Tuner 서비스에 오신 걸 환영합니다
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-white p-6 rounded-lg"
      >
        <div className="mb-2">
          <Input
            //   label="이메일"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="이메일을 입력해주세요"
            required
          />
          <Input
            //   label="비밀번호"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="비밀번호를 입력해주세요"
            required
          />
        </div>

        <Button type="submit" color="blue">
          로그인
        </Button>
        <Link
          href="/auth/signup"
          className="text-center text-blue-400 hover:underline mt-2 mb-2"
        >
          아직 계정이 없으신가요? 회원가입
        </Link>
      </form>
    </div>
  );
}
