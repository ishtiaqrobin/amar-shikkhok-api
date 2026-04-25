import { Request, Response } from "express";
import { SettingService } from "./setting.service";
import status from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const updateSetting = catchAsync(async (req: Request, res: Response) => {
  const { key, value } = req.body;
  const result = await SettingService.updateSetting(key, value);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Setting updated successfully",
    data: result,
  });
});

const getAllSettings = catchAsync(async (req: Request, res: Response) => {
  const result = await SettingService.getAllSettings();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Settings retrieved successfully",
    data: result,
  });
});

export const SettingController = {
  updateSetting,
  getAllSettings,
};
