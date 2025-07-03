import express from "express";
import { adminLogin, adminRegister } from '../controllers/auth.controller'

const router = express.Router();

// router.get("/dashboard", dashboard);
router.post("/signup", adminRegister);
router.post("/login", adminLogin);
// router.post('/logout', logout);
// router.post('/me', verifyAdmin, getAdminController);
// router.get('/survey',)

export default router; 