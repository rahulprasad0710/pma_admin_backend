import { Request, Response } from "express";

import AppError from "../utils/AppError";
import { ErrorType } from "../enums/Eums";
import { IPagination } from "../types/express";
import LabelService from "../services/label.service";

const labelService = new LabelService();

const create = async (req: Request, res: Response): Promise<void> => {
    const { verifiedUser } = req;
    const data = await labelService.create({
        name: req.body.name,
        description: req.body.description,
        addedBy: verifiedUser,
        colorCode: req.body.colorCode,
        isActive: req.body.isActive,
    });

    res.status(201).json({
        success: true,
        data,
        message: "Label created successfully",
    });
};

const getAll = async (req: Request, res: Response): Promise<void> => {
    const { isActive } = req.query;
    const { skip, take, keyword, isPaginationEnabled }: IPagination =
        req.pagination;

    const data = await labelService.getAll({
        isActive: isActive === "true",
        isPaginationEnabled,
        keyword,
        skip,
        take,
    });

    res.status(200).json({
        success: true,
        data: data,
        message: "Labels fetched successfully",
    });
};

const getById = async (req: Request, res: Response): Promise<void> => {
    const data = await labelService.getById(Number(req.params.id));

    res.status(200).json({
        success: true,
        data,
        message: "Label fetched successfully",
    });
};

const updateStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { isActive } = req.body;

    const result = await labelService.deactivate(Number(id), isActive);

    res.status(200).json({
        success: true,
        data: result,
        message: `Label marked as ${isActive ? "active" : "inactive"}`,
    });
};
const update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const payload = req.body;

    const result = await labelService.update(Number(id), payload);

    res.status(200).json({
        success: true,
        data: result,
        message: `Label updated successfully`,
    });
};

export default {
    create,
    getAll,
    getById,
    updateStatus,
    update,
};
