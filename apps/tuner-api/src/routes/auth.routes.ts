import express from "express";
import {
  emailRegister,
  emaillogin,
  oauthCallbackController,
  googleCallbackController,
  getUserController,
  deleteAccount,
  deleteAdminAccount,
  logout,
  checkEmailDuplicate,
  findUserId,
  resetPasswordRequest,
  resetPassword,
} from "../controllers/auth.controller";
import {
  validateRegister,
  validateLogin,
  verifyToken,
} from "../middlewares/auth.middleware";
import { validateOAuthRequest } from '../middlewares/auth.middleware';

const router = express.Router();

router.post("/signup", validateRegister, emailRegister);  // 이메일 회원가입
router.post("/me", verifyToken, getUserController); // 현재 로그인된 유저 정보 조회
router.post("/login", validateLogin, emaillogin); // 이메일 로그인
router.get("/oauth/:provider", oauthCallbackController, validateOAuthRequest);  // OAuth 인증 콜백
router.get('/google/callback', googleCallbackController); // 구글 OAuth 콜백

router.post("/logout", logout);   // 로그아웃
router.post("/checkemail", checkEmailDuplicate); // 이메일 중복 확인
router.post("/findid", findUserId); // 아이디 찾기
router.post("/pwrequest", resetPasswordRequest); // 비밀번호 재설정 요청
router.post("/resetpw", resetPassword); // 비밀번호 재설정

router.delete("/delete", verifyToken, deleteAccount); // 계정 삭제
router.delete("/delete", verifyToken, deleteAdminAccount); // 관리자 계정 삭제


export default router;
