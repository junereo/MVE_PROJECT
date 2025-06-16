import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { verifyPassword } from '../utils/auth.utils';



const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET!;

export const login = async (email: string, password: string) => {
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
        throw new Error("존재하지 않는 관리자입니다.");
    }

    const isValid = await verifyPassword(password, admin.password);
    if (!isValid) {
        throw new Error("비밀번호가 일치하지 않습니다.");
    }

    const token = jwt.sign(
        {
            adminId: admin.id,
            name: admin.name,
            role: admin.role,
        },
        jwtSecret,
        { expiresIn: '1d' }
    );

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