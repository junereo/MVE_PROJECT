import express from "express";
import {
  emailRegister,
  emaillogin,
  oauthCallbackController,
  googleCallbackController,
  getUserController,
  logout,
} from "../controllers/auth.controller";
import {
  validateRegister,
  validateLogin,
  verifyToken,
} from "../middlewares/auth.middleware";
import { validateOAuthRequest } from '../middlewares/auth.middleware';

const router = express.Router();

router.post("/signup", validateRegister, emailRegister);
router.post("/me", verifyToken, getUserController);
router.post("/login", validateLogin, emaillogin);
router.get("/oauth/:provider", oauthCallbackController, validateOAuthRequest);
router.get('/google/callback', googleCallbackController);
router.post("/logout", logout);

export default router;
