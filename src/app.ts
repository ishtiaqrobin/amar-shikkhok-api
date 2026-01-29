import express, { Application } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { CategoryRouter } from "./modules/category/category.router";
import { notFound } from "./middlewares/notFound";
import { TutorRouter } from "./modules/tutor/tutor.router";

const app: Application = express();

app.use(
  cors({
    origin: process.env.APP_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

// Auth Routes
app.all("/api/auth/*splat", toNodeHandler(auth));

// Category Routes
app.use("/api/categories", CategoryRouter);

// Tutor Routes
app.use("/api/tutors", TutorRouter);

// Booking Routes
// app.use("/api/bookings", bookingRouter);

// Root Route
app.get("/", (req, res) => {
  res.send("Amar Shikkhok Server is running");
});

// Not found
app.use(notFound);

export default app;
