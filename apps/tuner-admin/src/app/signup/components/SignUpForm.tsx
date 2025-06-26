"use client";
import Link from "next/link";
import { AdminRole } from "@/types";
import axiosInstance from "@/lib/network/axios";
import { useState } from "react";
import {
  allSignupFields,
  validateSignupField,
} from "@/lib/authError/singupHandler";
import { SignupFormData, SignupFormErrors } from "@/types";
import { useRouter } from "next/navigation";
const SignUpForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    role: AdminRole.admin,
  });

  const [errors, setErrors] = useState<SignupFormErrors>({});

  const handleChange = (
    field: keyof SignupFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    const error = validateSignupField(field, value as string, {
      ...formData,
      [field]: value,
    });
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = allSignupFields(formData);

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err !== "");
    if (hasError) {
      alert("입력값을 다시 확인해주세요.");
      return;
    }

    try {
      const result = await pushOauth(formData);
      alert("회원가입이 완료되었습니다.");
      console.log("서버 응답:", result);
      router.push("/dashboard");
    } catch (error: any) {
      const status = error.response?.status;
      if (status === 400) {
        alert("입력한 정보를 다시 확인해주세요.");
      } else {
        alert("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

  const pushOauth = async (formData: SignupFormData) => {
    const { confirmPassword, ...payload } = formData;
    console.log(formData);

    const res = await axiosInstance.post("/admin/signup", payload);

    return res.data;
  };

  return (
    <div>
      <div className="pl-10 pb-10 text-xl font-bold ">Admin Signup</div>
      <div className="min-h-screen flex items-start justify-center">
        <div className="w-120 bg-black bg-opacity-80 p-8 rounded-lg shadow-md text-white">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl font-semibold text-white pb-2">SignUp</h2>
            <hr className="w-full border-white pt-6 border-t-2" />
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <input
                type="text"
                placeholder="이름을 입력해주세요"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 border-b border-gray-300 focus:outline-none"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 border-b border-gray-300 focus:outline-none"
              />
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="비밀 번호"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 border-b border-gray-300 focus:outline-none"
              />
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <input
                type="password"
                placeholder="비밀번호 확인"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 border-b border-gray-300 focus:outline-none"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                placeholder="휴대전화 번호 ('-' 제외)"
                value={formData.phone_number}
                onChange={(e) => handleChange("phone_number", e.target.value)}
                className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 border-b border-gray-300 focus:outline-none"
              />
              {errors.phone_number && (
                <p className="text-sm text-red-400 mt-1">
                  {errors.phone_number}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between gap-4 mt-6">
              <span className="text-sm text-gray-300 font-medium">
                🛡 관리자 권한 설정
              </span>
              <div className="flex gap-3">
                <label
                  className={`cursor-pointer px-4 py-2 rounded border text-sm font-semibold flex items-center gap-1 transition
                  ${
                    formData.role === 1
                      ? "bg-white text-black border-white shadow"
                      : "bg-transparent text-white border-gray-400 hover:border-white"
                  }
                `}
                >
                  <input
                    type="radio"
                    name="role"
                    value="1"
                    className="hidden"
                    onChange={() => handleChange("role", AdminRole.admin)}
                    checked={formData.role === 1}
                  />
                  {formData.role === 1} admin
                </label>

                <label
                  className={`cursor-pointer px-4 py-2 rounded border text-sm font-semibold flex items-center gap-1 transition
                    ${
                      formData.role === 0
                        ? "bg-white text-black border-white shadow"
                        : "bg-transparent text-white border-gray-400 hover:border-white"
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="role"
                    value="0"
                    className="hidden"
                    onChange={() => handleChange("role", AdminRole.superadmin)} // ✅ 숫자로
                    checked={formData.role === 0}
                  />
                  {formData.role === 0} Superadmin
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#888888] py-2 rounded font-semibold hover:bg-[#726d6d]"
            >
              가입하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
