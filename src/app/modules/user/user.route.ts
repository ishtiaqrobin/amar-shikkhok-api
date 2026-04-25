import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { UserController } from "./user.controller";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

// Get current user profile
router.get(
  "/me",
  auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
  UserController.getMe,
);

// Update user profile
router.put(
  "/profile",
  auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
  multerUpload.single("image"),
  UserController.updateProfile,
);

// Get student dashboard stats
router.get("/stats", auth(UserRole.STUDENT), UserController.getStudentStats);

export const UserRouter: Router = router;
