import express from 'express';
import { createSurveyHandler } from '../controllers/survey.controller';
import { verifyUserOrAdmin } from "../middlewares/survey.middleware";

const router = express.Router();

console.log("createSurveyHandler:", typeof createSurveyHandler);

// router.get('/list');
// router.get('/:surveyId');
// router.get('/:surveyId/results');
router.post('/create', verifyUserOrAdmin, createSurveyHandler);
// router.post('/:surveyId/responses');
// router.put('/:surveyId/responses');

export default router;
