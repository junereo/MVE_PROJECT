import { Request, Response, NextFunction } from "express";
import { RegisterList } from "../types/auth.types";

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
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

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: "이메일과 비밀번호를 입력해주세요." });
        return;
    }
    next();
};

