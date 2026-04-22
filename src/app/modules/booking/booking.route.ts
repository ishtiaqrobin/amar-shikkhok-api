import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { BookingController } from "./booking.controller";

const router = express.Router();

// Get my bookings (Student/Tutor)
router.get(
  "/",
  auth(UserRole.STUDENT, UserRole.TUTOR),
  BookingController.getMyBookings,
);

// Get booking by id (Student, Tutor)
router.get(
  "/:bookingId",
  auth(UserRole.STUDENT, UserRole.TUTOR),
  BookingController.getBookingById,
);

// Create Booking (Student only)
router.post("/", auth(UserRole.STUDENT), BookingController.createBooking);

// Complete booking (Tutor only)
router.patch(
  "/:bookingId/complete",
  auth(UserRole.TUTOR),
  BookingController.completeBooking,
);

// Cancel booking (Student only)
router.patch(
  "/:bookingId/cancel",
  auth(UserRole.STUDENT),
  BookingController.cancelBooking,
);

export const BookingRouter: Router = router;
