import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { UserController } from "./user.controller";

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
  UserController.updateProfile,
);

// Change password
router.put(
  "/password",
  auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
  UserController.changePassword,
);

export const UserRouter: Router = router;
