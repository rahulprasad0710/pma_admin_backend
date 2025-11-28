import BookingController from "../../controllers/hotel/booking.controller";
import applyPagination from "../../middlewares/applyPagination";
import asyncTryCatchFn from "../../utils/asyncTryCatchFn";
import express from "express";
import verifyToken from "../../middlewares/authentication";

const bookingController = new BookingController();

const router = express.Router();

router.use(verifyToken);

// RoomType routes
router.post("", asyncTryCatchFn(bookingController.create));
router.get("", applyPagination, asyncTryCatchFn(bookingController.getAll));
router.get("/:id", asyncTryCatchFn(bookingController.getById));
// router.put("/:id", asyncTryCatchFn(roomController.update));
// router.delete("/:id", asyncTryCatchFn(roomController.delete));

export default router;
