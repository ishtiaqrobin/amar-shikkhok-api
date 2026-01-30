import { Request, Response } from "express";
import { UserService } from "./user.service";

// Get current user profile
const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await UserService.getUserProfile(userId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to retrieve user profile",
      error: err,
    });
  }
};

// Update user profile
const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await UserService.updateUserProfile(userId, req.body);

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to update user profile",
      error: err,
    });
  }
};

export const UserController = {
  getMe,
  updateProfile,
};
