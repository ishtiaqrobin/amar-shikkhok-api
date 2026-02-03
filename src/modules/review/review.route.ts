import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { ReviewController } from "./review.controller";

const router = express.Router();

// Create review (Student only)
router.post("/", auth(UserRole.STUDENT), ReviewController.createReview);

// Get all reviews (Public) - Note: This needs to be before tutor route if it was ambiguous, but /tutor/:tutorId is specific enough
router.get("/", ReviewController.getAllReviews);

// Get tutor reviews (Public)
router.get("/tutor/:tutorId", ReviewController.getTutorReviews);

export const ReviewRouter: Router = router;
