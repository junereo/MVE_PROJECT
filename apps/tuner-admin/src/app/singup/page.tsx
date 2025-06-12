"use client";
// import TabMenu from "./store/button";

const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#eaedf1]">
            <div className="w-96 bg-[#a2b8d6] bg-opacity-80 p-8 rounded-lg shadow-md text-white">
                <div className="flex flex-col items-center mb-6">

                    <h2 className="text-2xl font-semibold text-black">회원 가입</h2>
                    <hr className="w-full border-black pt-4" />
                </div>
                <form className="space-y-4">
                    <input
                        type="text"
                        placeholder="이름을 입력해주세요"
                        className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 border-b border-b-neutral-900 border-t-0 border-l-0 border-r-0"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 border-b border-b-neutral-900 border-t-0 border-l-0 border-r-0"
                    />
                    <input
                        type="password"
                        placeholder="비밀 번호"
                        className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400  border-b-neutral-900 border-t-0 border-l-0 border-r-0"
                    />
                    <input
                        type="password"
                        placeholder="비밀번호 확인"
                        className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400  border-b-neutral-900 border-t-0 border-l-0 border-r-0"
                    />
                    <input
                        type="password"
                        placeholder="휴대전화 번호 ('-'제외)"
                        className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 border-b-neutral-900 border-t-0 border-l-0 border-r-0"
                    />
                    <div className="flex items-center justify-end gap-4">
                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                className="accent-black"
                            />
                            <span>남성</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                className="accent-black"
                            />
                            <span>여성</span>
                        </label>
                    </div>
                    <button className="w-full bg-[#4a6ea9] py-2 rounded font-semibold hover:bg-[#3d5e93]">
                        Login
                    </button>
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

export default Login;
