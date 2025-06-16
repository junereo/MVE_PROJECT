import { PrismaClient } from '@prisma/client';
import { AdminRole } from '@prisma/client';

const prisma = new PrismaClient();

export const createAdmin = async () => {
    const newaAdmin = await prisma.admin.create({
        data: {
            email: "test@naver.com",
            password: "test1234",
            name: "테스트관리자",
            role: AdminRole.superadmin
        },
    });

    console.log("새 슈퍼관리자 생성됨:", newaAdmin);
};


// // TODO: Implement admin service methods
// export const getDashboardData = async () => {
//     // Implementation will be added later
// };

// export const getUserManagementData = async () => {
//     // Implementation will be added later
// }; 