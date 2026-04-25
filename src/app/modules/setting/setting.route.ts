import express from "express";
import { SettingController } from "./setting.controller";
import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN),
  SettingController.getAllSettings
);

router.post(
  "/",
  auth(UserRole.ADMIN),
  SettingController.updateSetting
);

export const SettingRouter = router;
