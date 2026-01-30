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
    res.status(500).json({
      success: false,
      message: "Failed to create tutor",
      error: err,
    });
  }
};

// Get Tutors
const getTutors = async (req: Request, res: Response) => {
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

// Get Tutor By Id
const getTutorById = async (req: Request, res: Response) => {
  try {
    const { tutorId } = req.params;

    const result = await TutorService.getTutorById(tutorId as string);
    res.status(200).json({
      success: true,
      message: "Tutor fetched successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutor",
      error: err,
    });
  }
};

// Update Tutor Profile
const updateTutorProfile = async (req: Request, res: Response) => {
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
    res.status(500).json({
      success: false,
      message: "Failed to update tutor",
      error: err,
    });
  }
};

// Add Availability
const addAvailability = async (req: Request, res: Response) => {
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
    const tutor = tutorProfile.find((t) => t.userId === userId);

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
    res.status(500).json({
      success: false,
      message: "Failed to add availability",
      error: err,
    });
  }
};

// Update Availability
const updateAvailability = async (req: Request, res: Response) => {
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
    const tutor = tutorProfile.find((t) => t.userId === userId);

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
    res.status(500).json({
      success: false,
      message: "Failed to update availability",
      error: err,
    });
  }
};

// Get My Bookings (Tutor)
const getMyBookings = async (req: Request, res: Response) => {
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
    const tutor = tutorProfile.find((t) => t.userId === userId);

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
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: err,
    });
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
};
