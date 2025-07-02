import express from "express";
import {
<<<<<<< HEAD
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
=======
        createSurveyHandler,
        createSurveyQuestionHandler,
        getSurveyList,
        getSurvey,
        updateSurvey,
        getSurveyQuestionList,
        getAllSurveyParticipantsHandler,
        createSurveyParticipantHandler,
        getSurveyResultHandler,
        createSurveyResultHandler
>>>>>>> 75847284e8c93c2426f53b1b1d20d823bfdf4906
} from "../controllers/survey.controller";
import { verifyUserOrAdmin } from "../middlewares/survey.middleware";

const router = express.Router();

<<<<<<< HEAD
router.get("/list", getSurveyList);
router.get("/s/:surveyId", getSurvey);
router.get("/q/:questionnaireId", getSurveyQuestionList);
router.get("/p", getAllSurveyParticipantsHandler);
router.get("/r/:surveyId", getSurveyResultHandler);
=======
router.get('/list', getSurveyList);
router.get('/s/:surveyId', getSurvey);
router.get('/q/:questionnaireId', getSurveyQuestionList);
router.get('/p', getAllSurveyParticipantsHandler);
router.get('/r/:surveyId', getSurveyResultHandler);
>>>>>>> 75847284e8c93c2426f53b1b1d20d823bfdf4906

router.post("/r", createSurveyResultHandler);
router.post("/p", createSurveyParticipantHandler);
router.post("/", verifyUserOrAdmin, createSurveyHandler);
router.post("/q", createSurveyQuestionHandler);
// router.post('/survey/temp');
// router.post('/:surveyId/responses');
// router.put('/:surveyId/responses');
router.put("/:surveyId", updateSurvey);

export default router;
