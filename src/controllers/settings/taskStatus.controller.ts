import { Request, Response } from "express";

import { IPagination } from "../../types/express";
import TaskStatusService from "../../services/settings/taskStatus.service";
import normalizeToString from "../../utils/sanatizeQueryParams";

const taskStatusService = new TaskStatusService();

const create = async (req: Request, res: Response): Promise<void> => {
    const data = await taskStatusService.create({
        name: req.body.name,
        colorCode: req.body.colorCode,
    });

    res.status(201).json({
        success: true,
        data,
        message: "Task status created successfully",
    });
};

const getAll = async (req: Request, res: Response): Promise<void> => {
    const { skip, take, keyword, isPaginationEnabled }: IPagination =
        req.pagination;

    const isActive = normalizeToString(req.query.isActive);

    const data = await taskStatusService.getAll({
        skip,
        take,
        keyword,
        isPaginationEnabled,
        isActive: isActive === "false" ? false : true,
    });

    res.status(200).json({
        success: true,
        data: data,
        message: "Task statuses fetched successfully",
    });
};

const getById = async (req: Request, res: Response): Promise<void> => {
    const data = await taskStatusService.getById(Number(req.params.id));

    res.status(200).json({
        success: true,
        data,
        message: "Task status fetched successfully",
    });
};

const update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, colorCode } = req.body;

    const result = await taskStatusService.update(Number(id), {
        name,
        colorCode,
    });

    res.status(200).json({
        success: true,
        data: result,
        message: `Task status updated successfully`,
    });
};

const updateStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { isActive } = req.body;

    const result = await taskStatusService.delete(Number(id), isActive);

    res.status(200).json({
        success: true,
        data: result,
        message: `Task status marked as ${isActive ? "active" : "inactive"}`,
    });
};

const getTaskStatusByProjectId = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { projectId } = req.params;
    const data = await taskStatusService.getTaskStatusByProjectId(
        Number(projectId)
    );

    res.status(200).json({
        success: true,
        data,
        message: "Task status fetched successfully",
    });
};

export default {
    create,
    getAll,
    getById,
    updateStatus,
    update,
    getTaskStatusByProjectId,
};
