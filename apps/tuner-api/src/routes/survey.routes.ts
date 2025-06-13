import express from "express";
import { createSurvey, getSurvey } from "../controllers/survey.controller";

const router = express.Router();

router.post("/", createSurvey);
router.get("/:id", getSurvey);

export default router; 