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
import { updateUser } from "../services/user.service";
import { AuthRequest } from "../middlewares/auth.middleware";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import redisClient from "../lib/redis.client";
import { sendResetPasswordEmail } from "../utils/mailer";

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

// 관리자 회원가입
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

// 사용자 정보 가져오기
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

// 회원 탈퇴
export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user?.userId) {
      res.status(401).json({ error: "유효하지 않은 사용자 정보입니다." });
      return;
    }
    const userId = Number(req.user.userId);

    await updateUser(userId, {
      email: `deleted+${userId}@tunestorm.local`,
      password: 'DELETED_USER_PASSWORD',
      phone_number: 'DELETED_PHONE',
      nickname: '(탈퇴회원)',
      gender: null,
      age: null,
      genre: null,
      job_domain: null,
      wallet_address: null,
      simple_password: null,
      is_deleted: true,
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

// 관리자 탈퇴
export const deleteAdminAccount = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.userId) {
      res.status(400).json({ error: "유효하지 않은 사용자 정보입니다." });
      return;
    }

    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      res.status(403).json({ error: "관리자만 탈퇴할 수 있습니다." });
      return;
    }

    await updateUser(Number(req.user.userId), {
      email: null,
      password: null,
      phone_number: null,
      nickname: '(탈퇴관리자)',
      gender: null,
      age: null,
      genre: null,
      job_domain: null,
      wallet_address: null,
      simple_password: null,
      is_deleted: true,
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

// 이메일 중복 검사
export const checkEmailDuplicate = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({ success: false, message: "이미 사용 중인 이메일입니다." });
      return;
    }

    res.status(200).json({ success: true, message: "사용 가능한 이메일입니다." });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "서버 오류" });
  }
};

// 이메일 찾기
export const findUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone_number } = req.body;

    const user = await prisma.user.findFirst({
      where: { phone_number },
      select: { email: true },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "일치하는 회원 정보가 없습니다." });
      return;
    }

    res.status(200).json({ success: true, email: user.email });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "서버 오류" });
  }
};

// 비밀번호 재설정 요청
export const resetPasswordRequest = async (req: Request, res: Response) => {
  const email = req.body?.email;

  if (!email) {
    res.status(400).json({ message: "이메일을 입력해주세요." });
    return;
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    res.status(404).json({ message: "존재하지 않는 이메일입니다." });
    return
  }
  // 1) JWT 발급
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  // 2) Redis에 15분짜리 토큰 저장
  await redisClient.setex(`reset:${token}`, 900, user.id.toString());

  // 3) 재설정 링크 이메일 발송
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  await sendResetPasswordEmail(user.email, resetLink);

  res.json({ success: true, message: "재설정 링크가 전송되었습니다." });
  return
};

// 비밀번호 재설정 실행
export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  try {
    // JWT 검증
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Redis에서 토큰이 유효한지 확인
    const userId = await redisClient.get(`reset:${token}`);
    if (!userId) {
      res.status(400).json({ message: "유효하지 않거나 만료된 링크입니다." });
      return;
    }

    // 비밀번호 해시 후 DB 업데이트
    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: Number(userId) },
      data: { password: hashed },
    });

    // Redis에서 토큰 삭제
    await redisClient.del(`reset:${token}`);

     res.json({ success: true, message: "비밀번호가 재설정되었습니다." });
     return;
  } catch (error) {
     res.status(400).json({ message: "유효하지 않거나 만료된 링크입니다." });
     return;
  }
};
