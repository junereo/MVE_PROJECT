import { PrismaClient, AgeGroup, Genre } from '@prisma/client';
import { Request, Response } from 'express';
import * as userService from '../services/user.service';

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  const newUser = await userService.createUser(req.body);
  res.status(201).json(newUser);
};

export const getUsers = async (_: Request, res: Response) => {
  const users = await userService.getUsers();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await userService.getUserById(+req.params.id);
  res.json(user);
};

export const updateUser = async (id: number, data: any): Promise<void> => {
  await prisma.user.update({
    where: { id },
    data: {
      gender: !!data.gender,
      age: data.age as AgeGroup,
      genre: Array.isArray(data.genre) ? data.genre as Genre[] : [data.genre] as Genre[],
      job_domain: !!data.job_domain,
    },
  });
  return
};

export const deleteUser = async (req: Request, res: Response) => {
  await userService.deleteUser(+req.params.id);
  res.status(204).send();
};
