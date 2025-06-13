import { PrismaClient, UserLevel } from '@prisma/client';

const prisma = new PrismaClient();

export interface User {
    id: number;
    email: string;
    password: string;
    nickname: string;
    phone_number: string;
    wallet_address?: string;
    level: UserLevel;
    badge_issued_at?: Date;
    created_at: Date;
    updated_at: Date;
}

export interface UserOAuth {
    id: number;
    user_id: number;
    provider: string;
    provider_id: string;
    email: string;
    profile_image?: string;
    created_at: Date;
    updated_at: Date;
}

// Prisma 모델과의 매핑
export const UserModel = prisma.user;
export const UserOAuthModel = prisma.user_OAuth; 