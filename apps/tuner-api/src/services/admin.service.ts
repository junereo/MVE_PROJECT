import { PrismaClient, AdminRole } from '@prisma/client';
import { signToken } from '../utils/jwt';
import type { CookieOptions } from 'express';

const prisma = new PrismaClient();

const defaultCookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,// 7일
};

export const login = async (email: string, password: string) => {
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
        throw new Error("존재하지 않는 관리자입니다.");
    }

    const isValid= password === admin.password;
    // const isValid = await authUilts.verifyPassword(password, admin.password);
    if (!isValid) {
        throw new Error("비밀번호가 일치하지 않습니다.");
    }

    // STEP 2: JWT 발급
    const token = signToken({ admin: admin.id });

    return {
        token,
        redirectUrl: process.env.CLIENT_IP || 'http://localhost:3000',
        cookieOptions: defaultCookieOptions,
    };
};


// // TODO: Implement admin service methods
// export const getDashboardData = async () => {
//     // Implementation will be added later
// };

// export const getUserManagementData = async () => {
//     // Implementation will be added later
// }; 