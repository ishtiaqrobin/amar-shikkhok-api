import { NextFunction, Request, Response } from "express";
import { PaymentService } from "./payment.service";

const getPaymentStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId || !role) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await PaymentService.getPaymentStats(userId, role);

    res.status(200).json({
      success: true,
      message: "Payment statistics retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getPaymentHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId || !role) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const result = await PaymentService.getPaymentHistory(userId, role);

    res.status(200).json({
      success: true,
      message: "Payment history retrieved successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const PaymentController = {
  getPaymentStats,
  getPaymentHistory,
};
