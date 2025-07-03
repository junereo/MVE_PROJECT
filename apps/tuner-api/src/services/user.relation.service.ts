import { PrismaClient } from '@prisma/client';
import { buildRelationOps } from '../utils/relationOps';

const prisma = new PrismaClient();

export async function buildUserRelationOperations(userId: number, data: any) {
  const ops: any[] = [];

  if (data.oauths) {
    ops.push(
      ...buildRelationOps(prisma.user_Oauth, 'userId', userId, data.oauths)
    );
  }

  if (data.transaction) {
    ops.push(
      ...buildRelationOps(prisma.transaction, 'user_id', userId, data.transaction)
    );
  }

  if (data.withdrawalRequest) {
    ops.push(
      ...buildRelationOps(prisma.withdrawalRequest, 'user_id', userId, data.withdrawalRequest)
    );
  }

  return ops;
}
