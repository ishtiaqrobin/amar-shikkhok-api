import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { TutorController } from "./tutor.controller";

const router = express.Router();

// Public routes
router.get("/tutors", TutorController.getTutors);
router.get("/tutors/:tutorId", TutorController.getTutorById);

// Tutor-only routes
router.post(
  "/tutor/profile",
  auth(UserRole.TUTOR),
  TutorController.createTutorProfile,
);

router.put(
  "/tutor/profile",
  auth(UserRole.TUTOR),
  TutorController.updateTutorProfile,
);

router.post(
  "/tutor/availability",
  auth(UserRole.TUTOR),
  TutorController.addAvailability,
);

router.put(
  "/tutor/availability",
  auth(UserRole.TUTOR),
  TutorController.updateAvailability,
);

router.get(
  "/tutor/bookings",
  auth(UserRole.TUTOR),
  TutorController.getMyBookings,
);

router.get("/tutor/stats", auth(UserRole.TUTOR), TutorController.getTutorStats);

export const TutorRouter: Router = router;
