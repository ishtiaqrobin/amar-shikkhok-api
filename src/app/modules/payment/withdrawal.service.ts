import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const createWithdrawalRequest = async (
  userId: string,
  amount: number,
  notes?: string,
) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!tutorProfile) {
    throw new AppError(status.NOT_FOUND, "Tutor profile not found");
  }

  if (tutorProfile.withdrawableBalance < amount) {
    throw new AppError(status.BAD_REQUEST, "Insufficient balance");
  }

  // Create withdrawal and update balance in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const withdrawal = await tx.withdrawal.create({
      data: {
        tutorId: tutorProfile.id as string,
        amount: amount as number,
        notes: notes as string,
        status: "PENDING",
      },
    });

    await tx.tutorProfile.update({
      where: { id: tutorProfile.id },
      data: {
        withdrawableBalance: {
          decrement: amount,
        },
      },
    });

    return withdrawal;
  });

  return result;
};

const getTutorWithdrawals = async (userId: string) => {
  const tutorProfile = await prisma.tutorProfile.findUnique({
    where: { userId },
  });

  if (!tutorProfile) {
    throw new AppError(status.NOT_FOUND, "Tutor profile not found");
  }

  return await prisma.withdrawal.findMany({
    where: { tutorId: tutorProfile.id },
    orderBy: { createdAt: "desc" },
  });
};

const getAllWithdrawals = async (query: any) => {
  const { status: withdrawalStatus } = query;
  return await prisma.withdrawal.findMany({
    where: withdrawalStatus ? { status: withdrawalStatus } : {},
    include: {
      tutor: {
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateWithdrawalStatus = async (
  withdrawalId: string,
  withdrawalStatus: "APPROVED" | "REJECTED",
  transactionId?: string,
) => {
  const withdrawal = await prisma.withdrawal.findUnique({
    where: { id: withdrawalId },
  });

  if (!withdrawal) {
    throw new AppError(status.NOT_FOUND, "Withdrawal request not found");
  }

  if (withdrawal.status !== "PENDING") {
    throw new AppError(
      status.BAD_REQUEST,
      "Withdrawal request is already processed",
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const updatedWithdrawal = await tx.withdrawal.update({
      where: { id: withdrawalId },
      data: {
        status: withdrawalStatus as "APPROVED" | "REJECTED",
        transactionId: transactionId as string,
      },
    });

    // If rejected, refund the balance
    if (withdrawalStatus === "REJECTED") {
      await tx.tutorProfile.update({
        where: { id: withdrawal.tutorId },
        data: {
          withdrawableBalance: {
            increment: withdrawal.amount,
          },
        },
      });
    }

    return updatedWithdrawal;
  });

  return result;
};

export const WithdrawalService = {
  createWithdrawalRequest,
  getTutorWithdrawals,
  getAllWithdrawals,
  updateWithdrawalStatus,
};
