import express from "express";
import {
  emailRegister,
  emaillogin,
  oauthCallbackController,
  googleCallbackController,
  logout,
} from "../controllers/auth.controller";
import {
  validateRegister,
  validateLogin,
  verifyToken,
} from "../middlewares/auth.middleware";
import { getUserController } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", validateRegister, emailRegister);
router.post("/me", verifyToken, getUserController);
router.post("/login", validateLogin, emaillogin);
router.get("/oauth/:provider", oauthCallbackController);
router.get('/google/callback', googleCallbackController);
router.post("/logout", logout);

export default router;
