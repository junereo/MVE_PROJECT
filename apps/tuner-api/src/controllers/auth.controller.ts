import { Request, Response } from "express";
import { register as signUP, login as signIn } from "../services/auth.service";
import { RegisterList } from "../types/auth.types";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const userData: RegisterList = req.body;
        const result = await signUP(userData);
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const result = await signIn(email, password);
        console.log(result);

        res.json(result);
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
}; 