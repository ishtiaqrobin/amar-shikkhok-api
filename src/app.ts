import express, { Application } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { CategoryRouter } from "./modules/category/category.route";
import { notFound } from "./middlewares/notFound";
import { TutorRouter } from "./modules/tutor/tutor.route";
import { BookingRouter } from "./modules/booking/booking.route";
import { UserRouter } from "./modules/user/user.route";
import { ReviewRouter } from "./modules/review/review.route";
import { AdminRouter } from "./modules/admin/admin.route";
import errorHandler from "./middlewares/errorHandler";

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
app.use("/api", TutorRouter);

// Booking Routes
app.use("/api/bookings", BookingRouter);

// Review Routes
app.use("/api/reviews", ReviewRouter);

// User Routes
app.use("/api/users", UserRouter);

// Admin Routes
app.use("/api/admin", AdminRouter);

// Root Route
app.get("/", (req, res) => {
  res.send("Amar Shikkhok Server is running");
});

// Error handling
app.use(errorHandler);

// Not found
app.use(notFound);

export default app;
