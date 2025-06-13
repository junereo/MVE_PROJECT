import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/user.controller";
import { validateUserProfile, validateUserUpdate } from "../middlewares/user.middleware";

const router = express.Router();

router.get("/profile", validateUserProfile, getUserProfile);
router.put("/profile", validateUserUpdate, updateUserProfile);

export default router; 