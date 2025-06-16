// src/store/useSessionStore.ts
import { create } from 'zustand';

type UserType = {
    id: number;
    email: string;
    nickname: string;
    role: 'admin' | 'superadmin';
};

type SessionState = {
    user: UserType | null;
    isLoading: boolean;
    isLoggedIn: boolean;
    setUser: (user: UserType) => void;
    logout: () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
    user: null,
    isLoading: true,
    isLoggedIn: false,

    setUser: (user) =>
        set({
            user,
            isLoading: false,
            isLoggedIn: true,
        }),

    logout: () =>
        set({
            user: null,
            isLoading: false,
            isLoggedIn: false,
        }),
}));
