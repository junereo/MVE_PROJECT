import express from "express";
import { emailRegister, emaillogin, oauthCallbackController } from "../controllers/auth.controller";
import { validateRegister, validateLogin } from "../middlewares/auth.middleware";
import { verifyToken } from "../middlewares/auth.middleware"
import { getCurrentUserController } from "../controllers/auth.controller"

const router = express.Router();

router.post("/signup", validateRegister, emailRegister);
router.get("/me", verifyToken, getCurrentUserController);
router.post("/login", validateLogin, emaillogin);
router.get("/oauth/:provider", oauthCallbackController);


export default router; 