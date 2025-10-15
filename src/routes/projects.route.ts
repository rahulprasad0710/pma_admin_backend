import { Router as ExpressRouter } from "express";
import applyPagination from "../middlewares/applyPagination";
import projectController from "../controllers/project.controller";
import taskController from "../controllers/task.controller";
import verifyToken from "../middlewares/authentication";

const router = ExpressRouter();

router.post("", projectController.create);
router.get("", applyPagination, projectController.getAll);
router.get("/tasks/:projectId", applyPagination, taskController.getAll);

router.post("/team-members", projectController.addTeamMember);
router.get("/:id", projectController.getById);
router.put("/:id", projectController.update);

export default router;
