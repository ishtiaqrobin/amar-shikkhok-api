import { NextFunction, Request, Response } from "express";
import { TutorService } from "./tutor.service";

// Create Tutor Profile
const createTutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get userId from authenticated user
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await TutorService.createTutorProfile({
      ...req.body,
      userId: userId as string,
    });

    res.status(201).json({
      success: true,
      message: "Tutor created successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get Tutors
const getTutors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      search,
      category,
      categoryId,
      minPrice,
      maxPrice,
      minRating,
      page,
      limit,
    } = req.query;

    // Build params object dynamically to avoid undefined values
    const params: any = {};
    if (search) params.search = search as string;
    if (category) params.category = category as string;
    if (categoryId) params.categoryId = categoryId as string;
    if (minPrice) params.minPrice = Number(minPrice);
    if (maxPrice) params.maxPrice = Number(maxPrice);
    if (minRating) params.minRating = Number(minRating);
    if (page) params.page = Number(page);
    if (limit) params.limit = Number(limit);

    const result = await TutorService.getTutors(params);

    res.status(200).json({
      success: true,
      message: "Tutors fetched successfully",
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

// Get Tutor By Id
const getTutorById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tutorId } = req.params;

    const result = await TutorService.getTutorById(tutorId as string);
    res.status(200).json({
      success: true,
      message: "Tutor fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update Tutor Profile
const updateTutorProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { tutorId } = req.params;

    const result = await TutorService.updateTutorProfile(
      tutorId as string,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Tutor updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Add Availability
const addAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Get tutor profile
    const tutorProfile = await TutorService.getTutors({ search: userId });
    const tutor = tutorProfile.data.find((t: any) => t.userId === userId);

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "Tutor profile not found",
      });
    }

    const result = await TutorService.addAvailability({
      tutorId: tutor.id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      message: "Availability added successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Update Availability
const updateAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Get tutor profile
    const tutorProfile = await TutorService.getTutors({ search: userId });
    const tutor = tutorProfile.data.find((t: any) => t.userId === userId);

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "Tutor profile not found",
      });
    }

    const result = await TutorService.updateAvailability(tutor.id, req.body);

    res.status(200).json({
      success: true,
      message: "Availability updated successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get My Bookings (Tutor)
const getMyBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const { status } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Get tutor profile
    const tutorProfile = await TutorService.getTutors({ search: userId });
    const tutor = tutorProfile.data.find((t: any) => t.userId === userId);

    if (!tutor) {
      return res.status(404).json({
        success: false,
        message: "Tutor profile not found",
      });
    }

    const result = await TutorService.getTutorBookings(
      tutor.id,
      status as string,
    );

    res.status(200).json({
      success: true,
      message: "Bookings fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Get tutor dashboard stats
const getTutorStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await TutorService.getTutorStats(userId);

    res.status(200).json({
      success: true,
      message: "Tutor stats fetched successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const TutorController = {
  createTutorProfile,
  getTutors,
  getTutorById,
  updateTutorProfile,
  addAvailability,
  updateAvailability,
  getMyBookings,
  getTutorStats,
};
