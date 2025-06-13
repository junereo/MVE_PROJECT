import { Request, Response, NextFunction } from "express";
import { register as registerService, login as loginService } from "../services/auth.service";
import { RegisterList } from "../types/auth.types";

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userData: RegisterList = req.body;
        const result = await registerService(userData);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        const result = await loginService(email, password);
        res.json(result);
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
}; 