import { Request, Response } from "express";
import {
  emailRegister as registerServices,
  emaillogin as loginServices,
  oauthCallbackService as authServices,
  getUserService as userServices,
  googleCallbackService as googleService
} from "../services/auth.service";
import { RegisterList } from "../types/auth.types";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const emailRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    const userData: RegisterList = req.body;
    const result = await registerServices(userData);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const emaillogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await loginServices(email, password);

    if ('error' in result) {
      res.status(400).json(result);
      return;
    }
    res.cookie('token', result.token, result.cookieOptions);
    res.status(200).json({
      token: result.token,
      user: result.user, // id, nickname
      redirectUrl: result.redirectUrl,
    });
    return
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

export const getUserController = async (
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

export const logout = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    res.status(200).json({ message: 'Logged out and cookies cleared', redirect: process.env.CLIENT_IP });
  } catch (error: any) {
    res.status(500).json({ error: error.message || '서버 오류' });
  }
};


export const googleCallbackController = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await googleService(req);

    res.cookie('token', result.token, result.cookieOptions);
    res.redirect(result.redirectUrl);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}