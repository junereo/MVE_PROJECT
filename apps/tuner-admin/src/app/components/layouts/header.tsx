'use client';

import { useEffect, useState } from 'react';
import { useSessionStore } from '@/store/authmeStore';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import { LogOut } from '@/lib/network/api';
import ReusableModal from '../ui/modal';

export default function Header() {
    const { logout, admin } = useSessionStore();
    console.log(admin);

    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    const handleLogoutConfirm = () => {
        LogOut();
        logout();
        router.push('/login');
    };

    const pathname = usePathname();

    useEffect(() => {
        // 페이지 변경시 모달창 종료
        setShowModal(false);
    }, [pathname]);

    return (
        <>
            <div className="fixed top-0 left-[8%] w-[92%] h-[60px] gap-3 bg-white text-white z-40 flex items-center justify-end px-6">
                <div className="flex gap-5">
                    <div className="text-2xl text-green-600">
                        권한:{admin?.id}
                    </div>
                    <div className="text-2xl text-green-600">
                        닉네임:{admin?.name}
                    </div>
                </div>
                <Button color="blue" onClick={() => setShowModal(true)}>
                    LogOut
                </Button>
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
