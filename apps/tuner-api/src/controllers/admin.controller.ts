import { Request, Response, NextFunction } from "express";
import * as AdminService from "../services/admin.service"

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
        res.json(result);


    } catch (err: any) {
        res.status(401).json({ error: err.message });
    }
};