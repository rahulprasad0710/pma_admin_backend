import { Request, Response } from "express";

import { IPagination } from "../types/express";
import UserService from "../services/users.service";
import normalizeToString from "../utils/sanatizeQueryParams";

const userService = new UserService();

const create = async (req: Request, res: Response) => {
    const data = req.body;
    const response = await userService.create(data);
    res.status(201).json({
        success: true,
        data: response.id,
        message: `User created with Id : ${response.employeeId}. A verification has been sent to ${response.email}.`,
    });
};

const getEmployeeViewByFeatureId = async (req: Request, res: Response) => {
    const { featureId } = req.params;
    const users = await userService.getEmployeeViewByFeatureId({
        featureId: Number(featureId),
    });
    res.status(200).json({
        success: true,
        data: users,
        message: "User fetched successfully",
    });
};

const getAllEmployeeDetails = async (req: Request, res: Response) => {
    const { skip, take, keyword, isPaginationEnabled }: IPagination =
        req.pagination;

    const isActive = normalizeToString(req.query.isActive);

    const users = await userService.getAllEmployee({
        skip,
        take,
        keyword,
        isPaginationEnabled,
        isActive: isActive === "true" ? true : false,
    });
    res.status(200).json({
        success: true,
        data: users,
        message: "User fetched successfully",
    });
};

export default {
    create,
    getAllEmployeeDetails,
    getEmployeeViewByFeatureId,
};
