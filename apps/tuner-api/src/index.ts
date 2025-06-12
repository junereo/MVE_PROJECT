import express, { Request, Response, NextFunction } from "express";
import { PrismaClient, UserLevel } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.post('/users', async (req: Request, res: Response) => {
  const {
    email,
    phone_number,
    password,
    nickname,
    wallet_address,
    simple_password,
    level,
    badge_issued_at,
  } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        phone_number,
        password,
        nickname,
        wallet_address,
        simple_password,
        level: level as UserLevel,
        badge_issued_at: badge_issued_at ? new Date(badge_issued_at) : undefined,
      },
    });
    res.status(201).json(newUser);
  } catch (error: any) {
    console.error(' 유저생성 실패:', error.message);
    res.status(400).json({ error: error.message });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findMany({
      include: {
        oauths: true, // User_Oauth 모델과의 관계를 불러옴
      }
    });
    res.json(user);
  } catch (error: any) {
    console.log("유저 불러오지 못함:", error.message);
    res.status(500).json({ error: "정보를 가져올수없습니다" })

  }
})




app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => console.log(`API listening on port ${port}`));
