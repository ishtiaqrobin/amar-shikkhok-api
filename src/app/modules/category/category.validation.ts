import { z } from "zod";

const createCategoryZodSchema = z.object({
  name: z.string("Name is required"),
  description: z.string("Description is required").optional(),
});

const updateCategoryZodSchema = z.object({
  name: z.string("Name is required").optional(),
  description: z.string("Description is required").optional(),
});

export const CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
};
