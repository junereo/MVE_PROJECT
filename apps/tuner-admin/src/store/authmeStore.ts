// src/store/useSessionStore.ts
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
    logout: () => void;
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
    logout: () =>
        set({
            admin: null,
            isLoading: false,
            isLoggedIn: false,
        }),
}));
