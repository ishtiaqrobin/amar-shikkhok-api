import express, { Application } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { categoryRouter } from "./modules/category/category.router";
import { notFound } from "./middlewares/notFound";

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
app.use("/api/categories", categoryRouter);

// Tutor Routes
// app.use("/api/tutors", tutorRouter);

// Booking Routes
// app.use("/api/bookings", bookingRouter);

// Root Route
app.get("/", (req, res) => {
  res.send("Amar Shikkhok Server is running");
});

// Not found
app.use(notFound);

export default app;
