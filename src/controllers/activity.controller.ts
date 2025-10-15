import { Request, Response } from "express";

import ActivityService from "../services/activity.service";
import { IPagination } from "../types/express";

const activityService = new ActivityService();

const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const { skip, take, keyword, isPaginationEnabled }: IPagination =
            req.pagination;
        // const users = await activityService.getAll({
        //     skip,
        //     take,
        //     keyword,
        //     isPaginationEnabled,
        // });

        const users = await activityService.getAll();
        res.status(200).json({
            success: true,
            data: users,
            message: "Activity fetched successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const getActivityByUserId = async (
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
