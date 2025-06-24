// src/controllers/survey.routes.ts
import express from 'express';
import { submitSurvey, getSurveyTokenUri } from '../controllers/survey.controller.js';

const router = express.Router();

router.post('/submit', submitSurvey); // POST /survey/submit
router.get('/uri/:surveyId', getSurveyTokenUri); // GET /survey/uri/:surveyId

export default router;
