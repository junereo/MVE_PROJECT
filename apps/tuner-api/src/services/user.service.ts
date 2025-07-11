import { PrismaClient, UserRole } from '@prisma/client';
import { buildUserRelationOperations } from './user.relation.service';
import { hashPassword } from '../utils/auth.utils';

const prisma = new PrismaClient();

export const createUser = async (data: any) => {
  const hashedPassword = await hashPassword(data.password);

  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      phone_number: data.phone_number,
      nickname: data.nickname,
      gender: data.gender,
      age: data.age,
      genre: data.genre,
      job_domain: data.job_domain,
      wallet_address: data.wallet_address,
      role: data.role || UserRole.ordinary,
    },
    select: {
      id: true,
      email: true,
      phone_number: true,
      nickname: true,
      gender: true,
      age: true,
      genre: true,
      job_domain: true,
      wallet_address: true,
      role: true,
      created_at: true,
      updated_at: true,
    },
  });
};

export const getUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      phone_number: true,
      nickname: true,
      gender: true,
      age: true,
      genre: true,
      job_domain: true,
      wallet_address: true,
      role: true,
      created_at: true,
      updated_at: true,
      oauths: true,
      surveys: true,
      surveyResponses: true,
      transaction: true,
      withdrawalRequest: true,
    },
  });
};

export const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      phone_number: true,
      nickname: true,
      gender: true,
      age: true,
      genre: true,
      job_domain: true,
      wallet_address: true,
      role: true,
      created_at: true,
      updated_at: true,
      oauths: true,
      surveys: true,
      surveyResponses: true,
      transaction: true,
      withdrawalRequest: true,
    },
  });
};

export const updateUser = async (id: number, data: any) => {
  let updateData: any = {
    email: data.email,
    phone_number: data.phone_number,
    nickname: data.nickname,
    gender: data.gender,
    age: data.age,
    genre: data.genre,
    job_domain: data.job_domain,
    wallet_address: data.wallet_address,
    role: data.role,
  };

  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }

  const basicUpdate = prisma.user.update({
    where: { id },
    data: updateData,
  });

  const relationOps = await buildUserRelationOperations(id, data);

  await prisma.$transaction([basicUpdate, ...relationOps]);

  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      phone_number: true,
      nickname: true,
      gender: true,
      age: true,
      genre: true,
      job_domain: true,
      wallet_address: true,
      role: true,
      created_at: true,
      updated_at: true,
      oauths: true,
      surveys: true,
      surveyResponses: true,
      transaction: true,
      withdrawalRequest: true,
    },
  });
};

export const deleteUser = async (id: number) => {
  return prisma.user.delete({
    where: { id },
  });
};