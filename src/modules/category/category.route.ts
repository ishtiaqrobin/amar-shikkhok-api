import express, { Router } from "express";
import { CategoryController } from "./category.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

// Get all categories
router.get("/", CategoryController.getCategories);

// Create category
router.post("/", auth(UserRole.ADMIN), CategoryController.createCategory);

// Update category
router.put(
  "/:categoryId",
  auth(UserRole.ADMIN),
  CategoryController.updateCategory,
);

// Delete category
router.delete(
  "/:categoryId",
  auth(UserRole.ADMIN),
  CategoryController.deleteCategory,
);

export const CategoryRouter: Router = router;
