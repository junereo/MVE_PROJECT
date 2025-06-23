import { Request, Response, NextFunction } from "express";
import { RegisterList } from "../types/auth.types";
import jwt from "jsonwebtoken";

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password, nickname, phone_number }: RegisterList = req.body;
  console.log(req.body);

  if (!email || !password || !nickname || !phone_number) {
    res.status(400).json({ error: "모든 필드를 입력해주세요." });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ error: "비밀번호는 8자 이상이어야 합니다." });
    return;
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "이메일과 비밀번호를 입력해주세요." });
    return;
  }
  next();
};

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    nickname?: string;
  };
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let token = req.cookies.token;

  console.log(token);
  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ error: "인증 토큰이 없습니다." });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AuthRequest["user"];
    (req as AuthRequest).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "유효하지 않은 토큰입니다." });
  }
};

export const validateOAuthRequest = async (req: Request, res: Response, next: NextFunction) => {
  const provider = req.params.provider;
  const code = req.query.code || req.body.code;

  if (!provider || typeof provider !== 'string') {
    res.status(400).json({ error: 'provider가 없음' });
    return
  }

  if (!code) {
    res.status(400).json({ error: 'OAuth code 없음' });
    return
  }

  next();
};
