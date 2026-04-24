import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { PaymentController } from "./payment.controller";

const router = express.Router();

router.get(
  "/stats",
  auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
  PaymentController.getPaymentStats,
);

router.get(
  "/history",
  auth(UserRole.STUDENT, UserRole.TUTOR, UserRole.ADMIN),
  PaymentController.getPaymentHistory,
);

export const PaymentRouter: Router = router;
