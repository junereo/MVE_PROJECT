import { PrismaClient, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

export const createTransaction = async (data: {
  user_id: number;
  type: TransactionType;
  amount: number;
  memo?: string;
}) => {
  return prisma.transaction.create({ data });
};

export const getTransactionsByUserId = async (userId: number) => {
  return prisma.transaction.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
  });
};
