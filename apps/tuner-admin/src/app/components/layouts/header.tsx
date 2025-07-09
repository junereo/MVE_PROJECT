'use client';

import { useEffect, useState } from 'react';
import { useSessionStore } from '@/store/useAuthmeStore';
import { usePathname, useRouter } from 'next/navigation';
import Button from '../ui/Button';
import { LogOut } from '@/lib/network/api';
import ReusableModal from '../ui/modal';

export default function Header() {
    const { logout, user } = useSessionStore();
    const [showModal, setShowModal] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        setShowModal(false);
    }, [pathname]);

    const handleLogoutConfirm = () => {
        LogOut();
        logout();
        router.push('/login');
    };

    return (
        <>
            <div
                className="
        fixed top-0 left-[7%] right-[1%] h-[64px] z-30 rounded-lg border shadow
        bg-[#EBEBEB] flex justify-between items-center px-6 shadow
      "
            >
                <div className="p-botext-xl font-bold text-gray-800">
                    관리자 대시보드
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-green-600">ID: {user?.role}</span>
                    <span className="text-green-600">
                        닉네임: {user?.nickname}
                    </span>
                    <Button color="blue" onClick={() => setShowModal(true)}>
                        LogOut
                    </Button>
                </div>
            </div>

            <ReusableModal
                isOpen={showModal}
                title="정말 로그아웃 하시겠습니까?"
                onClose={() => setShowModal(false)}
                onConfirm={handleLogoutConfirm}
            />
        </>
    );
}
