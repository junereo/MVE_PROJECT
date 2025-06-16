"use client"
import { useSessionStore } from "@/store/authmeStore";
import { useRouter } from "next/navigation";
import { useSessionCheck } from "@/hooks/useSessionCheck";
const Dashboard = () => {

    // 로그인 세션유지
    useSessionCheck(); // 클라이언트 훅 호출

    return (
        <div className="w-full h-screen bg-[#a2b8d6]">
            <div className="w-full bg-black text-white text-6xl py-3 pl-8">
                dashboad
            </div>
            <div>
                <div className="flex gap-3 justify-center ">
                    <div className="w-[100px] bg-white text-center">1</div>
                    <div className="w-[100px] bg-white text-center">2</div>
                    <div className="w-[100px] bg-white text-center">3</div>
                    <div className="w-[100px] bg-white text-center">4</div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
