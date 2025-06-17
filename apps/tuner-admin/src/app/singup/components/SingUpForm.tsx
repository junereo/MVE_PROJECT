'use client';
import Link from 'next/link';
// import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../../lib/network/axios';
import { useOauth } from '@/store/globalStore';
import { useState } from 'react';

const SingUpForm = () => {
    const { setValue } = useOauth();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [role, setRole] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 비밀번호 중복검사
        if (password !== confirmPassword) {
            alert('비밀번호가 다릅니다.');
            console.log('비밀번호가 다릅니다.');
            return;
        }

        // 숫자 자릿수 중복검사
        if (phoneNumber && phoneNumber.length !== 11) {
            alert('숫자 11자리를 입력해주세요');
            console.log('숫자 11자리를 입력해주세요');
            return;
        }
        console.log('전송할 값:', { name, email, password, phoneNumber, role });

        const formData = {
            name,
            email,
            password,
            phone_number: phoneNumber,
            role,
        };
        try {
            const result = await pushOauth(formData);
            console.log('서버 응답:', result);
        } catch (error) {
            console.error('요청 실패:', error);
        }
    };

    const pushOauth = async (formData: any) => {
        const res = await axiosInstance.post('/admin/Register', formData);
        return res.data;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#ffffff]">
            <div className="w-96 bg-black bg-opacity-80 p-8 rounded-lg shadow-md text-white">
                <div className="flex flex-col items-center mb-6">
                    <h2 className="text-2xl font-semibold text-white pb-2">
                        Sing Up
                    </h2>
                    <hr className="w-full border-black  pt-6 border-t-2" />
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="이름을 입력해주세요"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 border-b border-b-neutral-900 border-t-0 border-l-0 border-r-0"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 border-b border-b-neutral-900 border-t-0 border-l-0 border-r-0"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="비밀 번호"
                        className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400  border-b border-b-neutral-900 border-t-0 border-l-0 border-r-0"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="비밀번호 확인"
                        className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400  border-b border-b-neutral-900 border-t-0 border-l-0 border-r-0"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="휴대전화 번호 ('-'제외)"
                        className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 border-b border-b-neutral-900 border-t-0 border-l-0 border-r-0"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />

                    <div className="flex items-center justify-end gap-4">
                        <div className="text-[#ff3131]">관리자 권한 설정</div>
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                value="admin"
                                onChange={(e) => setRole(e.target.value)}
                                className="accent-black"
                            />
                            <span>admin</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                value="superadmin"
                                onChange={(e) => setRole(e.target.value)}
                                className="accent-black"
                            />
                            <span>superadmin</span>
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#4a6ea9] py-2 rounded font-semibold hover:bg-[#3d5e93]"
                    >
                        가입하기
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-white/80">
                    Not registered?{' '}
                    <a href="#" className="underline text-white">
                        Create an account!
                    </a>
                </div>
                <Link href="/login" className="underline text-white">
                    로그인하러 가기!
                </Link>
            </div>
        </div>
    );
};

export default SingUpForm;
