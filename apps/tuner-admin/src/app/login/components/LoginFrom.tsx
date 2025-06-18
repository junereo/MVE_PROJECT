'use client';
import { useRouter } from 'next/navigation';
import { useOauth } from '@/store/globalStore';
// import { useSessionCheck } from '@/hooks/useSessionCheck';
import { pushLogin } from '@/lib/network/api';
import { useState } from 'react';

const LoginFrom = () => {
    const router = useRouter();

    const { setValue } = useOauth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // 이거 전역 상태로 관리하지 마 내부 컴포넌트 상태로 관리
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('로그인 전송할 값:', { email, password });
        // 매번 사이트마다 요청 떄리는 게 절때 아니야,

        const formData = { email, password };

        try {
            const result = await pushLogin(formData);
            console.log('서버 응답:', result.admin);

            setValue('name', result.admin.name);
            setValue('email', result.email);
            setValue('password', result.password);
            setValue('phone_number', result.phone_number);
            setValue('role', result.admin.role);

            router.push('/dashboard');
        } catch (error) {
            alert('로그인 실패하였습니다.');
            console.error('요청 실패:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center flex-col bg-[#eaedf1] gap-8">
            <div className="text-6xl font-medium text-[#0e0e0e]">
                MVE-Admin-Page
            </div>
            <div className="w-96 bg-black bg-opacity-80 p-8 rounded-lg shadow-md text-white">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">LOGO</span>
                    </div>
                    <h2 className="text-2xl font-semibold">Sign in</h2>
                    <hr className="w-full my-4 border-white/40" />
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-500"
                    />
                    <button
                        type="submit"
                        className="w-full bg-[#4a6ea9] py-2 rounded font-semibold hover:bg-[#3d5e93]"
                    >
                        Login
                    </button>
                    {/* <div className="text-5xl text-red-600">{name}</div> */}
                </form>
                <div className="mt-4 text-center text-sm text-white/80">
                    Not registered?{' '}
                    <a href="#" className="underline text-white">
                        Create an account!
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginFrom;
