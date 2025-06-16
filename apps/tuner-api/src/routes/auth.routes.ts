import express from "express";

import { emailRegister, emaillogin, oauthCallbackController } from "../controllers/auth.controller";
import { validateRegister, validateLogin } from "../middlewares/auth.middleware";


const router = express.Router();

router.post("/signup", validateRegister, emailRegister);
router.post("/login", validateLogin, emaillogin);
router.get("/oauth/:provider", oauthCallbackController);


export default router; 