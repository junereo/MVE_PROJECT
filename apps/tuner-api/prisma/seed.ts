import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash("test1234", 10);

    const admin = await prisma.user.create({
        data: {
            email: "test@naver.com",
            password: hashedPassword,
            nickname: "슈퍼관리자",
            phone_number: "01012341234",
            role: "superadmin",
        },
    });

    console.log("초기 관리자 생성:", admin);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
