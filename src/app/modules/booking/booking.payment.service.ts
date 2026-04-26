import { stripe } from "../../config/stripe.config";
import { env } from "../../config/env";
import { prisma } from "../../lib/prisma";
import AppError from "../../errorHelpers/AppError";
import status from "http-status";

const createCheckoutSession = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tutor: {
        include: {
          user: true,
        },
      },
      student: true,
    },
  });

  if (!booking) {
    throw new AppError(status.NOT_FOUND, "Booking not found");
  }

  if (!booking.student?.email) {
    throw new AppError(
      status.BAD_REQUEST,
      "Student email is required for payment",
    );
  }
  if (booking.totalPrice < 50) {
    throw new AppError(
      status.BAD_REQUEST,
      "Total price must be at least 50 BDT for Stripe payments",
    );
  }

  if (!booking.tutor?.user?.name) {
    throw new AppError(status.BAD_REQUEST, "Tutor information is missing");
  }

  const frontendUrl = env.FRONTEND_URL.endsWith("/")
    ? env.FRONTEND_URL.slice(0, -1)
    : env.FRONTEND_URL;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: booking.student.email,
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: `Tutoring: ${booking.subject}`,
              description: `Session with ${booking.tutor.user.name} on ${new Date(booking.sessionDate).toDateString()}`,
            },
            unit_amount: Math.round(booking.totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      cancel_url: `${frontendUrl}/payment-cancel?booking_id=${booking.id}`,
      metadata: {
        bookingId: booking.id,
      },
    });

    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        transactionId: session.id,
      },
    });

    return session.url;
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      error.message || "Failed to create Stripe checkout session",
    );
  }
};

const verifyPayment = async (sessionId: string) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      // 1. Get booking and platform fee
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { tutor: true },
      });

      if (!booking || booking.paymentStatus === "PAID") {
        return true; // Already processed
      }

      const feeSetting = await prisma.platformSetting.findUnique({
        where: { key: "PLATFORM_FEE_PERCENT" },
      });

      const feePercent = feeSetting ? parseFloat(feeSetting.value) : 10;
      const feeAmount = (booking.totalPrice * feePercent) / 100;
      const tutorEarnings = booking.totalPrice - feeAmount;

      // 2. Update booking and tutor balance in transaction
      await prisma.$transaction([
        prisma.booking.update({
          where: { id: bookingId },
          data: {
            paymentStatus: "PAID",
            status: "CONFIRMED",
          },
        }),
        prisma.tutorProfile.update({
          where: { id: booking.tutorId },
          data: {
            totalEarnings: { increment: tutorEarnings },
            withdrawableBalance: { increment: tutorEarnings },
          },
        }),
      ]);
    }
    return true;
  }

  return false;
};

export const BookingPaymentService = {
  createCheckoutSession,
  verifyPayment,
};
