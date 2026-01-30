import { Request, Response } from "express";
import { ReviewService } from "./review.service";

// Create Review (Student only)
const createReview = async (req: Request, res: Response) => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await ReviewService.createReview({
      studentId,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to create review",
      error: err,
    });
  }
};

// Get Tutor Reviews (Public)
const getTutorReviews = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;

    if (!tutorId) {
      return res.status(400).json({
        success: false,
        message: "Tutor ID is required",
      });
    }

    const result = await ReviewService.getTutorReviews(tutorId as string);

    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to retrieve reviews",
      error: err,
    });
  }
};

export const ReviewController = {
  createReview,
  getTutorReviews,
};
