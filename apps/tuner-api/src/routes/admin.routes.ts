import express from "express";
import { dashboard, adminLogin, adminRegister, logout } from "../controllers/admin.controller";


const router = express.Router();

router.get("/dashboard", dashboard);
router.post("/signup", adminRegister);
router.post("/login", adminLogin);
router.post('/logout', logout);

export default router; 