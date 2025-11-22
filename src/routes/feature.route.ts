import { Router as ExpressRouter } from "express";
import { PERMISSION_ENUM } from "../enums/Permission";
import applyPagination from "../middlewares/applyPagination";
import asyncTryCatchFn from "../utils/asyncTryCatchFn";
import authorizePermission from "../middlewares/authorization";
import featureController from "../controllers/feature.controller";

//  authorizePermission(PERMISSION_ENUM.READ_LABEL),
const router = ExpressRouter();

router.get("", applyPagination, asyncTryCatchFn(featureController.getAll));
router.get(
    "/:id/task-status",
    asyncTryCatchFn(featureController.getTaskStatusByFeatureId)
);
router.put("/:id", asyncTryCatchFn(featureController.update));
router.get("/:id", asyncTryCatchFn(featureController.getById));

export default router;
