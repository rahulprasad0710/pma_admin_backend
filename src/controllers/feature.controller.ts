import { Request, Response } from "express";

import FeatureService from "../services/feature.service";
import { IFeaturePayload } from "../types/payload";
import { IPagination } from "../types/express";
import normalizeToString from "../utils/sanatizeQueryParams";

const featureService = new FeatureService();

const getById = async (req: Request, res: Response) => {
    const featureId = Number(req.params.id);

    const response = await featureService.getById(featureId);

    res.status(200).json({
        success: true,
        data: response,
        message: "Feature fetched successfully",
    });
};

const getAll = async (req: Request, res: Response) => {
    const { skip, take, keyword, isPaginationEnabled }: IPagination =
        req.pagination;
    const isActive = normalizeToString(req.query.isActive);

    const taskStatus = await featureService.getAll({
        skip,
        take,
        keyword,
        isPaginationEnabled,
        isActive: isActive === "true",
    });

    res.status(200).json({
        success: true,
        data: taskStatus,
        message: "Task status fetched successfully",
    });
};

const update = async (req: Request, res: Response) => {
    const featureId = Number(req.params.id);
    const payload: IFeaturePayload = {
        name: req.body.name,
        description: req.body.description,
        active: req.body.active,
        profilePicture: req.body.profilePicture,
        featureTeamMember: req.body.featureTeamMember,
        featureTaskStatus: req.body.featureTaskStatus,

        admin: req.body.admin,
    };

    const response = await featureService.update(featureId, payload);

    res.status(200).json({
        success: true,
        data: response,
        message: "Feature updated successfully",
    });
};

const getTaskStatusByFeatureId = async (req: Request, res: Response) => {
    const featureId = Number(req.params.id);

    const response = await featureService.getFeatureTaskStatus(featureId);

    res.status(200).json({
        success: true,
        data: response,
        message: "Feature task status fetched successfully",
    });
};

export default {
    getById,
    getAll,
    update,
    getTaskStatusByFeatureId,
};
