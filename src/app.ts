import express, { Application, Request, Response } from "express";

const app: Application = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
