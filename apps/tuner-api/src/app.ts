import express from "express";
import { adminRoutes, authRoutes, userRoutes, surveyRoutes } from "../src/routes";
import routerWallet from "../src/wallet/routers/wallet.routes";
import cookieParser from 'cookie-parser';
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CLIENT_IP || 'http://192.168.0.59:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));

// 미들웨어 설정
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 설정
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/surveys", surveyRoutes);
app.use("/admin", adminRoutes);
app.use("/contract", routerWallet);

// 기본 라우트
app.get("/", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
});



// 에러 핸들링 미들웨어
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

export default app;

