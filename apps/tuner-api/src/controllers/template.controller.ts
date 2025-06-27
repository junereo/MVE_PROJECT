import { Request, Response } from 'express';
import { createTemplate } from '../services/template.service';

export const createTemplateHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { template_name, template } = req.body;

        console.log(req.body);
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
