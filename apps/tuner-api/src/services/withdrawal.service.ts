import { PrismaClient, WithdrawalStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const createWithdrawalRequest = async (data: {
  user_id: number;
  amount: number;
  txhash: string;
  status: WithdrawalStatus;
  message: string;
  signature: string;
}) => {
  return prisma.withdrawalRequest.create({ data });
};

export const getWithdrawalsByUserId = async (userId: number) => {
  return prisma.withdrawalRequest.findMany({
    where: { user_id: userId },
    orderBy: { requested_at: 'desc' },
  });
};