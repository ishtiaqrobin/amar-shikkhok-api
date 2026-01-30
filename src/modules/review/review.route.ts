import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { ReviewController } from "./review.controller";

const router = express.Router();

// Create review (Student only)
router.post("/", auth(UserRole.STUDENT), ReviewController.createReview);

export const reviewRouter: Router = router;
