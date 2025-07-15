import express from 'express';
import {
  getAllSettingsController,
  updateSettingController,
} from '../controllers/setting.controller';
import { verifyUserOrAdmin } from "../middlewares/survey.middleware";
import { verifyToken } from "../middlewares/auth.middleware";

const router = express.Router();

// GET /admin/settings
router.get('/', getAllSettingsController);

// PATCH /admin/settings
router.patch('/', verifyUserOrAdmin, verifyToken, updateSettingController);

export default router;
