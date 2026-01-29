import { prisma } from "../../lib/prisma";

interface CreateCategoryInput {
  name: string;
  description?: string;
}

const createCategory = async (data: CreateCategoryInput) => {
  const result = await prisma.category.create({
    data,
  });

  return result;
};

export const CategoryService = {
  createCategory,
};
