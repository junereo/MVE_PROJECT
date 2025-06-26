import express from "express";
import { dashboard, adminLogin, adminRegister, logout, getAdminController } from "../controllers/admin.controller";
import { verifyAdmin } from "../middlewares/admin.middleware";


const router = express.Router();

router.get("/dashboard", dashboard);
router.post("/signup", adminRegister);
router.post("/login", adminLogin);
router.post('/logout', logout);
router.post('/me', verifyAdmin, getAdminController);
// router.get('/survey',)

export default router; 