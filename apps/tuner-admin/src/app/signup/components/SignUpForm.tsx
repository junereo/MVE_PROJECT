'use client';

import { AdminRole } from '@/types';
import axiosInstance from '@/lib/network/axios';
import { useState } from 'react';
import { AxiosError } from 'axios';
import {
    allSignupFields,
    validateSignupField,
} from '@/lib/authError/singupHandler';
import { SignupFormData, SignupFormErrors } from '@/types';
import { useRouter } from 'next/navigation';

const SignUpForm = () => {
    const router = useRouter();
    const [formData, setFormData] = useState<SignupFormData>({
        nickname: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone_number: '',
        role: AdminRole.admin,
    });

    const [errors, setErrors] = useState<SignupFormErrors>({});

    const handleChange = (
        field: keyof SignupFormData,
        value: string | number,
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
        const hasError = Object.values(newErrors).some((err) => err !== '');
        if (hasError) {
            alert('입력값을 다시 확인해주세요.');
            return;
        }

        try {
            const result = await pushOauth(formData);
            console.log(result);
            alert('회원가입이 완료되었습니다.');
            router.push('/dashboard');
        } catch (error) {
            const err = error as AxiosError;
            const status = err.response?.status as number;
            if (status === 400) {
                alert('입력한 정보를 다시 확인해주세요.');
            } else {
                alert('회원가입 중 오류가 발생했습니다.');
            }
        }
    };

    const pushOauth = async (formData: SignupFormData) => {
        const res = await axiosInstance.post('/auth/signup', formData, {
            withCredentials: false,
        });
        return res.data;
    };

    return (
        <div>
            <div className="w-full  text-black text-2xl py-3  font-bold">
                Tunemate Sing Up
            </div>
            <div className="flex justify-center py-2 px-4">
                <div className="w-full max-w-md bg-black text-white p-8 rounded-2xl shadow-xl">
                    <div className="flex flex-col items-center mb-6">
                        <h1 className="text-3xl font-extrabold text-white mb-2 tracking-wide">
                            Tunemate Sign Up
                        </h1>
                        <p className="text-sm text-neutral-500">
                            관리자 전용 회원가입 페이지
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* 이름 */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-300">
                                닉네임
                            </label>
                            <input
                                type="text"
                                placeholder="이름을 입력해주세요"
                                value={formData.nickname}
                                onChange={(e) =>
                                    handleChange('nickname', e.target.value)
                                }
                                className="w-full px-4 py-2.5 rounded-md border text-black border-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none placeholder-gray-400"
                            />
                        </div>

                        {/* 이메일 */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-300">
                                이메일
                            </label>
                            <input
                                type="email"
                                placeholder="이메일을 입력해주세요"
                                value={formData.email}
                                onChange={(e) =>
                                    handleChange('email', e.target.value)
                                }
                                className="w-full px-4 py-2.5 rounded-md border text-black border-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none placeholder-gray-400"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* 비밀번호 */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-300">
                                비밀번호
                            </label>
                            <input
                                type="password"
                                placeholder="비밀번호를 입력해주세요"
                                value={formData.password}
                                onChange={(e) =>
                                    handleChange('password', e.target.value)
                                }
                                className="w-full px-4 py-2.5 rounded-md border text-black border-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none placeholder-gray-400"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* 비밀번호 확인 */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-300">
                                비밀번호 확인
                            </label>
                            <input
                                type="password"
                                placeholder="비밀번호를 다시 입력해주세요"
                                value={formData.confirmPassword}
                                onChange={(e) =>
                                    handleChange(
                                        'confirmPassword',
                                        e.target.value,
                                    )
                                }
                                className="w-full px-4 py-2.5 rounded-md border text-black border-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none placeholder-gray-400"
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* 휴대전화 */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-300">
                                휴대전화 번호
                            </label>
                            <input
                                type="text"
                                placeholder="'-' 제외한 번호만 입력"
                                value={formData.phone_number}
                                onChange={(e) =>
                                    handleChange('phone_number', e.target.value)
                                }
                                className="w-full px-4 py-2.5 rounded-md border text-black border-gray-300 focus:ring-2 focus:ring-gray-600 focus:outline-none placeholder-gray-400"
                            />
                            {errors.phone_number && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.phone_number}
                                </p>
                            )}
                        </div>

                        {/* 관리자 권한 */}
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-300">
                                🛡 관리자 권한 설정
                            </label>
                            <div className="flex gap-3">
                                <label
                                    className={`cursor-pointer px-4 py-2 rounded-md border text-sm font-semibold transition ${
                                        formData.role === AdminRole.admin
                                            ? 'bg-white text-black border-white'
                                            : 'border-gray-400 text-white'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        className="hidden"
                                        onChange={() =>
                                            handleChange(
                                                'role',
                                                AdminRole.admin,
                                            )
                                        }
                                        checked={
                                            formData.role === AdminRole.admin
                                        }
                                    />
                                    admin
                                </label>
                                <label
                                    className={`cursor-pointer px-4 py-2 rounded-md border text-sm font-semibold transition ${
                                        formData.role === AdminRole.superadmin
                                            ? 'bg-white text-black border-white'
                                            : 'border-gray-400 text-white'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        className="hidden"
                                        onChange={() =>
                                            handleChange(
                                                'role',
                                                AdminRole.superadmin,
                                            )
                                        }
                                        checked={
                                            formData.role ===
                                            AdminRole.superadmin
                                        }
                                    />
                                    Superadmin
                                </label>
                            </div>
                        </div>

                        {/* 가입 버튼 */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-800 text-white text-lg font-semibold py-2.5 rounded-md transition-colors duration-300"
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
