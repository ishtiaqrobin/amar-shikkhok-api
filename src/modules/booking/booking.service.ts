import { prisma } from "../../lib/prisma";
import { CreateBookingInput } from "./booking.interface";

// Create booking
const createBooking = async (payload: CreateBookingInput) => {
  const result = await prisma.booking.create({
    data: payload,
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

// Get all bookings
const getAllBookings = async () => {
  const result = await prisma.booking.findMany({
    include: {
      student: true,
      tutor: true,
    },
  });
  return result;
};

export const BookingService = {
  createBooking,
  getBookingById,
  getAllBookings,
};
