import express, { Application, Request, Response } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./app/lib/auth";
import cors from "cors";
import { notFound } from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import { env } from "./app/config/env";
import cookieParser from "cookie-parser";
import { IndexRoutes } from "./app/routes";
import path from "path";

const app: Application = express();

app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), "src/app/templates"));

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    console.log("Webhook received", req.body);
    res.status(200).json({ received: true });
  },
);

app.use(
  cors({
    origin: [
      env.FRONTEND_URL,
      env.BETTER_AUTH_URL,
      "http://localhost:5000",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Auth Routes
app.all("/api/auth/*splat", toNodeHandler(auth));

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", IndexRoutes);

// Root Route
app.get("/", (_req: Request, res: Response) => {
  res.send("Amar Shikkhok Server is running");
});

// Error handling
app.use(globalErrorHandler);

// Not found
app.use(notFound);

export default app;
