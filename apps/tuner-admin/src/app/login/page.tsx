"use client";
import TabMenu from "./store/button";

const Login = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#eaedf1]">
            <div className="w-96 bg-[#a2b8d6] bg-opacity-80 p-8 rounded-lg shadow-md text-white">
                <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl"></span>
                    </div>
                    <h2 className="text-2xl font-semibold">Sign in</h2>
                    <hr className="w-full my-4 border-white/40" />
                </div>
                <form className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-500"
                    />
                    <div className="text-black"></div>
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-500"
                    />
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
                <TabMenu />
            </div>
        </div>
    );
};

export default Login;
