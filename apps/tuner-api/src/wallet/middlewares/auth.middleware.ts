import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

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
