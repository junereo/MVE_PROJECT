import { PrismaClient } from '@prisma/client';
import { RegisterList, LoginResponse } from "../types/auth.types";
import jwt from 'jsonwebtoken';
import { hashPassword, verifyPassword } from '../utils/auth.utils';


const prisma = new PrismaClient();

export const register = async (data: RegisterList) => {
    const isUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (isUser) throw new Error("이미 가입된 이메일입니다.");

    const hashedPassword = await hashPassword(data.password);

    const newUser = await prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
            nickname: data.nickname,
            phone_number: data.phone_number,

        }
    });
    return {
        id: newUser.id,
        email: newUser.email,
        nickname: newUser.nickname,
        level: newUser.level
    };
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("가입되지 않은 이메일입니다.");
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
        throw new Error("비밀번호가 일치하지 않습니다.");
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET 환경 변수가 설정되지 않았습니다.');
    }

    const token = jwt.sign(
        {
            userId: user.id,
            nickname: user.nickname
        },
        jwtSecret!,
        { expiresIn: '1d' }
    );

    return {
        token,
        user: {
            id: user.id,
            nickname: user.nickname,
        }
    };
}; 