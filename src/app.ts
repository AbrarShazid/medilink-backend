import express, { Application, Request, Response } from "express";
import { IndexRoutes } from "./app/routes/index.routes";

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

//alll

app.use("/api/v1", IndexRoutes);

// Basic route
app.get("/", async (req: Request, res: Response) => {
  res.send("Hello");
});

export default app;
