import { Request, Response } from "express";
import { stripe } from "../../config/stripe.config";
import { env } from "../../config/env";
import { prisma } from "../../lib/prisma";

export const handleStripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      env.STRIPE.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            paymentStatus: "PAID",
            status: "CONFIRMED",
          },
        });
        console.log(`Payment successful for booking: ${bookingId}`);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
};
