import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllSettingsService = async () => {
  return prisma.setting.findMany();
};

export const upsertSettingService = async (key: string, value: string) => {
  return prisma.setting.upsert({
    where: { key },
    update: { value },
    create: {
      key,
      value,
    },
  });
};