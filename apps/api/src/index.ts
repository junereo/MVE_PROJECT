import express, { Request, Response, NextFunction } from "express";
// import { db } from "@utils/db";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// app.get("/users", async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     res.json(await db.user.findMany());
//   } catch (err) {
//     next(err);
//   }
// });

// app.post("/users", async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const newUser = await db.user.create({ data: { email: req.body.email } });
//     res.status(201).json(newUser);
//   } catch (err) {
//     next(err);
//   }
// });

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => console.log(`API listening on port ${port}`));
