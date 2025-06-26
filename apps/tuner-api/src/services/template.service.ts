import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createTemplate = async (name: string, templateJson: any) => {
    const newTemplate = await prisma.survey_Template.create({
        data: {
            template_name: name,
            template: templateJson,
        },
    });

    return newTemplate;
};
