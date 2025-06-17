import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// TODO: Implement user controller methods
export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Implementation will be added later
};

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Implementation will be added later
};

export const getUserProfiles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            include: {
                oauths: true,
            },
        });

        res.json(users);
    } catch (error: any) {
        console.log("유저 불러오지 못함:", error.message);
        res.status(500).json({ error: "정보를 가져올 수 없습니다" });
    }
};