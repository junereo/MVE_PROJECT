// src/pages/Login.tsx (Next.js app router면 app/login/page.tsx 처럼 위치만 바꿔줘)

const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#d946ef] via-[#9f7aea] to-[#4f46e5] p-4">
            {/* 카드 */}
            <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-xl flex flex-col md:flex-row">
                {/* 왼쪽 아트 영역 */}
                <div className="relative flex-1 min-h-[350px] md:min-h-full">
                    {/* 배경 그래디언트 물결 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a] via-[#6366f1] to-[#06b6d4] opacity-90" />
                    {/* 유리효과 오브젝트(블러 원) */}
                    <div className="absolute -top-8 left-8 w-24 h-24 bg-white/30 backdrop-blur-md rounded-full" />
                    <div className="absolute bottom-8 right-8 w-28 h-28 bg-white/20 backdrop-blur-md rounded-full" />
                    {/* welcome 텍스트 */}
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-white p-8 text-center">
                        <h1 className="text-4xl font-semibold mb-2">Welcome Page</h1>
                        <p className="opacity-80">Sign in To Your Account</p>
                    </div>
                    {/* 하단 URL */}
                    <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm tracking-widest text-white/90">
                        WWW.YOURSITE.COM
                    </p>
                </div>

                {/* 오른쪽 로그인 폼 */}
                <div className="w-full md:w-[400px] p-8 flex flex-col justify-center gap-6">
                    <div>
                        <p className="text-lg">Hello !</p>
                        <p className="text-xl font-semibold text-violet-600">
                            Good Morning
                        </p>
                        <p className="mt-4">
                            <span className="font-semibold text-indigo-600">Login</span> Your
                            Account
                        </p>
                    </div>

                    <form className="flex flex-col gap-4">
                        <div>
                            <label className="text-xs tracking-widest text-gray-500">
                                EMAIL ADDRESS
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full border-b-2 border-transparent focus:border-indigo-500 outline-none py-2 placeholder-gray-400"
                            />
                        </div>

                        <div>
                            <label className="text-xs tracking-widest text-gray-500">
                                PASSWORD
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full border-b-2 border-transparent focus:border-indigo-500 outline-none py-2 placeholder-gray-400"
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="accent-indigo-600" />
                                Remember
                            </label>
                            <a href="#" className="text-indigo-600 hover:underline">
                                Forgot Password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 rounded-md text-white font-semibold tracking-widest
                         bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#ec4899]
                         hover:brightness-110 transition"
                        >
                            SUBMIT
                        </button>
                    </form>

                    <p className="text-center text-sm">Create Account</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
