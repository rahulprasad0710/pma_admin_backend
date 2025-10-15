import applyPagination from "../../middlewares/applyPagination";
import asyncTryCatchFn from "../../utils/asyncTryCatchFn";
import express from "express";
import roomTypeController from "../../controllers/hotel/roomType.controller";
import verifyToken from "../../middlewares/authentication";

const router = express.Router();

router.use(verifyToken);

// RoomType routes
router.post("", asyncTryCatchFn(roomTypeController.create));
router.get("", applyPagination, asyncTryCatchFn(roomTypeController.getAll));
router.get("/:id", asyncTryCatchFn(roomTypeController.getById));
router.put("/:id", asyncTryCatchFn(roomTypeController.update));
router.delete("/:id", asyncTryCatchFn(roomTypeController.delete));

export default router;
