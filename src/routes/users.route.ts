import { Router as ExpressRouter } from "express";
import applyPagination from "../middlewares/applyPagination";
import asyncTryCatchFn from "../utils/asyncTryCatchFn";
import usersController from "../controllers/users.controller";

const router = ExpressRouter();

router.post("", asyncTryCatchFn(usersController.create));

router.get(
    "",
    applyPagination,
    asyncTryCatchFn(usersController.getAllEmployeeDetails)
);

router.get(
    "/feature/:featureId",
    applyPagination,
    asyncTryCatchFn(usersController.getEmployeeViewByFeatureId)
);

export default router;
