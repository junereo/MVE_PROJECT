import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const verifyAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const token =
        req.cookies?.token ||
        req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ error: '인증 토큰이 없습니다.' });
        return;
    }

    try {
        const decoded = verifyToken(token) as { adminId: string; role: string };
        (req as any).admin = decoded;
        next();
    } catch {
        res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
        return;
    }
};


export const validateUserUpdate = (req: Request, res: Response, next: NextFunction): void => {
    // TODO: Implement user update validation
    next();
};



