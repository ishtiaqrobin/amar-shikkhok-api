import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { TutorController } from "./tutor.controller";
import { multerUpload } from "../../config/multer.config";
import { TutorValidation } from "./tutor.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = express.Router();

// Public routes
router.get("/", TutorController.getTutors);
router.get("/profile/me", auth(UserRole.TUTOR), TutorController.getMyProfile);

// Specific Tutor routes (must come before /:tutorId)
router.get(
  "/availability",
  auth(UserRole.TUTOR),
  TutorController.getAvailability,
);
router.get("/bookings", auth(UserRole.TUTOR), TutorController.getMyBookings);
router.get("/stats", auth(UserRole.TUTOR), TutorController.getTutorStats);

router.get("/:tutorId", TutorController.getTutorById);

// Tutor-only routes
router.post(
  "/profile",
  auth(UserRole.TUTOR),
  // multerUpload.single("file"),
  validateRequest(TutorValidation.createTutorProfileZodSchema),
  TutorController.createTutorProfile,
);

router.put(
  "/profile/me",
  auth(UserRole.TUTOR),
  TutorController.updateMyProfile,
);

router.put(
  "/profile/:tutorId",
  auth(UserRole.TUTOR),
  TutorController.updateTutorProfile,
);

router.post(
  "/availability",
  auth(UserRole.TUTOR),
  TutorController.addAvailability,
);

router.put(
  "/availability",
  auth(UserRole.TUTOR),
  TutorController.updateAvailability,
);

export const TutorRouter: Router = router;
