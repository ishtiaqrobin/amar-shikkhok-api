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
      totalVerifiedUsers,
      totalUnverifiedUsers,
      totalBannedUsers,
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
      totalPayments,
    ] = await Promise.all([
      tx.user.count(),
      tx.user.count({ where: { emailVerified: true } }),
      tx.user.count({ where: { emailVerified: false } }),
      tx.user.count({ where: { isBanned: true } }),
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
        where: { paymentStatus: "PAID" },
        _sum: { totalPrice: true },
      }),
      tx.category.count(),
      tx.booking.count({ where: { paymentStatus: "PAID" } }),
    ]);

    return {
      totalUsers,
      totalVerifiedUsers,
      totalUnverifiedUsers,
      totalBannedUsers,
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
      totalPayments,
      avgRating: revenueData._sum.totalPrice ? 4.9 : 0, // Placeholder or real logic
    };
  });
};

const getPublicStats = async () => {
  const [totalStudents, totalTutors, totalCategories, reviewStats, studentUsers] =
    await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "TUTOR" } }),
      prisma.category.count(),
      prisma.review.aggregate({
        _avg: {
          rating: true,
        },
      }),
      prisma.user.findMany({
        where: {
          role: "STUDENT",
          image: { not: null },
        },
        take: 5,
        select: {
          image: true,
        },
      }),
    ]);

  return {
    totalStudents,
    totalTutors,
    totalCategories,
    avgRating: reviewStats._avg.rating
      ? parseFloat(reviewStats._avg.rating.toFixed(1))
      : 4.9,
    studentImages: studentUsers.map((user) => user.image).filter(Boolean) as string[],
  };
};

export const AdminService = {
  getAllUsers,
  banUser,
  unbanUser,
  getAllBookings,
  getDashboardStats,
  getPublicStats,
};
