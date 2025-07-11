import { PrismaClient } from '@prisma/client';
import { buildRelationOps } from '../utils/relationOps';

const prisma = new PrismaClient();

export async function buildUserRelationOperations(userId: number, data: any) {
  const ops: any[] = [];

  if (Array.isArray(data.oauths) && data.oauths.length > 0) {
    ops.push(
      ...buildRelationOps(prisma.user_Oauth, 'userId', userId, data.oauths)
    );
  }

  if (Array.isArray(data.transaction) && data.transaction.length > 0) {
    ops.push(
      ...buildRelationOps(prisma.transaction, 'user_id', userId, data.transaction)
    );
  }

  if (Array.isArray(data.withdrawalRequest) && data.withdrawalRequest.length > 0) {
    ops.push(
      ...buildRelationOps(prisma.withdrawalRequest, 'user_id', userId, data.withdrawalRequest)
    );
  }

  return ops;
}

