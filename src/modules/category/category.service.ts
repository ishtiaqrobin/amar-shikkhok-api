import { prisma } from "../../lib/prisma";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.interface";

const createCategory = async (payload: CreateCategoryInput) => {
  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

const getCategories = async () => {
  const result = await prisma.category.findMany();
  return result;
};

const updateCategory = async (id: string, payload: UpdateCategoryInput) => {
  const result = await prisma.category.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const deleteCategory = async (id: string) => {
  const result = await prisma.category.delete({
    where: {
      id,
    },
  });

  return result;
};

export const CategoryService = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
