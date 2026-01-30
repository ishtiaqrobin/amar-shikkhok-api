import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { BookingController } from "./booking.controller";

const router = express.Router();

// Booking a tutor (Student only)
router.post("/", auth(UserRole.STUDENT), BookingController.createBooking);

// Get booking by id (Student, Tutor, Admin)
router.get(
  "/:bookingId",
  auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
  BookingController.getBookingById,
);

// Get all bookings (Admin only)
router.get("/", auth(UserRole.ADMIN), BookingController.getAllBookings);

export const BookingRouter: Router = router;
