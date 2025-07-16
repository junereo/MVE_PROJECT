import express from 'express';
import {
  getAllSettingsController,
  updateSettingController,
} from '../controllers/setting.controller';
import { verifyUserOrAdmin } from "../middlewares/survey.middleware";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

// GET /admin/settings
router.get('/', getAllSettingsController);  // 모든 설정 조회

// PATCH /admin/settings
router.patch('/', verifyUserOrAdmin, verifyToken, updateSettingController); // 설정 업데이트

export default router;
