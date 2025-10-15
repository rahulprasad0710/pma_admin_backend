import { Router as ExpressRouter } from "express";
import applyPagination from "../middlewares/applyPagination";
import asyncTryCatchFn from "../utils/asyncTryCatchFn";
import sprintController from "../controllers/sprint.controller";
import verifyToken from "../middlewares/authentication";

const router = ExpressRouter();

router.use(verifyToken);

router.post("", sprintController.create);
router.get("", applyPagination, sprintController.getAll);
router.put("/status/:id", sprintController.updateStatus);
router.get("/:id", sprintController.getById);

export default router;
