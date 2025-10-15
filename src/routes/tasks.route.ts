import { Router as ExpressRouter } from "express";
import applyPagination from "../middlewares/applyPagination";
import asyncTryCatchFn from "../utils/asyncTryCatchFn";
import commentController from "../controllers/comments.controller";
import taskController from "../controllers/task.controller";

const router = ExpressRouter();

router.post("", taskController.create);
router.get("", applyPagination, taskController.getAll);
router.get("/:taskId/activities", taskController.getActivityByTaskId);

router.put("/status/:taskId", asyncTryCatchFn(taskController.updateStatus));
router.get("/:id", taskController.getById);
// COMMENTS
router.post("/:taskId/comments", commentController.addComment);
router.get(
    "/:taskId/comments",
    applyPagination,
    commentController.getCommentsByTaskId
);
router.put("/:taskId/comments/:id", commentController.updateComment);
router.delete("/:taskId/comments/:id", commentController.deleteComment);

export default router;
