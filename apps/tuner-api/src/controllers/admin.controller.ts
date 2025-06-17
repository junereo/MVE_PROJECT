import { Request, Response, NextFunction } from "express";
import * as AdminService from "../services/admin.service"

const defaultCookieOptions = {
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 24 * 60 * 60 * 1000, // 1일
};


// TODO: Implement admin controller methods
export const dashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Implementation will be added later
};

export const manageUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Implementation will be added later
};

export const adminLoginHandler = async (req: Request, res: Response) => {
    try {
        const result = await AdminService.login(req.body.email, req.body.password);

        // 토큰을 HTTP Only 쿠키 저장
        res.cookie('token', result.token, defaultCookieOptions);


        res.status(200).json({ admin: result.admin, redirect: 'http://localhost:3000/dashboard' });

        // 프론트엔드에 관리자 정보전달
        res.status(200).json(result.admin);
    } catch (err: any) {
        res.status(401).json({ error: err.message });
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
            sameSite: 'lax',
        });
        res.status(200).json({ message: 'Logged out and cookies cleared', redirect: '/' });
    } catch (error: any) {
        res.status(500).json({ error: error.message || '서버 오류' });
    }
};
