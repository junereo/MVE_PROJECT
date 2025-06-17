import express from "express";
import { dashboard, manageUsers, logout } from "../controllers/admin.controller";
import { adminLoginHandler } from "../controllers/admin.controller";

const router = express.Router();

router.get("/dashboard", dashboard);
router.get("/users", manageUsers);
router.post("/login", adminLoginHandler);
router.post('/logout', logout);

export default router; 