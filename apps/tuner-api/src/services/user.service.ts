import { PrismaClient, UserRole, Genre, AgeGroup } from '@prisma/client';
import { buildUserRelationOperations } from './user.relation.service';
import { hashPassword } from '../utils/auth.utils'; // 너네 해시 함수 경로 맞게 바꿔

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
  // ✅ genre 안전 처리
  let genreArray: Genre[] = [];
  if (Array.isArray(data.genre)) {
    genreArray = data.genre.slice(0, 3);
  } else if (typeof data.genre === 'string') {
    genreArray = [data.genre];
  }

  // ✅ Boolean 안전 처리
  let updateData: any = {
    email: data.email,
    phone_number: data.phone_number,
    nickname: data.nickname,
    gender: data.gender === true ? true : false,
    age: data.age as AgeGroup,
    genre: genreArray,
    job_domain: data.job_domain === true ? true : false,
    wallet_address: data.wallet_address,
    role: data.role || UserRole.ordinary,
  };

  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }

  // ✅ 기본 update
  const basicUpdate = prisma.user.update({
    where: { id },
    data: updateData,
  });

  // ✅ 관계 연산 — 순환참조 주의
  const relationOps = await buildUserRelationOperations(id, data);

  // ✅ 트랜잭션 처리
  await prisma.$transaction([basicUpdate, ...relationOps]);

  // ✅ 필요할 때만 select
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
      // ⚠️ 너무 깊게 include 하지 않기! 필요하다면 depth 줄여야함
      oauths: true,
    },
  });
};


export const deleteUser = async (id: number) => {
  return prisma.user.delete({
    where: { id },
  });
};
