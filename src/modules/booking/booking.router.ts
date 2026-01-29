import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { BookingController } from "./booking.controller";

const router = express.Router();

// Protected Route - Booking a tutor
router.post("/", auth(UserRole.STUDENT), BookingController.createBooking);

export const bookingRouter: Router = router;
