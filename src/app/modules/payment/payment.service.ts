import { prisma } from "../../lib/prisma";

const getPaymentStats = async (userId: string, role: string) => {
  if (role === "STUDENT") {
    const totalSpent = await prisma.booking.aggregate({
      where: {
        studentId: userId,
        paymentStatus: "PAID",
      },
      _sum: {
        totalPrice: true,
      },
    });

    const totalBookings = await prisma.booking.count({
      where: {
        studentId: userId,
        paymentStatus: "PAID",
      },
    });

    return {
      totalSpent: totalSpent._sum.totalPrice || 0,
      totalBookings,
    };
  }

  if (role === "TUTOR") {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });

    if (!tutorProfile) {
      throw new Error("Tutor profile not found");
    }

    return {
      totalEarnings: tutorProfile.totalEarnings,
      withdrawableBalance: tutorProfile.withdrawableBalance,
      totalSessions: tutorProfile.totalSessions,
    };
  }

  if (role === "ADMIN") {
    const totalRevenue = await prisma.booking.aggregate({
      where: {
        paymentStatus: "PAID",
      },
      _sum: {
        totalPrice: true,
      },
    });

    const totalPayments = await prisma.booking.count({
      where: {
        paymentStatus: "PAID",
      },
    });

    const totalUsers = await prisma.user.count();
    const totalTutors = await prisma.tutorProfile.count();

    return {
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      totalPayments,
      totalUsers,
      totalTutors,
    };
  }

  return null;
};

const getPaymentHistory = async (userId: string, role: string) => {
  const whereClause: any = {
    paymentStatus: "PAID",
  };

  if (role === "STUDENT") {
    whereClause.studentId = userId;
  } else if (role === "TUTOR") {
    const tutorProfile = await prisma.tutorProfile.findUnique({
      where: { userId },
    });
    if (tutorProfile) {
      whereClause.tutorId = tutorProfile.id;
    }
  }

  const history = await prisma.booking.findMany({
    where: whereClause,
    include: {
      student: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      tutor: {
        include: {
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
      updatedAt: "desc",
    },
  });

  return history;
};

export const PaymentService = {
  getPaymentStats,
  getPaymentHistory,
};
