import RoomController from "../../controllers/hotel/roomAvailability.controller";
import applyPagination from "../../middlewares/applyPagination";
import asyncTryCatchFn from "../../utils/asyncTryCatchFn";
import express from "express";

const roomAvailabilityController = new RoomController();

const router = express.Router();

router.get(
    "/room-types",
    asyncTryCatchFn(roomAvailabilityController.getRoomTypeAvailability)
);

export default router;
