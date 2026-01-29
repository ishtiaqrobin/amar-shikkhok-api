import { NextFunction, Request, Response } from "express";
import { TutorService } from "./tutor.service";

const createTutor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get userId from authenticated user
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await TutorService.createTutor({
      ...req.body,
      userId: userId as string,
    });

    res.status(201).json({
      success: true,
      message: "Tutor created successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create tutor",
      error: err,
    });
  }
};

const getTutors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, category, minPrice, maxPrice, rating } = req.query;

    // Build params object dynamically to avoid undefined values
    const params: any = {};
    if (search) params.search = search as string;
    if (category) params.category = category as string;
    if (minPrice) params.minPrice = Number(minPrice);
    if (maxPrice) params.maxPrice = Number(maxPrice);
    if (rating) params.rating = Number(rating);

    const result = await TutorService.getTutors(params);

    res.status(200).json({
      success: true,
      message: "Tutors fetched successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutors",
      error: err,
    });
  }
};

export const TutorController = {
  createTutor,
  getTutors,
};
