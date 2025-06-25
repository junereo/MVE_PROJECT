import { Request, Response } from 'express';
import { createSurvey } from '../services/survey.service';

interface AuthRequest extends Request {
    user?: {
        userId: string;
        email?: string;
        nickname?: string;
    };
    admin?: {
        adminId: string;
        email?: string;
        name?: string;
    };
}

export const createSurveyHandler = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const adminId = req.admin?.adminId;
        const data = req.body;

        if (!userId && !adminId) {
            res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
            return;
        }

        const survey = await createSurvey({
            userId,
            adminId,
            body: data,
        });

        res.status(201).json({ success: true, data: survey });
    } catch (err: any) {
        console.error("설문 생성 실패:", err);
        res.status(500).json({ success: false, message: '설문 생성 실패', error: err.message });
    }
};
