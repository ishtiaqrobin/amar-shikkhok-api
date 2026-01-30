import { prisma } from "../../lib/prisma";
import { CreateReviewInput } from "./review.interface";

// Create review with validations
const createReview = async (payload: CreateReviewInput) => {
  const { studentId, bookingId, rating, comment } = payload;

  // 1. Check if booking exists and belongs to student
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
      studentId,
    },
    include: {
      tutor: true,
    },
  });

  if (!booking) {
    throw new Error("Booking not found or you don't have permission");
  }

  // 2. Check if booking is completed
  if (booking.status !== "COMPLETED") {
    throw new Error("You can only review completed bookings");
  }

  // 3. Check if review already exists
  const existingReview = await prisma.review.findFirst({
    where: {
      bookingId,
    },
  });

  if (existingReview) {
    throw new Error("You have already reviewed this booking");
  }

  // 4. Create review
  const result = await prisma.review.create({
    data: {
      studentId,
      tutorId: booking.tutorId,
      bookingId,
      rating,
      comment: comment ?? null, // Convert undefined to null for Prisma
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  // 5. Update tutor's average rating and total reviews
  const reviews = await prisma.review.findMany({
    where: { tutorId: booking.tutorId },
    select: { rating: true },
  });

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await prisma.tutorProfile.update({
    where: { id: booking.tutorId },
    data: {
      rating: avgRating,
      totalReviews: reviews.length,
    },
  });

  return result;
};

// Get tutor reviews
const getTutorReviews = async (tutorId: string) => {
  const result = await prisma.review.findMany({
    where: { tutorId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

export const ReviewService = {
  createReview,
  getTutorReviews,
};
