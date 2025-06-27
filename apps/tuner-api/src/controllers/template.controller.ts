import { Request, Response } from 'express';
import { createTemplate } from '../services/template.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTemplateHandler = async (req: Request, res: Response) => {
    try {
        const { template_name, template } = req.body;

        if (!template_name || !template) {
            res.status(400).json({ success: false, message: "템플릿 이름 또는 내용이 없습니다." });
            return
        }

        const created = await createTemplate(template_name, template);
        res.status(201).json({ success: true, data: created });
    } catch (error: any) {
        console.error("템플릿 생성 오류:", error);
        res.status(500).json({ success: false, message: "템플릿 생성 실패", error: error.message });
    }
};


export const getTemplateHandler = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.templateId);

        if (isNaN(id)) {
            res.status(400).json({ success: false, message: '유효하지 않은 템플릿 ID입니다.' });
            return
        }

        const template = await prisma.survey_Template.findUnique({
            where: { id },
        });

        if (!template) {
            res.status(404).json({ success: false, message: '템플릿을 찾을 수 없습니다.' });
            return
        }

        res.status(200).json({ success: true, data: template });
    } catch (error: any) {
        console.error('템플릿 조회 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류', error: error.message });
    }
};