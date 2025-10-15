import { Router as ExpressRouter } from "express";
import { PERMISSION_ENUM } from "../enums/Permission";
import applyPagination from "../middlewares/applyPagination";
import asyncTryCatchFn from "../utils/asyncTryCatchFn";
import authorizePermission from "../middlewares/authorization";
import internalCompanyController from "../controllers/internalCompany.controller";

const router = ExpressRouter();

router.post(
    "",
    // authorizePermission(PERMISSION_ENUM.CREATE_INTERNAL_COMPANY),
    asyncTryCatchFn(internalCompanyController.create)
);

router.get(
    "",
    applyPagination,
    // authorizePermission(PERMISSION_ENUM.READ_INTERNAL_COMPANY),
    internalCompanyController.getAll
);

router.get(
    "/:id",
    // authorizePermission(PERMISSION_ENUM.READ_INTERNAL_COMPANY),
    internalCompanyController.getById
);

router.put(
    "/:id",
    // authorizePermission(PERMISSION_ENUM.UPDATE_INTERNAL_COMPANY),
    internalCompanyController.update
);

router.put(
    "/status/:id",
    // authorizePermission(PERMISSION_ENUM.UPDATE_INTERNAL_COMPANY),
    internalCompanyController.deactivate
);

export default router;
