import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const verifyUserOrAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const token =
        req.cookies?.token ||
        req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ error: '인증 토큰이 없습니다.' });
        return;
    }

    try {
        const decoded = verifyToken(token);

        if (typeof decoded === 'object' && decoded !== null) {
            if ('userId' in decoded) {
                (req as any).user = decoded;
            } else if ('adminId' in decoded) {
                (req as any).admin = decoded;
            } else {
                res.status(401).json({ error: '유효하지 않은 사용자입니다.' });
                return;
            }
            next();
        } else {
            res.status(401).json({ error: 'JWT Payload 형식 오류' });
        }
    } catch (err) {
        console.error('JWT 검증 실패:', err);
        res.status(401).json({ error: '토큰 검증 실패' });
    }
};
