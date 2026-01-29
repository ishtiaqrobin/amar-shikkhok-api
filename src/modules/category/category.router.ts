import express, { Router } from "express";
import { CategoryController } from "./category.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

// Create category
router.post("/", auth(UserRole.ADMIN), CategoryController.createCategory);

export const categoryRouter: Router = router;
