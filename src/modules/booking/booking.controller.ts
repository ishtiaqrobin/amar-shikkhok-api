import { NextFunction, Request, Response } from "express";
import { BookingService } from "./booking.service";

// Create booking
const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await BookingService.createBooking({
      studentId,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to create booking",
      error: err,
    });
  }
};

// Get booking by id
const getBookingById = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    const booking = await BookingService.getBookingById(bookingId as string);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Transform the response
    const result = {
      ...booking,
      tutor: {
        id: booking.tutor.id,
        name: booking.tutor.user.name,
        image: booking.tutor.user.image,
        hourlyRate: booking.tutor.hourlyRate,
      },
    };

    res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve booking",
      error: err,
    });
  }
};

// Get my bookings (Student/Tutor)
const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;
    const { status } = req.query;

    if (!userId || !role) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await BookingService.getUserBookings(
      userId,
      role,
      status as string,
    );

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to retrieve bookings",
      error: err,
    });
  }
};

// Complete booking (Tutor only)
const completeBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { bookingId } = req.params;

    if (!userId || !bookingId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated or invalid booking",
      });
    }

    // Get tutor profile
    const tutorProfile = await BookingService.getUserBookings(userId, "TUTOR");

    if (!tutorProfile || tutorProfile.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Tutor profile not found",
      });
    }

    const tutorId = tutorProfile[0]?.tutorId;

    if (!tutorId) {
      return res.status(404).json({
        success: false,
        message: "Tutor ID not found",
      });
    }

    const result = await BookingService.completeBooking(
      bookingId as string,
      tutorId,
    );

    res.status(200).json({
      success: true,
      message: "Booking completed successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to complete booking",
      error: err,
    });
  }
};

// Cancel booking (Student only)
const cancelBooking = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;
    const { bookingId } = req.params;

    if (!studentId || !bookingId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated or invalid booking",
      });
    }

    const result = await BookingService.cancelBooking(
      bookingId as string,
      studentId,
    );

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to cancel booking",
      error: err,
    });
  }
};

export const BookingController = {
  createBooking,
  getBookingById,
  getMyBookings,
  completeBooking,
  cancelBooking,
};
