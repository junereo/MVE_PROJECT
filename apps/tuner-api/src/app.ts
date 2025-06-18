import express from "express";
import {
  adminRoutes,
  authRoutes,
  surveyRoutes,
} from "../src/routes";
import routerWallet from "../src/wallet/routers/wallet.routes";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_IP || "http://localhost:3000",
    credentials: true,
  })
);

// 미들웨어 설정
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 설정
app.use("/auth", authRoutes);
app.use("/surveys", surveyRoutes);
app.use("/admin", adminRoutes);
app.use("/contract", routerWallet);

// 기본 라우트
app.get("/", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

export default app;
