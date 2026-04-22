import { Router } from "express";

import { CategoryRouter } from "../modules/category/category.route";
import { TutorRouter } from "../modules/tutor/tutor.route";
import { BookingRouter } from "../modules/booking/booking.route";
import { ReviewRouter } from "../modules/review/review.route";
import { AdminRouter } from "../modules/admin/admin.route";
import { UserRouter } from "../modules/user/user.route";

const router = Router();

// router.use("/auth", AuthRoutes);
router.use("/categories", CategoryRouter);
router.use("/tutors", TutorRouter);
router.use("/bookings", BookingRouter);
router.use("/reviews", ReviewRouter);
router.use("/users", UserRouter);
router.use("/admins", AdminRouter);

export const IndexRoutes = router;
