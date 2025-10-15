import { Request, Response } from "express";

import { IPagination } from "../types/express";
import SprintService from "../services/sprint.service";

const sprintService = new SprintService();

const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await sprintService.create({
            name: req.body.name,
            goal: req.body.goal,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        });

        res.status(201).json({
            success: true,
            data,
            message: "Sprint created successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: error instanceof Error ? error.message : String(error),
        });
    }
};

const getAll = async (req: Request, res: Response): Promise<void> => {
    const { skip, take, keyword, isPaginationEnabled }: IPagination =
        req.pagination;
    const { isActive } = req.query;

    try {
        const response = await sprintService.getAll({
            isActive: isActive === "true",
            isPaginationEnabled,
            keyword,
            skip,
            take,
        });

        res.status(200).json({
            success: true,
            data: response,
            message: "Sprints fetched successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: error instanceof Error ? error.message : String(error),
        });
    }
};

const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await sprintService.getById(Number(req.params.id));

        res.status(200).json({
            success: true,
            data,
            message: "Sprint fetched successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: error instanceof Error ? error.message : String(error),
        });
    }
};

const updateStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { isActive } = req.body;

    try {
        const result = await sprintService.deactivate(Number(id), isActive);

        res.status(200).json({
            success: true,
            data: result,
            message: `Sprint marked as ${isActive ? "active" : "inactive"}`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: error instanceof Error ? error.message : String(error),
        });
    }
};

export default {
    create,
    getAll,
    getById,
    updateStatus,
};
