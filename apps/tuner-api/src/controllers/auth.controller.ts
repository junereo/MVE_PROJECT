import { Request, Response } from "express";
import {
  emailRegister as registerServices,
  emaillogin as loginServices,
  oauthCallbackService as authServices,
  getCurrentUserService as userServices
} from "../services/auth.service";
import { RegisterList } from "../types/auth.types";





export const emailRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData: RegisterList = req.body;
    const result = await registerServices(userData);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const emaillogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await loginServices(email, password);
    console.log(result);

    res.json(result);
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const oauthCallbackController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await authServices(req);
    if ('error' in result) {
      res.status(400).json(result);
      return;
    }
    res.cookie('token', result.token, result.cookieOptions);
    res.redirect(result.redirectUrl);
  } catch (error: any) {
    //console.error('OAuth Error:', error);
    res.status(400).send(error.message || 'OAuth 처리 실패');
  }
};

export const getCurrentUserController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = await userServices(req);
    res.json({ user: result });
  } catch (error: any) {
    res.status(500).json({ error: error.message || '서버 오류' });
  }
};