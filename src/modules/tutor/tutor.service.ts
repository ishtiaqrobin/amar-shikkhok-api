import { email } from "better-auth/*";
import { prisma } from "../../lib/prisma";
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
    rating,
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
  if (rating !== undefined) {
    andConditions.push({
      rating: {
        gte: rating,
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
      categories: {
        set: categoryIds?.map((categoryId) => ({ id: categoryId })) || [],
      },
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

export const TutorService = {
  createTutorProfile,
  getTutors,
  getTutorById,
  updateTutorProfile,
  addAvailability,
  updateAvailability,
  getTutorBookings,
};
