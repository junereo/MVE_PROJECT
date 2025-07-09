/**
 * prisma/ca.seed.ts
 * 실행: npx tsx prisma/ca.seed.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const metaContractAddress = process.env.META_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
    const surveyContractAddress = process.env.SURVEY_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

    // 기본 ERC20 Transfer 함수 예시 ABI (원하는 대로 교체)
    const basicABI = [
        {
            "inputs": [
                { "internalType": "address", "name": "to", "type": "address" },
                { "internalType": "uint256", "name": "amount", "type": "uint256" }
            ],
            "name": "transfer",
            "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    await prisma.tunerContract.upsert({
        where: { id: 1 }, // 있으면 update, 없으면 create
        update: {
            ca_transac: metaContractAddress,
            ca_survey: surveyContractAddress,
            abi_transac: basicABI,  // ✅ 반드시 배열!
            abi_survey: [],         // 필요하면 survey용 ABI로 교체
            abi_badge: [],          // 필요하면 badge용 ABI로 교체
        },
        create: {
            ca_transac: metaContractAddress,
            ca_survey: surveyContractAddress,
            ca_token: null,
            ca_badge: null,
            abi_transac: basicABI,
            abi_survey: [],
            abi_badge: [],
        },
    });

    console.log('TunerContract seed complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
