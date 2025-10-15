import { Request, Response } from "express";

import ActivityService from "../services/activity.service";
import { IPagination } from "../types/express";
import TaskService from "../services/task.service";
import normalizeToString from "../utils/sanatizeQueryParams";

const taskService = new TaskService();
const activityService = new ActivityService();

const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await taskService.create({
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            addedDate: req.body.addedDate,
            addedBy: req.verifiedUser,
            project: req.body.project,
            status: req.body.status,
            assignedBy: req.body.assignedBy,
            assignedTo: req.body.assignTo,
            taskLabel: req.body.taskLabel,
            taskUploads: req.body.taskUploads,
            featureId: req.body.featureId,
            sprint: req.body.sprint,
        });
        res.status(201).json({
            success: true,
            data: data,
            message: "Task created successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: error,
        });
    }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
    const { skip, take, keyword, isPaginationEnabled }: IPagination =
        req.pagination;

    const rawLabels = normalizeToString(req.query.labels);
    const sprintId = normalizeToString(req.query.sprintId);

    const rawProjectId = normalizeToString(req.query.projectId);
    const rawFeatureId = normalizeToString(req.query.featureId);

    const labelArray = rawLabels
        ? rawLabels.split(",").map((item) => Number(item))
        : undefined;

    const rawAssignedTo = normalizeToString(req.query.assignedTo);
    const assignedToArray = rawAssignedTo
        ? rawAssignedTo.split(",").map((item) => Number(item))
        : undefined;

    const rawPriority = normalizeToString(req.query.priority);
    const priorityArray = rawPriority ? rawPriority.split(",") : undefined;

    const result = await taskService.getAll({
        projectId: Number(rawProjectId),
        featureId: Number(rawFeatureId),
        skip,
        take,
        keyword,
        isPaginationEnabled,
        labels: labelArray,
        assignedTo: assignedToArray,
        priority: priorityArray,
        sprintId: Number(sprintId),
    });
    res.status(200).json({
        success: true,
        data: result,
        message: "Task fetched successfully",
    });
};

const getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const users = await taskService.getById(Number(id));
        res.status(200).json({
            success: true,
            data: users,
            message: "Task fetched successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const updateStatus = async (req: Request, res: Response): Promise<void> => {
    const { taskId } = req.params;

    const { taskStatus } = req.body;

    const status = parseInt(taskStatus);

    try {
        const response = await taskService.updateStatus(
            parseInt(taskId),
            status
        );
        res.status(200).json({
            success: true,
            data: response,
            message: "Task Updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error,
            success: false,
            data: null,
        });
    }
};

const update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const response = await taskService.update(Number(id), {
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            addedDate: req.body.addedDate,
            addedBy: req.body.addedBy,
            project: req.body.project,
            status: req.body.status,
            assignedBy: req.body.assignedBy,
            assignedTo: req.body.assignedTo,
            taskLabel: req.body.taskLabel,
            taskUploads: req.body.taskUploads,
            updatedTaskUploads: req.body.updatedTaskUploads,
            featureId: req.body.featureId,
            sprint: req.body.sprint,
        });
        res.status(200).json({
            success: true,
            data: response,
            message: "Task Updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error,
            success: false,
            data: null,
        });
    }
};

const getActivityByTaskId = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { taskId } = req.params;

    try {
        const response = await activityService.getActivityByTaskId({
            taskId: Number(taskId),
        });
        res.status(200).json({
            success: true,
            data: response,
            message: "Activity fetched successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error,
            success: false,
            data: null,
        });
    }
};

export default {
    create,
    getAll,
    getById,
    updateStatus,
    update,
    getActivityByTaskId,
};
