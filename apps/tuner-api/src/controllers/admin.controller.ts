import { Request, Response, NextFunction } from "express";
import * as AdminService from "../services/admin.service"
import { createAdmin, getAdminService } from "../services/admin.service";

const defaultCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none' as const,
    maxAge: 24 * 60 * 60 * 1000, // 1일
};

// TODO: Implement admin controller methods
export const dashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Implementation will be added later
};

export const adminRegister = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name, phone_number, role } = req.body;
        const admin = await createAdmin({ email, password, name, phone_number, role });
        res.status(201).json(admin);
    } catch (error: any) {
        res.status(400).json({ error: error.message })
    }
};
export const adminLogin = async (req: Request, res: Response) => {

    try {
        const { email, password } = req.body;
        const result = await AdminService.login(email, password);

        // 토큰을 HTTP Only 쿠키 저장
        res.cookie('token', result.token, defaultCookieOptions);
        res.status(200).json({ admin: result.admin, success: true });

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
            sameSite: 'none',
        });
        res.status(200).json({ message: 'Logged out and cookies cleared', success: true });
    } catch (error: any) {
        res.status(500).json({ error: error.message || '서버 오류' });
    }
};


export const getAdminController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const result = await getAdminService(req);
        res.json({ admin: result });
    } catch (error: any) {
        res.status(500).json({ error: error.message || '서버 오류' });
    }
};
