import express from "express";
import {
  createSurveyHandler,
  createSurveyQuestionHandler,
  getSurveyList,
  getSurvey,
  updateSurvey,
  getSurveyQuestionList,
  getAllSurveyParticipantsHandler,
  createSurveyParticipantHandler,
  getSurveyResultHandler,
  createSurveyResultHandler,
  getSurveyQuestionController,
  getMySurvey,
  calculateSurveyResultHandler
} from "../controllers/survey.controller";
import { verifyUserOrAdmin } from "../middlewares/survey.middleware";

import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/list", getSurveyList);
router.get("/s/:surveyId", getSurvey);
router.get("/q/:questionnaireId", getSurveyQuestionList);
router.get("/p", getAllSurveyParticipantsHandler);
router.get("/r/:surveyId", getSurveyResultHandler);
router.get("/s/:questionId", verifyToken, getSurveyQuestionController);
router.get("/s", verifyToken, getMySurvey);

router.post("/r", verifyToken, createSurveyResultHandler);
router.post("/p", verifyToken, createSurveyParticipantHandler);
router.post("/", verifyUserOrAdmin, verifyToken, createSurveyHandler);
router.post("/q", verifyToken, createSurveyQuestionHandler);
router.post("/calculate/:surveyId", verifyUserOrAdmin, verifyToken, calculateSurveyResultHandler);
// router.post('/survey/temp');
// router.post('/:surveyId/responses');
// router.put('/:surveyId/responses');
router.put("/:surveyId", updateSurvey);

export default router;
