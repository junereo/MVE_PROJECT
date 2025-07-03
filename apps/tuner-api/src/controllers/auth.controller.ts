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
import { AuthRequest } from "../middlewares/auth.middleware"

const prisma = new PrismaClient();


// 이메일 회원가입
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
    const { code, role } = req.query;
    if (!code) {
      throw new Error("No code provided in query");
    }

    const result = await googleCallbackService({
      code: code.toString(),
      role: role?.toString(),
    });

    res.cookie("token", result.token, result.cookieOptions);

    res.redirect(result.redirectUrl);
  } catch (error: any) {
    console.error(error);
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

    if (!result) {
      res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
      return;
    }

    res.status(200).json({ user: result });
    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
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

// 회원 탈퇴
export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ error: "유효하지 않은 사용자 정보입니다." });
      return;
    }

    await prisma.user.delete({
      where: { id: Number(req.user.userId) },
    });

    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.status(200).json({
      message: '회원 탈퇴가 완료되었습니다.',
      redirect: process.env.CLIENT_IP,
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "서버 오류" });
  }
};

export const deleteAdminAccount = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(400).json({ error: "유효하지 않은 사용자 정보입니다." });
      return;
    }

    // 관리자 권한 확인
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      res.status(403).json({ error: "관리자만 탈퇴할 수 있습니다." });
      return;
    }

    await prisma.user.delete({
      where: { id: Number(req.user.userId) },
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    res.status(200).json({
      message: "관리자 탈퇴 완료",
      redirect: process.env.CLIENT_ADMIN_IP || "/admin",
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message || "서버 오류" });
  }
};