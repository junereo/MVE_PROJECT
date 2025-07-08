import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createWithdraw = async (user_id: number, amount: number, txhash: string) => {
  return await prisma.withdrawalRequest.create({
    data: {
      user_id,
      amount,
      txhash,
      status: 'pending',
    },
  });
};

export const findWithdrawByUserId = async (user_id: number) => {
  return await prisma.withdrawalRequest.findMany({
    where: { user_id },
    orderBy: { requested_at: 'desc' },
  });
};

export const updateWithdrawStatus = async (user_id: number, status: 'completed' | 'failed', txhash: string) => {
  return await prisma.withdrawalRequest.updateMany({
    where: {
      user_id,
      status: 'pending',
    },
    data: {
      status,
      txhash,
    },
  });
}; 