import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { TutorController } from "./tutor.controller";

const router = express.Router();

// Create Tutor
router.post("/", auth(UserRole.TUTOR), TutorController.createTutor);

// Get all tutors
router.get("/", TutorController.getTutors);

// Get Tutor by ID
// router.get("/:id", TutorController.getTutorById);

// Update Tutor
// router.put("/:id", auth(UserRole.ADMIN), TutorController.updateTutor);

// Delete Tutor
// router.delete("/:id", auth(UserRole.ADMIN), TutorController.deleteTutor);

export const TutorRouter: Router = router;
