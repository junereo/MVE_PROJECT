import express from "express";
import { getAdminDashboard, manageUsers } from "../controllers/admin.controller";

const router = express.Router();

router.get("/dashboard", getAdminDashboard);
router.get("/users", manageUsers);

export default router; 