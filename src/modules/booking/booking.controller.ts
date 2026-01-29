import { NextFunction, Request, Response } from "express";

const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // const user = req.user;
    console.log(req.body);
  } catch (err) {
    next(err);
  }
};

export const BookingController = {
  createBooking,
};
