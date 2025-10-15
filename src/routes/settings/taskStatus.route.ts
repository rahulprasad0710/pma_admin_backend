import { Router as ExpressRouter } from "express";
import applyPagination from "../../middlewares/applyPagination";
import authorizePermission from "../../middlewares/authorization";
import taskStatusController from "../../controllers/settings/taskStatus.controller";

//  authorizePermission(PERMISSION_ENUM.READ_LABEL),
const router = ExpressRouter();

router.post("", taskStatusController.create);
router.get("", applyPagination, taskStatusController.getAll);
router.put("/status/:id", taskStatusController.updateStatus);
router.get("/:id", taskStatusController.getById);

export default router;
