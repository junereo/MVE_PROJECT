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
} from "../controllers/survey.controller";
import { verifyUserOrAdmin } from "../middlewares/survey.middleware";

const router = express.Router();

router.get("/list", getSurveyList);
router.get("/s/:surveyId", getSurvey);
router.get("/q/:questionnaireId", getSurveyQuestionList);
router.get("/p", getAllSurveyParticipantsHandler);
router.get("/r/:surveyId", getSurveyResultHandler);

router.post("/r", createSurveyResultHandler);
router.post("/p", createSurveyParticipantHandler);
router.post("/", verifyUserOrAdmin, createSurveyHandler);
router.post("/q", createSurveyQuestionHandler);
// router.post('/survey/temp');
// router.post('/:surveyId/responses');
// router.put('/:surveyId/responses');
router.put("/:surveyId", updateSurvey);

export default router;
