import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class TunerContractService {
  // POST: 새로운 컨트랙트 정보 저장
  async createContract(data: any) {
    return prisma['tunerContract'].create({
      data,
    });
  }

  // GET: 가장 최근 컨트랙트 정보 반환
  async getLatestContract() {
    return prisma['tunerContract'].findFirst({
      orderBy: { created_at: 'desc' },
    });
  }
} 