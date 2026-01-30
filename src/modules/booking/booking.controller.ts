import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import { BookingService } from "./booking.service";

// Create booking
const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get studentId from authenticated user
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { tutorId, subject, sessionDate, startTime, endTime, notes } =
      req.body;

    // Get tutor's hourly rate to calculate total price
    const tutor = await prisma.tutorProfile.findUnique({
      where: { id: tutorId },
      select: { hourlyRate: true },
    });

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found",
      });
    }

    // Calculate duration in hours (simple calculation)
    const start = parseInt(startTime.split(":")[0]);
    const end = parseInt(endTime.split(":")[0]);
    const duration = end - start;
    const totalPrice = tutor.hourlyRate * duration;

    const result = await BookingService.createBooking({
      studentId,
      tutorId,
      subject,
      sessionDate: new Date(sessionDate),
      startTime,
      endTime,
      notes,
      totalPrice,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
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

    // Transform the response to match expected format
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

// Get all bookings (only admin can access)
const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await BookingService.getAllBookings();

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
      error: err,
    });
  }
};

export const BookingController = {
  createBooking,
  getBookingById,
  getAllBookings,
};
