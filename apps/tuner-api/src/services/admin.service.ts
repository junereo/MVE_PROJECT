import { PrismaClient, AdminRole } from '@prisma/client';
import { authUilts, jwtUilts } from "../utils/index";

const prisma = new PrismaClient();

export const login = async (email: string, password: string) => {
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
        throw new Error("존재하지 않는 관리자입니다.");
    }

    const isValid = await authUilts.verifyPassword(password, admin.password);
    if (!isValid) {
        throw new Error("비밀번호가 일치하지 않습니다.");
    }

    const token = jwtUilts.signToken({
        id: admin.id,
        role: admin.role,
        email: admin.email,
    });

    return {
        token,
        admin: {
            id: admin.id,
            name: admin.name,
            role: admin.role,
        },
    };
};


// // TODO: Implement admin service methods
// export const getDashboardData = async () => {
//     // Implementation will be added later
// };

// export const getUserManagementData = async () => {
//     // Implementation will be added later
// }; 