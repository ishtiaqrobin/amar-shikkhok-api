import { prisma } from "../../lib/prisma";
import { UpdateUserInput } from "./user.interface";

// Get user profile
const getUserProfile = async (userId: string) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      image: true,
      isActive: true,
      isBanned: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return result;
};

// Update user profile
const updateUserProfile = async (userId: string, data: UpdateUserInput) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      image: true,
      isActive: true,
      isBanned: true,
      updatedAt: true,
    },
  });

  return result;
};

// Get student dashboard stats
const getStudentStats = async (studentId: string) => {
  const now = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  // Get all bookings
  const allBookings = await prisma.booking.findMany({
    where: { studentId },
  });

  // Get upcoming classes (next 7 days)
  const upcomingBookings = await prisma.booking.findMany({
    where: {
      studentId,
      sessionDate: {
        gte: now,
        lte: weekFromNow,
      },
      status: { in: ["CANCELLED", "CONFIRMED"] },
    },
  });

  // Get completed classes
  const completedBookings = await prisma.booking.findMany({
    where: {
      studentId,
      status: "COMPLETED",
    },
  });

  // Calculate total hours
  const totalHours = completedBookings.reduce((sum, booking) => {
    const [startHour = 0, startMin = 0] = booking.startTime
      .split(":")
      .map(Number);
    const [endHour = 0, endMin = 0] = booking.endTime.split(":").map(Number);
    const hours = endHour - startHour + (endMin - startMin) / 60;
    return sum + hours;
  }, 0);

  return {
    totalBookings: allBookings.length,
    upcomingClasses: upcomingBookings.length,
    completedClasses: completedBookings.length,
    totalHours: Math.round(totalHours * 10) / 10,
  };
};

export const UserService = {
  getUserProfile,
  updateUserProfile,
  getStudentStats,
};
