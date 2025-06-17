
// 전역 으로 관리 되는 로그인 상태관리 
import { create } from 'zustand';

type AdminType = {
    id: number;
    email: string;
    name: string;
    role: 'admin' | 'superadmin';
};

type SessionState = {
    admin: AdminType | null;
    isLoading: boolean;
    isLoggedIn: boolean;
    setAdmin: (admin: AdminType) => void;
};

export const useSessionStore = create<SessionState>((set) => ({
    admin: null,
    isLoading: true,
    isLoggedIn: false,

    setAdmin: (admin) =>
        set({
            admin,
            isLoading: false,
            isLoggedIn: true,
        }),

}));
