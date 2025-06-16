import express from "express";
import { dashboard, manageUsers } from "../controllers/admin.controller";
import { adminLoginHandler } from "../controllers/admin.controller";

const router = express.Router();

router.get("/dashboard", dashboard);
router.get("/users", manageUsers);
router.post("/login", adminLoginHandler)

export default router; 