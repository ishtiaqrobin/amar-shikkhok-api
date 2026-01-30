import { Request, Response } from "express";
import { AdminService } from "./admin.service";

// Get all users (Admin only)
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role } = req.query;

    const result = await AdminService.getAllUsers(role as string);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to retrieve users",
      error: err,
    });
  }
};

// Ban user (Admin only)
const banUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const result = await AdminService.banUser(userId as string);

    res.status(200).json({
      success: true,
      message: "User banned successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to ban user",
      error: err,
    });
  }
};

// Unban user (Admin only)
const unbanUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const result = await AdminService.unbanUser(userId as string);

    res.status(200).json({
      success: true,
      message: "User unbanned successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message || "Failed to unban user",
      error: err,
    });
  }
};

// Get all bookings (Admin only)
const getAllBookings = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.getAllBookings();

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to retrieve bookings",
      error: err,
    });
  }
};

// Get dashboard statistics (Admin only)
const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const result = await AdminService.getDashboardStats();

    res.status(200).json({
      success: true,
      message: "Dashboard statistics retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to retrieve dashboard statistics",
      error: err,
    });
  }
};

export const AdminController = {
  getAllUsers,
  banUser,
  unbanUser,
  getAllBookings,
  getDashboardStats,
};
