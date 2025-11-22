import { Router as ExpressRouter } from "express";
import { SUPER_ADMIN_PERMISSION_ENUM } from "../enums/Permission";
import applyPagination from "../middlewares/applyPagination";
import asyncTryCatchFn from "../utils/asyncTryCatchFn";
import authorizePermission from "../middlewares/authorization";
import { registerUserSchema } from "../validator/superAdmin";
import requestValidator from "../middlewares/requestValidator";
import usersController from "../controllers/users.controller";
import verifyToken from "../middlewares/authentication";

const router = ExpressRouter();

router.use(verifyToken);

router.post(
    "",
    requestValidator(registerUserSchema),
    authorizePermission({
        permissionName: SUPER_ADMIN_PERMISSION_ENUM.CREATE_EMPLOYEE,
    }),
    asyncTryCatchFn(usersController.create)
);

router.get(
    "",
    authorizePermission({
        permissionName: SUPER_ADMIN_PERMISSION_ENUM.READ_EMPLOYEE,
    }),
    applyPagination,
    asyncTryCatchFn(usersController.getAllEmployeeDetails)
);

router.get(
    "/feature/:featureId",
    authorizePermission({
        permissionName: SUPER_ADMIN_PERMISSION_ENUM.READ_EMPLOYEE,
    }),
    applyPagination,
    asyncTryCatchFn(usersController.getEmployeeViewByFeatureId)
);

export default router;
