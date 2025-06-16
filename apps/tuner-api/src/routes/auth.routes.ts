import express from "express";
import { register, login } from "../controllers/auth.controller";
import { validateRegister, validateLogin } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

export default router; 