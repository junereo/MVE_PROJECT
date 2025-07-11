import { Request, Response } from 'express';
import * as userService from '../services/user.service';

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

export const updateUser = async (req: Request, res: Response) => {
  const updatedUser = await userService.updateUser(+req.params.id, req.body);
  res.json(updatedUser);
};

export const deleteUser = async (req: Request, res: Response) => {
  await userService.deleteUser(+req.params.id);
  res.status(204).send();
};