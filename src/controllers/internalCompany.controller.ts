import { Request, Response } from "express";

import InternalCompanyService from "../services/internalCompany.service";

const internalCompanyService = new InternalCompanyService();

const create = async (req: Request, res: Response) => {
    const data = req.body;
    const response = await internalCompanyService.create(data);

    res.status(201).json({
        success: true,
        data: response,
        message: "Internal company created successfully.",
    });
};

const getAll = async (req: Request, res: Response) => {
    const isActive = req.query.isActive;
    const { isPaginationEnabled, keyword, requestFromUrl, skip, take } =
        req.pagination;

    const companies = await internalCompanyService.getAll({
        isActive: isActive === "true" ? true : false,
        isPaginationEnabled,
        keyword,
        requestFromUrl,
        skip,
        take,
    });

    res.status(200).json({
        success: true,
        data: companies,
        message: "Internal companies fetched successfully.",
    });
};

const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await internalCompanyService.getById(Number(id));

    res.status(200).json({
        success: true,
        data: response,
        message: "Internal company fetched successfully.",
    });
};

const update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const payload = req.body;

    const updated = await internalCompanyService.update(id, payload);

    res.status(200).json({
        success: true,
        data: updated,
        message: "Internal company updated successfully.",
    });
};

const deactivate = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const isActive = req.body.isActive;

    const result = await internalCompanyService.deactivate(id, isActive);

    res.status(200).json({
        success: true,
        data: result,
        message: `Internal company ${
            isActive ? "activated" : "deactivated"
        } successfully.`,
    });
};

export default {
    create,
    getAll,
    getById,
    update,
    deactivate,
};
