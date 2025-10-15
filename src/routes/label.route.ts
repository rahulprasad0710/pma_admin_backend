import { Router as ExpressRouter } from "express";
import { PERMISSION_ENUM } from "../enums/Permission";
import applyPagination from "../middlewares/applyPagination";
import asyncTryCatchFn from "../utils/asyncTryCatchFn";
import authorizePermission from "../middlewares/authorization";
import labelController from "../controllers/label.controller";
import verifyToken from "../middlewares/authentication";

const router = ExpressRouter();

router.use(verifyToken);

router.post("", asyncTryCatchFn(labelController.create));
router.get("", applyPagination, asyncTryCatchFn(labelController.getAll));
router.put("/status/:id", asyncTryCatchFn(labelController.updateStatus));
router.get("/:id", asyncTryCatchFn(labelController.getById));
router.put("/:id", asyncTryCatchFn(labelController.update));

export default router;
