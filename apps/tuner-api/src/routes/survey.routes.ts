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
  calculateSurveyResultHandler,
  updateSurveyResponseHandler,
  terminateSurveyHandler
} from "../controllers/survey.controller";
import { verifyUserOrAdmin } from "../middlewares/survey.middleware";

import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/list", getSurveyList); // 설문조사 목록 조회
router.get("/s/:surveyId", getSurvey); // 특정 설문조사 조회
router.get("/q/:questionnaireId", getSurveyQuestionList); // 특정 설문조사의 질문 목록 조회
router.get("/p", getAllSurveyParticipantsHandler); // 설문조사 참여자 목록 조회
router.get("/r/:surveyId", getSurveyResultHandler); // 특정 설문조사의 결과 조회
// router.get("/s/:questionId", verifyToken, getSurveyQuestionController);
router.get("/s", verifyToken, getMySurvey); // 현재 로그인된 사용자의 설문조사 목록 조회

router.post("/r", verifyToken, createSurveyResultHandler); // 설문조사 결과 생성
router.post("/p", verifyToken, createSurveyParticipantHandler); // 설문조사 참여자 생성
router.post("/", verifyUserOrAdmin, verifyToken, createSurveyHandler); // 설문조사 생성
router.post("/q", verifyToken, createSurveyQuestionHandler); // 설문조사 질문 생성
router.post("/c/:surveyId", verifyUserOrAdmin, verifyToken, calculateSurveyResultHandler); // 설문조사 결과 계산
// router.post('/survey/temp');
// router.post('/:surveyId/responses');
// router.put('/:surveyId/responses');
router.put("/:surveyId", updateSurvey); // 설문조사 업데이트
router.patch("/r", verifyToken, updateSurveyResponseHandler); // 설문조사 응답 업데이트
router.put("/t/:surveyId", verifyUserOrAdmin, verifyToken, terminateSurveyHandler); // 설문조사 종료

export default router;

