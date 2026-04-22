import { z } from "zod";

const createTutorProfileZodSchema = z.object({
  bio: z.string("Bio is required").optional(),
  expertise: z.array(z.string("Expertise is required")),
  hourlyRate: z.number("Hourly rate is required"),
  experience: z.number("Experience is required"),
  // rating: z.number("Rating is required"),
  education: z.string("Education is required").optional(),
  categoryIds: z.array(z.string("Category ID is required")),
});

const updateTutorProfileZodSchema = z.object({
  bio: z.string("Bio is required").optional(),
  expertise: z.array(z.string("Expertise is required")).optional(),
  hourlyRate: z.number("Hourly rate is required").optional(),
  experience: z.number("Experience is required").optional(),
  // rating: z.number("Rating is required").optional(),
  education: z.string("Education is required").optional(),
  categoryIds: z.array(z.string("Category ID is required")).optional(),
});

const createAvailabilityZodSchema = z.object({
  dayOfWeek: z.enum([
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ]),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), // HH:MM format
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/), // HH:MM format
  tutorId: z.string().cuid(),
});

const updateAvailabilityZodSchema = z.object({
  id: z.string().cuid(),
  dayOfWeek: z
    .enum([
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ])
    .optional(),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .optional(),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/)
    .optional(),
});

export const TutorValidation = {
  createTutorProfileZodSchema,
  updateTutorProfileZodSchema,
  createAvailabilityZodSchema,
  updateAvailabilityZodSchema,
};
