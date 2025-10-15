import { Router as ExpressRouter } from "express";
import { PERMISSION_ENUM } from "../enums/Permission";
import applyPagination from "../middlewares/applyPagination";
import asyncTryCatchFn from "../utils/asyncTryCatchFn";
import authorizePermission from "../middlewares/authorization";
import customerController from "../controllers/customer.controller";
import verifyToken from "../middlewares/authentication";

const router = ExpressRouter();

// router.use(verifyToken);

router.get("", applyPagination, asyncTryCatchFn(customerController.getAll));

export default router;
