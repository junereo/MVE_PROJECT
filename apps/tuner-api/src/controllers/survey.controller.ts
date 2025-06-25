import { Request, Response } from 'express';
import { createSurvey } from '../services/survey.service';
interface AuthRequest extends Request {
    user?: {
        userId: number;
        email?: string;
        nickname?: string;
    };
}

export const createSurveyHandler = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.userId;
        const data = req.body;

        const survey = await createSurvey(userId, data);

        res.status(201).json({ success: true, data: survey });
    } catch (err: any) {
        res.status(500).json({ success: false, message: '설문 생성 실패', error: err.message });
    }
};

