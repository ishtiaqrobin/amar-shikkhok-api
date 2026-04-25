import express, { Router } from "express";
import auth, { UserRole } from "../../middlewares/auth";
import { PaymentController } from "./payment.controller";
import { WithdrawalController } from "./withdrawal.controller";

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

// Withdrawal Routes
router.post(
  "/withdrawals",
  auth(UserRole.TUTOR),
  WithdrawalController.createWithdrawalRequest
);

router.get(
  "/withdrawals/my",
  auth(UserRole.TUTOR),
  WithdrawalController.getTutorWithdrawals
);

router.get(
  "/withdrawals",
  auth(UserRole.ADMIN),
  WithdrawalController.getAllWithdrawals
);

router.patch(
  "/withdrawals/:withdrawalId",
  auth(UserRole.ADMIN),
  WithdrawalController.updateWithdrawalStatus
);

export const PaymentRouter: Router = router;
