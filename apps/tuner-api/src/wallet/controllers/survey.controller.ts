// src/controllers/survey.controller.ts
import express, { Request, Response, Router } from 'express';
import { SurveyService } from '../services/survey.service.js';
import { MetaTransctionService } from '../services/meta_transction.service.js';

const router: Router = express.Router();

interface SurveyRequest extends Request {
  user?: {
    userId: number;
    nickname?: string;
  };
}

// 서비스 인스턴스 생성 및 초기화
const metaService = new MetaTransctionService();
const surveyService = new SurveyService(metaService);
await surveyService.init();


// ✅ 1. 설문 제출 및 즉시 NFT 발행
export const submitSurvey = async (req: Request, res: Response) => {
  const { uid, surveyId, answers } = req.body;

  if (!uid || !surveyId || !answers) {
    res.status(400).json({ error: 'uid, surveyId, answers are required' });
    return ;
  }

  try {
    const result = await surveyService.submitSurveyAndMint(uid, surveyId, answers);
    res.status(200).json(result);
  } catch (err: any) {
    console.error('❌ submitSurveyAndMint failed:', err);
    res.status(500).json({ error: 'Failed to mint NFT', details: err.message });
  }
};


// ✅ 2. tokenId에 대응하는 메타데이터 URI 조회
export const getSurveyTokenUri = async (req: Request, res: Response) => {
  const { surveyId } = req.params;

  if (!surveyId) {
    res.status(400).json({ error: 'surveyId is required in path' });
    return;
  }

  try {
    const uri = await surveyService.getSurveyUri(surveyId);
    res.status(200).json({ surveyId, uri });
  } catch (err: any) {
    console.error(`❌ Failed to get URI for ${surveyId}:`, err);
    res.status(500).json({ error: 'Failed to get survey token URI', details: err.message });
  }
};
