import express from 'express';
import { createSurveyHandler } from '../controllers/survey.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/list');
router.get('/:surveyId');
router.get('/:surveyId/results');
router.post('/create', verifyToken, createSurveyHandler);
router.post('/:surveyId/responses');
router.put('/:surveyId/responses');

export default router;
