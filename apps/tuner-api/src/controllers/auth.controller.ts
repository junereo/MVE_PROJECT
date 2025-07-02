import { PrismaClient } from '@prisma/client';
import { Request, Response } from "express";
import {
  emailRegister as registerServices,
  emaillogin as loginServices,
  adminRegister as registerAdminService,
  adminLogin as adminLoginService,
  oauthCallbackService,
  googleCallbackService
} from "../services/auth.service";
const prisma = new PrismaClient();


// 이메일  회원가입
export const emailRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await registerServices(req.body);
    res.cookie('token', result.token, result.cookieOptions);
    res.status(201).json({ token: result.token, user: result.user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// 이메일 로그인
export const emaillogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await loginServices(email, password);

    res.cookie('token', result.token, result.cookieOptions);
    res.status(200).json({ token: result.token, user: result.user });

  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

//  관리자 회원가입
export const adminRegister = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phone_number, role } = req.body;

    const result = await registerAdminService({ email, password, name, phone_number, role });

    res.cookie('token', result.token, result.cookieOptions);
    res.status(201).json({ token: result.token, user: result.user });

  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// 관리자 로그인
export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await adminLoginService(email, password);

    res.cookie('token', result.token, result.cookieOptions);
    res.status(200).json({ token: result.token, user: result.user });

  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

// 카카오 
export const oauthCallbackController = async (req: Request, res: Response) => {
  try {
    const result = await oauthCallbackService(req);

    res.cookie('token', result.token, result.cookieOptions);
    res.redirect(result.redirectUrl);
  } catch (error: any) {
    res.status(400).send(error.message || "OAuth 처리 실패");
  }
};

// 구글 
export const googleCallbackController = async (req: Request, res: Response) => {
  try {
    const result = await googleCallbackService(req);

    res.cookie('token', result.token, result.cookieOptions);
    res.redirect(process.env.CLIENT_USER_IP || "http://localhost:3000");
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user } = req as any;
    const result = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { id: true, nickname: true, role: true },
    });
    if (!result) res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    res.status(200).json({ user: result });
    return
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


// 로그아웃 
export const logout = async (req: Request, res: Response): Promise<void> => {
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
