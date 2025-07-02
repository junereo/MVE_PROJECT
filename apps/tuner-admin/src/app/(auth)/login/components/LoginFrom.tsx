"use client";

import { AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { pushLogin } from "@/lib/network/api";
import {
  validateLoginField,
  allLoginFields,
} from "@/lib/authError/loginHandler";
import { LoginFormData, LoginFormErrors } from "@/types";

const LoginForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const error = validateLoginField(field, value, formData);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = allLoginFields(formData);
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err !== "");
    if (hasError) {
      alert("입력값을 다시 확인해주세요.");
      return;
    }

    try {
      const result = await pushLogin(formData);
      console.log("로그인 성공:", result);
      router.push("/dashboard");
    } catch (error) {
      const err = error as AxiosError;
      const status = err.response?.status as number;
      if (status === 401) {
        alert("이메일 또는 비밀번호가 일치하지 않습니다.");
      } else {
        alert("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#DEDEDE] flex justify-center py-28 px-4">
      <div className="w-full max-w-xl bg-black text-white p-12 rounded-2xl shadow-xl">
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-wide">
            MVE Admin
          </h1>
          <p className="text-base text-neutral-500">
            관리자 전용 로그인 페이지
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              이메일
            </label>
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full px-4 py-3 rounded-md border text-black border-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none placeholder-gray-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-300">
              비밀번호
            </label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full px-4 py-3 rounded-md border text-black border-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none placeholder-gray-400"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-neutral-800 text-white text-lg font-semibold py-3 rounded-md transition-colors duration-300"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
