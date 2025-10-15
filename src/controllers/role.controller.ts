import { Request, Response } from "express";

import RoleService from "../services/role.service";

const roleService = new RoleService();

const create = async (req: Request, res: Response) => {
    const roleData = req.body;

    const { verifiedUserId } = req;

    const newRole = await roleService.create({
        ...roleData,
        addedBy: verifiedUserId,
    });

    res.status(201).json({
        success: true,
        data: newRole,
        message: "Role created successfully",
    });
};

const getAll = async (req: Request, res: Response) => {
    const isActiveParam = req.query.isActive === "false" ? false : true;
    const roles = await roleService.getAll(isActiveParam);
    res.status(200).json({
        success: true,
        data: roles,
        message: "Roles fetched successfully",
    });
};

const getById = async (req: Request, res: Response) => {
    const roleId = Number(req.params.id);

    const role = await roleService.getById(roleId);

    res.status(200).json({
        success: true,
        data: role,
        message: "Role fetched successfully",
    });
};

const update = async (req: Request, res: Response) => {
    const roleId = Number(req.params.id);
    const updateData = req.body;

    const updatedRole = await roleService.update(roleId, updateData);

    res.status(200).json({
        success: true,
        data: updatedRole,
        message: "Role updated successfully",
    });
};

const deactivate = async (req: Request, res: Response) => {
    const roleId = Number(req.params.id);
    const { isActive } = req.body;

    const updatedRole = await roleService.deactivate(roleId, isActive);

    res.status(200).json({
        success: true,
        data: updatedRole,
        message: `Role ${isActive ? "activated" : "deactivated"} successfully`,
    });
};

export default {
    create,
    getAll,
    getById,
    update,
    deactivate,
};
