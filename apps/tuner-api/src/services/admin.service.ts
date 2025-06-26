import { PrismaClient, AdminRole, SurveyTags, QuestionType } from '@prisma/client';
import { signToken } from '../utils/jwt';
import type { CookieOptions } from 'express';
import { RegisterList, AdminRequest } from "../types/admin.types";


const prisma = new PrismaClient();

const defaultCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000,// 7일
};

export const login = async (email: string, password: string) => {
    const admin = await prisma.admin.findUnique({ where: { email } });
    console.log(admin);

    if (!admin) {
        throw new Error("존재하지 않는 관리자입니다.");
    }

    const isValid = password === admin.password;
    // const isValid = await authUilts.verifyPassword(password, admin.password);
    if (!isValid) {
        throw new Error("비밀번호가 일치하지 않습니다.");
    }

    // STEP 2: JWT 발급
    const token = signToken({ adminId: admin.id });
    return {
        token,
        admin,
        redirectUrl: process.env.CLIENT_ADMIN_IP || 'http://localhost:3000',
        cookieOptions: defaultCookieOptions,
    };
};


export const createAdmin = async (data: RegisterList) => {
    const isAdmin = await prisma.admin.findUnique({ where: { email: data.email } });
    if (isAdmin) throw new Error("이미 등록된 관리자 입니다");

    const role = data.role === 0 ? AdminRole.superadmin : AdminRole.admin;

    const newAdmin = await prisma.admin.create({
        data: {
            email: data.email,
            password: data.password,
            name: data.name,
            phone_number: data.phone_number,
            role
        }
    });
    return {
        id: newAdmin.id,
        email: newAdmin.email,
        name: newAdmin.name,
        phone_number: newAdmin.phone_number,
        role: newAdmin.role,
    }
}

export const getAdminService = async (req: AdminRequest) => {
    const adminId = (req as any).admin?.adminId;
    if (!adminId) throw new Error('인증되지 않은 사용자입니다.');

    const admin = await prisma.admin.findUnique({
        where: { id: adminId },
        select: {
            id: true,
            name: true,
            role: true
        },
    });

    if (!admin) throw new Error('관리자 정보를 찾을 수 없습니다.');

    return admin;
};

