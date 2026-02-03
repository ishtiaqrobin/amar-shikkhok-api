import { prisma } from "../../lib/prisma";
import { BookingStatus } from "../../../generated/prisma";
import {
  CreateTutorInput,
  GetTutorsParams,
  UpdateTutorInput,
  CreateAvailabilityInput,
  UpdateAvailabilityInput,
} from "./tutor.interface";

// Create Tutor Profile
const createTutorProfile = async (payload: CreateTutorInput) => {
  const { categoryIds, ...tutorData } = payload;

  const result = await prisma.tutorProfile.create({
    data: {
      ...tutorData,
      categories: {
        connect: categoryIds.map((id) => ({ id })),
      },
    },

    include: {
      categories: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          image: true,
          isActive: true,
          isBanned: true,
        },
      },
      availabilities: true,
    },
  });

  return result;
};

// Get Tutors
const getTutors = async (params: GetTutorsParams) => {
  const {
    search,
    category,
    minPrice,
    maxPrice,
    minRating,
    page = 1,
    limit = 12,
  } = params;

  // Build AND conditions array
  const andConditions: any[] = [];

  // Search filter - OR logic for expertise, category name, or user name
  if (search) {
    andConditions.push({
      OR: [
        {
          expertise: {
            hasSome: [search],
          },
        },
        {
          categories: {
            some: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        },
        {
          user: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          user: {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
        {
          user: {
            id: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ],
    });
  }

  // Category filter
  if (category) {
    andConditions.push({
      categories: {
        some: {
          name: {
            equals: category,
            mode: "insensitive",
          },
        },
      },
    });
  }

  if (params.categoryId) {
    andConditions.push({
      categories: {
        some: {
          id: params.categoryId,
        },
      },
    });
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceCondition: any = {};
    if (minPrice !== undefined) {
      priceCondition.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      priceCondition.lte = maxPrice;
    }
    andConditions.push({
      hourlyRate: priceCondition,
    });
  }

  // Rating filter
  if (minRating !== undefined) {
    andConditions.push({
      rating: {
        gte: minRating,
      },
    });
  }

  // Build final where clause
  const whereClause = andConditions.length > 0 ? { AND: andConditions } : {};

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Get total count
  const total = await prisma.tutorProfile.count({
    where: whereClause,
  });

  // Get paginated results
  const data = await prisma.tutorProfile.findMany({
    where: whereClause,
    skip,
    take: limit,
    include: {
      categories: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          image: true,
          isActive: true,
          isBanned: true,
        },
      },
      availabilities: true,
    },
    orderBy: {
      rating: "desc",
    },
  });

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get Tutor By Id
const getTutorById = async (tutorId: string) => {
  const result = await prisma.tutorProfile.findUnique({
    where: {
      id: tutorId,
    },
    include: {
      categories: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          image: true,
          isActive: true,
          isBanned: true,
        },
      },
      availabilities: true,
    },
  });

  return result;
};

// Update Tutor Profile
const updateTutorProfile = async (
  tutorId: string,
  payload: UpdateTutorInput,
) => {
  const { categoryIds, ...tutorData } = payload;

  const result = await prisma.tutorProfile.update({
    where: {
      id: tutorId,
    },
    data: {
      ...tutorData,
      ...(categoryIds && {
        categories: {
          set: categoryIds.map((categoryId) => ({ id: categoryId })),
        },
      }),
    },
  });

  return result;
};

// Add Availability
const addAvailability = async (payload: CreateAvailabilityInput) => {
  const result = await prisma.availability.create({
    data: payload,
  });

  return result;
};

// Update Availability
const updateAvailability = async (
  tutorId: string,
  payload: UpdateAvailabilityInput,
) => {
  const { dayOfWeek, ...updateData } = payload;

  const result = await prisma.availability.updateMany({
    where: {
      tutorId,
      dayOfWeek,
    },
    data: updateData,
  });

  return result;
};

// Get Availability
const getAvailability = async (tutorId: string) => {
  const result = await prisma.availability.findMany({
    where: {
      tutorId,
    },
    orderBy: {
      dayOfWeek: "asc",
    },
  });

  return result;
};

// Get Tutor Bookings
const getTutorBookings = async (tutorId: string, status?: string) => {
  const whereClause: any = { tutorId };

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
    },
    orderBy: {
      sessionDate: "desc",
    },
  });

  return result;
};

// Get tutor dashboard stats
const getTutorStats = async (userId: string) => {
  const tutor = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!tutor) {
    return {
      totalBookings: 0,
      upcomingBookings: 0,
      totalSessions: 0,
      totalRevenue: 0,
      rating: 0,
    };
  }

  const now = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(weekFromNow.getDate() + 7);

  // Get total bookings
  const totalBookings = await prisma.booking.count({
    where: { tutorId: tutor.id },
  });

  // Get upcoming bookings (Confirmed in next 7 days)
  const upcomingBookings = await prisma.booking.count({
    where: {
      tutorId: tutor.id,
      sessionDate: {
        gte: now,
        lte: weekFromNow,
      },
      status: BookingStatus.CONFIRMED,
    },
  });

  // Get total revenue
  const revenue = await prisma.booking.aggregate({
    where: {
      tutorId: tutor.id,
      status: BookingStatus.COMPLETED,
    },
    _sum: {
      totalPrice: true,
    },
  });

  return {
    totalBookings,
    upcomingBookings,
    totalSessions: tutor.totalSessions,
    totalRevenue: revenue._sum.totalPrice || 0,
    rating: tutor.rating,
  };
};

export const TutorService = {
  createTutorProfile,
  getTutors,
  getTutorById,
  updateTutorProfile,
  addAvailability,
  updateAvailability,
  getAvailability,
  getTutorBookings,
  getTutorStats,
};
