import { Request, Response } from 'express';
import { createSurvey, getSurveyListService, updateSurveyService } from '../services/survey.service';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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

export const createSurveyHandler = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const adminId = req.admin?.adminId;
        const data = req.body;

        if (!userId && !adminId) {
            res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
            return;
        }

        console.log('설문 생성 요청 데이터:', data);

        const survey = await createSurvey({
            userId,
            adminId,
            body: data,
        });

        res.status(201).json({ success: true, data: survey });
    } catch (err: any) {
        console.error('설문 생성 실패:', err);
        res.status(500).json({
            success: false,
            message: '설문 생성 실패',
            error: err.message || err,
        });
    }
};


export const getSurveyList = async (req: Request, res: Response) => {
    try {
        const surveys = await getSurveyListService();
        res.json(surveys);
    } catch (err) {
        res.status(500).json({ message: '설문 목록 조회 실패', error: err });
    }
};

export const getSurvey = async (req: Request, res: Response) => {
    const surveyId = Number(req.params.surveyId);
    try {
        const survey = await prisma.survey.findUnique({
            where: { id: surveyId },
            include: {
                music: true,
                creator: { select: { id: true } },
                director: { select: { id: true } },
                survey_custom: true,
            },
        });

        if (!survey) {
            res.status(404).json({ message: '설문을 찾을 수 없습니다.' });
            return
        }

        res.json(survey);
    } catch (err) {
        console.error('설문 조회 실패:', err);
        res.status(500).json({ message: '설문 조회 중 오류 발생', error: err });
    }
};

export const updateSurvey = async (req: Request, res: Response): Promise<void> => {
    const surveyId = Number(req.params.surveyId);
    console.log('surveyId:', surveyId);
    console.log('req.body:', req.body);

    const body = req.body;
    if (!body || Object.keys(body).length === 0) {
        console.error('요청 본문이 비어 있습니다');
        res.status(400).json({ message: '요청 데이터가 없습니다.' });
        return;
    }

    try {
        const updatedSurvey = await updateSurveyService(surveyId, body);
        res.status(200).json({ success: true, data: updatedSurvey });
    } catch (err: any) {
        console.error('설문 수정 실패:', err);
        res.status(500).json({ success: false, message: '설문 수정 실패', error: err.message });
    };
}

