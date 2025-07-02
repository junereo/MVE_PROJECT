import type { UserRole } from "@prisma/client";
import bcrypt from "bcrypt"

export const hashPassword = (plain: string) => bcrypt.hash(plain, 10);

export const verifyPassword = async (plain: string, hashed: string) => {
    return bcrypt.compare(plain, hashed);
};

export const mapRoleEnum = (roleNumber: number): UserRole => {
    switch (roleNumber) {
        case 0: return 'superadmin';
        case 1: return 'admin';
        case 3: return 'ordinary';
        case 4: return 'expert';
        default: throw new Error('유효하지 않은 역할 번호입니다.');
    }
};


export default {
    hashPassword,
    verifyPassword,
    mapRoleEnum
};