import { Router as ExpressRouter } from "express";
import { PERMISSION_ENUM } from "../enums/Permission";
import applyPagination from "../middlewares/applyPagination";
import authorizePermission from "../middlewares/authorization";
import featureController from "../controllers/feature.controller";

//  authorizePermission(PERMISSION_ENUM.READ_LABEL),
const router = ExpressRouter();

router.get("", applyPagination, featureController.getAll);
router.get("/:id/task-status", featureController.getTaskStatusByFeatureId);
router.put("/:id", featureController.update);
router.get("/:id", featureController.getById);

export default router;
