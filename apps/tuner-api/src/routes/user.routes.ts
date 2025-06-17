import express from "express";
import { getUserProfile, updateUserProfile, getUserProfiles } from "../controllers/user.controller";
import { validateUserProfile, validateUserUpdate } from "../middlewares/user.middleware";

const router = express.Router();

router.get("/me", validateUserProfile, getUserProfile);
router.put("/me", validateUserUpdate, updateUserProfile);
router.get("/users", getUserProfiles)

export default router; 