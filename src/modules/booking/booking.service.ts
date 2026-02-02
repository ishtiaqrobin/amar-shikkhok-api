import { prisma } from "../../lib/prisma";
import { CreateBookingInput } from "./booking.interface";

// Create booking with validations
const createBooking = async (payload: CreateBookingInput) => {
  const { studentId, tutorId, sessionDate, startTime, endTime } = payload;

  // 1. Check if tutor exists
  const tutor = await prisma.tutorProfile.findUnique({
    where: { id: tutorId },
  });

  if (!tutor) {
    throw new Error("Tutor not found");
  }

  // 2. Check if session date is in the future
  const bookingDate = new Date(sessionDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (bookingDate < today) {
    throw new Error("Session date must be in the future");
  }

  // 3. Check tutor availability
  // Use UTC date to get correct day of week
  const dayOfWeek = new Date(sessionDate + "T00:00:00Z").getUTCDay();

  // Convert time strings to minutes for proper comparison
  const timeToMinutes = (time: string) => {
    const [hours = 0, minutes = 0] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const bookingStart = timeToMinutes(startTime);
  const bookingEnd = timeToMinutes(endTime);

  const availability = await prisma.availability.findFirst({
    where: {
      tutorId,
      dayOfWeek,
      isAvailable: true,
    },
  });

  if (!availability) {
    throw new Error(`Tutor is not available on this day (Day: ${dayOfWeek})`);
  }

  // Check if booking time is within availability range
  const availStart = timeToMinutes(availability.startTime);
  const availEnd = timeToMinutes(availability.endTime);

  if (bookingStart < availStart || bookingEnd > availEnd) {
    throw new Error(
      `Tutor is available from ${availability.startTime} to ${availability.endTime}`,
    );
  }

  // 4. Check for duplicate booking (same student, tutor, date, time)
  const existingBooking = await prisma.booking.findFirst({
    where: {
      studentId,
      tutorId,
      sessionDate: bookingDate,
      startTime,
      endTime,
      status: { not: "CANCELLED" },
    },
  });

  if (existingBooking) {
    throw new Error("You already have a booking at this time with this tutor");
  }

  // 5. Calculate total price
  const [startHour = 0, startMin = 0] = startTime.split(":").map(Number);
  const [endHour = 0, endMin = 0] = endTime.split(":").map(Number);
  const hours = endHour - startHour + (endMin - startMin) / 60;
  const totalPrice = tutor.hourlyRate * hours;

  // Create booking
  const result = await prisma.booking.create({
    data: {
      ...payload,
      sessionDate: bookingDate,
      totalPrice,
    },
  });

  return result;
};

// Get booking by id
const getBookingById = async (bookingId: string) => {
  const result = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
      tutor: {
        select: {
          id: true,
          hourlyRate: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return result;
};

// Get user bookings (role-based)
const getUserBookings = async (
  userId: string,
  role: string,
  status?: string,
) => {
  const whereClause: any = {};

  // Filter by role
  if (role === "STUDENT") {
    whereClause.studentId = userId;
  } else if (role === "TUTOR") {
    // Get tutor profile first
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!tutorProfile) {
      throw new Error("Tutor profile not found");
    }

    whereClause.tutorId = tutorProfile.id;
  }

  // Filter by status if provided
  if (status) {
    whereClause.status = status;
  }

  const result = await prisma.booking.findMany({
    where: whereClause,
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
      tutor: {
        select: {
          id: true,
          hourlyRate: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      review: true,
    },
    orderBy: {
      sessionDate: "desc",
    },
  });

  return result;
};

// Complete booking (Tutor only)
const completeBooking = async (bookingId: string, tutorId: string) => {
  // Check if booking exists and belongs to tutor
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      tutorId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found or you don't have permission");
  }

  if (booking.status !== "CONFIRMED") {
    throw new Error("Only confirmed bookings can be completed");
  }

  // Update booking status
  const result = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "COMPLETED" },
  });

  // Update tutor's total sessions
  await prisma.tutorProfile.update({
    where: { id: tutorId },
    data: {
      totalSessions: {
        increment: 1,
      },
    },
  });

  return result;
};

// Cancel booking (Student only)
const cancelBooking = async (bookingId: string, studentId: string) => {
  // Check if booking exists and belongs to student
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      studentId,
    },
  });

  if (!booking) {
    throw new Error("Booking not found or you don't have permission");
  }

  if (booking.status !== "CONFIRMED") {
    throw new Error("Only confirmed bookings can be cancelled");
  }

  // Update booking status
  const result = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });

  return result;
};

export const BookingService = {
  createBooking,
  getBookingById,
  getUserBookings,
  completeBooking,
  cancelBooking,
};
