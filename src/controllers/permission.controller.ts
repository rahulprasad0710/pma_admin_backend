import {
    HOTEL_COMPANY_PERMISSION_GROUPS,
    NORMAL_PERMISSION_GROUPS,
    NORMAL_SETTINGS_PERMISSION_GROUPS,
    SUPER_ADMIN_PERMISSION_GROUPS,
} from "../seeders/Permissions";
import { Request, Response } from "express";

import PermissionService from "../services/permission.service";

const permissionService = new PermissionService();

const getAllPermissionGroups = async (req: Request, res: Response) => {
    const { permissionTypes, isActive } = req.query;
    const groups = await permissionService.getAllPermissionGroups({
        permissionTypes: permissionTypes as string,
        isActive: isActive === "true",
    });
    res.status(200).json({
        success: true,
        data: groups,
        message: "Permission groups fetched successfully",
    });
};

const getPermissionGroupById = async (req: Request, res: Response) => {
    const groupId = Number(req.params.id);

    const group = await permissionService.getPermissionByPermissionGroupId(
        groupId
    );

    res.status(200).json({
        success: true,
        data: group,
        message: "Permission group fetched successfully",
    });
};

const getPermissionById = async (req: Request, res: Response) => {
    const permissionId = Number(req.params.id);

    if (isNaN(permissionId)) {
        res.status(400).json({
            success: false,
            message: "Invalid permission ID",
            data: null,
        });
        return;
    }

    const permission = await permissionService.getPermissionById(permissionId);

    if (!permission) {
        res.status(404).json({
            success: false,
            message: "Permission not found",
            data: null,
        });
        return;
    }

    res.status(200).json({
        success: true,
        data: permission,
        message: "Permission fetched successfully",
    });
};

const addPermissionGroupByStaticId = async (req: Request, res: Response) => {
    const data = [
        ...SUPER_ADMIN_PERMISSION_GROUPS,
        ...NORMAL_PERMISSION_GROUPS,
        ...HOTEL_COMPANY_PERMISSION_GROUPS,
        ...NORMAL_SETTINGS_PERMISSION_GROUPS,
    ];

    const response = await Promise.all(
        data.map(async (permissionGroup) => {
            await permissionService.insertPermissionsWithGroupStaticData(
                permissionGroup
            );
        })
    );

    res.status(200).json({
        success: true,
        data: response,
        message: "Permission group added successfully",
    });
};
export default {
    getAllPermissionGroups,
    getPermissionGroupById,
    getPermissionById,
    addPermissionGroupByStaticId,
};
