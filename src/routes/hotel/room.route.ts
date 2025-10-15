import applyPagination from "../../middlewares/applyPagination";
import asyncTryCatchFn from "../../utils/asyncTryCatchFn";
import express from "express";
import roomController from "../../controllers/hotel/room.controller";

const router = express.Router();

// RoomType routes
router.post("", roomController.create);
router.get("", applyPagination, asyncTryCatchFn(roomController.getAll));
router.get("/:id", asyncTryCatchFn(roomController.getById));
router.put("/:id", asyncTryCatchFn(roomController.update));
router.delete("/:id", asyncTryCatchFn(roomController.delete));

export default router;
