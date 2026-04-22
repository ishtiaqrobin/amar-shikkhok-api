import { prisma } from "../../lib/prisma";
import { DashboardStats } from "./admin.interface";

// Get all users with optional role filter
const getAllUsers = async (role?: string) => {
  const whereClause: any = {};

  if (role) {
    whereClause.role = role;
  }

  const result = await prisma.user.findMany({
    where: whereClause,
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

// Ban user
const banUser = async (userId: string) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: { isBanned: true },
    select: {
      id: true,
      name: true,
      email: true,
      isBanned: true,
    },
  });

  return result;
};

// Unban user
const unbanUser = async (userId: string) => {
  const result = await prisma.user.update({
    where: { id: userId },
    data: { isBanned: false },
    select: {
      id: true,
      name: true,
      email: true,
      isBanned: true,
    },
  });

  return result;
};

// Get all bookings
const getAllBookings = async () => {
  const result = await prisma.booking.findMany({
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
              email: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

// Get dashboard statistics
const getDashboardStats = async (): Promise<DashboardStats> => {
  return await prisma.$transaction(async (tx) => {
    const [
      totalUsers,
      totalStudents,
      totalTutors,
      totalAdmins,
      totalTutorProfiles,
      availableTutors,
      totalBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      revenueData,
      totalCategories,
    ] = await Promise.all([
      tx.user.count(),
      tx.user.count({ where: { role: "STUDENT" } }),
      tx.user.count({ where: { role: "TUTOR" } }),
      tx.user.count({ where: { role: "ADMIN" } }),
      tx.tutorProfile.count(),
      tx.availability.count({ where: { isAvailable: true } }),
      tx.booking.count(),
      tx.booking.count({ where: { status: "CONFIRMED" } }),
      tx.booking.count({ where: { status: "COMPLETED" } }),
      tx.booking.count({ where: { status: "CANCELLED" } }),
      tx.booking.aggregate({
        where: { status: "COMPLETED" },
        _sum: { totalPrice: true },
      }),
      tx.category.count(),
    ]);

    return {
      totalUsers,
      totalStudents,
      totalTutors,
      totalAdmins,
      totalTutorProfiles,
      availableTutors,
      totalBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue: revenueData._sum.totalPrice || 0,
      totalCategories,
    };
  });
};

export const AdminService = {
  getAllUsers,
  banUser,
  unbanUser,
  getAllBookings,
  getDashboardStats,
};
