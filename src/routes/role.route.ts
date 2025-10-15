import { Router as ExpressRouter } from "express";
import { SUPER_ADMIN_PERMISSION_ENUM } from "../enums/Permission";
import applyPagination from "../middlewares/applyPagination";
import asyncTryCatchFn from "../utils/asyncTryCatchFn";
import authorizePermission from "../middlewares/authorization";
import roleController from "../controllers/role.controller";
import verifyToken from "../middlewares/authentication";

const router = ExpressRouter();

router.use(verifyToken);

router.post(
    "",
    authorizePermission({
        permissionName: SUPER_ADMIN_PERMISSION_ENUM.CREATE_ROLE,
    }),
    asyncTryCatchFn(roleController.create)
);
router.get("", applyPagination, roleController.getAll);
router.put("/status/:id", roleController.deactivate);
router.put("/:id", roleController.update);
router.get("/:id", roleController.getById);

export default router;
