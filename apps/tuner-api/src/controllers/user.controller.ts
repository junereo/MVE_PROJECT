import { Request, Response } from 'express';
import * as userService from '../services/user.service';

// User Controller
export const createUser = async (req: Request, res: Response) => {
  const newUser = await userService.createUser(req.body);
  res.status(201).json(newUser);
};

// Get all users
export const getUsers = async (_: Request, res: Response) => {
  const users = await userService.getUsers();
  res.json(users);
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  const user = await userService.getUserById(+req.params.id);
  res.json(user);
};

// Update user by ID
export const updateUser = async (req: Request, res: Response) => {
  const updatedUser = await userService.updateUser(+req.params.id, req.body);
  res.json(updatedUser);
};

// Delete user by ID
export const deleteUser = async (req: Request, res: Response) => {
  await userService.deleteUser(+req.params.id);
  res.status(204).send();
};