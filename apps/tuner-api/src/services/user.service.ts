import { PrismaClient, UserRole } from '@prisma/client';
import { buildUserRelationOperations } from './user.relation.service';

const prisma = new PrismaClient();

export const createUser = async (data: any) => {
  return prisma.user.create({
    data: {
      email: data.email,
      password: data.password,
      phone_number: data.phone_number,
      nickname: data.nickname,
      gender: data.gender,
      age: data.age,
      genre: data.genre,
      job_domain: data.job_domain,
      wallet_address: data.wallet_address,
      simple_password: data.simple_password,
      role: data.role || UserRole.ordinary,
    }
  });
};

export const getUsers = async () => {
  return prisma.user.findMany({
    include: {
      oauths: true,
      surveys: true,
      surveyResponses: true,
      transaction: true,
      withdrawalRequest: true
    }
  });
};

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    include: {
      oauths: true,
      surveys: true,
      surveyResponses: true,
      transaction: true,
      withdrawalRequest: true
    }
  });
};

export const updateUser = async (id: number, data: any) => {

  console.log(id);
  const basicUpdate = prisma.user.update({
    where: { id },
    data: {
      email: data.email,
      password: data.password,
      phone_number: data.phone_number,
      nickname: data.nickname,
      gender: data.gender,
      age: data.age,
      genre: data.genre,
      job_domain: data.job_domain,
      wallet_address: data.wallet_address,
      simple_password: data.simple_password,
      role: data.role,
    },
  });

  const relationOps = await buildUserRelationOperations(id, data);

  await prisma.$transaction([basicUpdate, ...relationOps]);

  return prisma.user.findUnique({ where: { id } });
};

export const deleteUser = async (id: number) => {
  return prisma.user.delete({
    where: { id },
  });
};
