import { prisma } from "../../lib/prisma";
import { CreateTutorInput, GetTutorsParams } from "./tutor.interface";

const createTutor = async (payload: CreateTutorInput) => {
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

const getTutors = async (params: GetTutorsParams) => {
  const { search, category, minPrice, maxPrice, rating } = params;

  // Build where clause dynamically
  const whereClause: any = {};

  // Search filter - OR logic for expertise, category name, or user name
  if (search) {
    whereClause.OR = [
      {
        expertise: {
          hasSome: [search], // Search in expertise array
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
    ];
  }

  // Category filter
  if (category) {
    whereClause.categories = {
      some: {
        name: {
          equals: category,
          mode: "insensitive",
        },
      },
    };
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    whereClause.hourlyRate = {};
    if (minPrice !== undefined) {
      whereClause.hourlyRate.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      whereClause.hourlyRate.lte = maxPrice;
    }
  }

  // Rating filter
  if (rating !== undefined) {
    whereClause.rating = {
      gte: rating,
    };
  }

  const result = await prisma.tutorProfile.findMany({
    where: whereClause,
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
      rating: "desc", // Sort by rating (highest first)
    },
  });

  return result;
};

export const TutorService = {
  createTutor,
  getTutors,
};
