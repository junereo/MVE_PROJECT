import express from "express";
import {
  adminRoutes,
  authRoutes,
  surveyRoutes,
} from "./routes/index";
import routerWallet from "./wallet/routers/index";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_IP,
  process.env.CLIENT_ADMIN_IP,
  process.env.CLIENT_USER_IP,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS BLOCKED: ${origin} not allowed`));
      }
    },
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
