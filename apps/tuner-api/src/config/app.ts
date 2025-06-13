import express from "express";
import authRoutes from "../routes/auth.routes";
import userRoutes from "../routes/user.routes";
import surveyRoutes from "../routes/survey.routes";
import adminRoutes from "../routes/admin.routes";

const app = express();

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 설정
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/surveys", surveyRoutes);
app.use("/admin", adminRoutes);

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