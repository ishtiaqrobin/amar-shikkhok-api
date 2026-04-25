import { Request, Response } from "express";
import { WithdrawalService } from "./withdrawal.service";

import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createWithdrawalRequest = catchAsync(
  async (req: Request, res: Response) => {
    const { amount, notes } = req.body;
    const user = (req as any).user;
    const result = await WithdrawalService.createWithdrawalRequest(
      user.id,
      amount,
      notes,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Withdrawal request created successfully",
      data: result,
    });
  },
);

const getTutorWithdrawals = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await WithdrawalService.getTutorWithdrawals(user.id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Withdrawal history retrieved successfully",
    data: result,
  });
});

const getAllWithdrawals = catchAsync(async (req: Request, res: Response) => {
  const result = await WithdrawalService.getAllWithdrawals(req.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All withdrawal requests retrieved successfully",
    data: result,
  });
});

const updateWithdrawalStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { withdrawalId } = req.params;
    const { status: withdrawalStatus, transactionId } = req.body;
    const result = await WithdrawalService.updateWithdrawalStatus(
      withdrawalId as string,
      withdrawalStatus,
      transactionId,
    );

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Withdrawal status updated successfully",
      data: result,
    });
  },
);

export const WithdrawalController = {
  createWithdrawalRequest,
  getTutorWithdrawals,
  getAllWithdrawals,
  updateWithdrawalStatus,
};
