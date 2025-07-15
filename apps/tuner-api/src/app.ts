import express from "express";
import {
  userRoutes,
  adminRoutes,
  authRoutes,
  surveyRoutes,
  transaction,
  withdrawal,
} from "./routes/index";
import routerWallet from "./wallet/routers/index";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import "./schedulers/survey.status.cron"; //스케쥴링

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "https://tunemate.store",
      "https://admin.tunemate.store",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

// 미들웨어 설정
app.use(cookieParser());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// 라우트 설정
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/survey", surveyRoutes);
app.use("/withdraw", withdrawal);
app.use("/transac", transaction);
app.use("/admin", adminRoutes);
app.use("/contract", routerWallet);

// 기본 라우트
app.get("/", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/super", async (req, res) => {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: "test@naver.com" },
    });

    if (existing) {
      res
        .status(200)
        .json({ message: "관리자가 이미 존재합니다.", user: existing });
      return;
    }

    const hashedPassword = await bcrypt.hash("test1234", 10);

    const admin = await prisma.user.create({
      data: {
        email: "test@naver.com",
        password: hashedPassword,
        nickname: "슈퍼관리자",
        phone_number: "01012341234",
        role: "superadmin",
      },
    });

    res
      .status(201)
      .json({ message: "관리자 계정이 생성되었습니다.", user: admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "관리자 생성 중 오류 발생" });
  } finally {
    await prisma.$disconnect();
  }
});

export default app;
