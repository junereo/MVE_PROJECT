"use client";
import { AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { pushLogin } from "@/lib/network/api"; // 서버 요청 함수
import {
  validateLoginField,
  allLoginFields,
} from "@/lib/authError/loginHandler"; // 네가 만든 함수
import { LoginFormData, LoginFormErrors } from "@/types";

const LoginForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [erros, setErrors] = useState<LoginFormErrors>({});
  console.log(erros);

  const handleChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    const error = validateLoginField(field, value, formData);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 전체 유효성 검사
    const newErrors = allLoginFields(formData);
    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err !== "");
    if (hasError) {
      alert("입력값을 다시 확인해주세요.");
      return;
    }

    try {
      const result = await pushLogin(formData);
      console.log("서버 응답:", result.admin);
      router.push("/dashboard");
    } catch (error) {
      const err = error as AxiosError;
      const status = err.response?.status as number;
      if (status === 401) {
        throw new Error("이메일 또는 비밀번호가 일치하지 않습니다.");
      } else {
        throw new Error("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-start flex-col gap-8">
      <div className="text-6xl font-medium text-[#0e0e0e]">MVE-Admin-Page</div>
      <div className="w-96 bg-black bg-opacity-80 p-8 rounded-lg shadow-md text-white">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 bg-[#888888] rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">LOGO</span>
          </div>
          <h2 className="text-2xl font-semibold">Sign in</h2>
          <hr className="w-full my-4 border-white/40" />
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-500"
          />
          <button
            type="submit"
            className="w-full bg-[#888888] py-2 rounded font-semibold hover:bg-[#726d6d]"
          >
            Login
          </button>
          {/* <div className="text-5xl text-red-600">{name}</div> */}
        </form>
        <div className="mt-4 text-center text-sm text-white/80">
          Not registered?{" "}
          <a href="#" className="underline text-white">
            Create an account!
          </a>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
