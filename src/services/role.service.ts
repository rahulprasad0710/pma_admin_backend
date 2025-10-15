import AppError from "../utils/AppError";
import { ErrorType } from "../enums/Eums";
import { Permission } from "../db/entity/Permission";
import PermissionService from "./permission.service";
import { ROLE_TYPE } from "../enums/Permission";
import { Role } from "../db/entity/role";
import { User } from "../db/entity/User";
import createPagination from "../utils/createPagination";
import dataSource from "../db/data-source";

const permissionService = new PermissionService();
export interface IRole {
    name: string;
    isActive: boolean;
    permissions: number[];
    addedBy?: User;
    role_type: ROLE_TYPE.SUPER_ADMIN;
    description: string;
}

export class RoleService {
    private readonly roleRepository = dataSource.getRepository(Role);

    async create(role: IRole) {
        const rolePayload = new Role();
        rolePayload.name = role.name;
        rolePayload.isActive = role.isActive ?? true;
        rolePayload.role_type = role.role_type;
        rolePayload.description = role.description;

        const permissionsResponse = await permissionService.getAllPermissions(
            role.permissions
        );

        if (role.permissions) {
            rolePayload.permissions = permissionsResponse;
        }

        const response = await this.roleRepository.save(rolePayload);

        return response;
    }

    async getAll(isActive: boolean) {
        const result = await this.roleRepository.find({
            where: { isActive },
        });
        return {
            result,
            pagination: createPagination(0, 10, result.length, false),
        };
    }

    async getById(id: number) {
        if (!id || isNaN(id)) {
            throw new AppError(
                "Invalid role ID",
                400,
                ErrorType.BAD_REQUEST_ERROR
            );
        }
        const result = await this.roleRepository.findOne({
            where: { id },
            relations: ["permissions", "permissions.permissionGroup"],
        });

        if (!result) {
            throw new AppError(
                "Role not found",
                404,
                ErrorType.NOT_FOUND_ERROR
            );
        }

        return {
            ...result,
            permissions: result.permissions.map((permission) => ({
                id: permission.id,
                displayName: permission.displayName,
                isActive: permission.isActive,
                description: permission.description,
                enumName: permission.enumName,
                permissionGroupId: result.permissions[0].permissionGroup.id,
                permissionGroupName:
                    result.permissions[0].permissionGroup.displayName,
            })),
        };
    }

    async update(id: number, updateFields: IRole) {
        const role = await this.roleRepository.findOneBy({ id });
        if (!role) throw new Error("Role not found");

        const rolePayload = new Role();

        rolePayload.name = updateFields.name;
        rolePayload.isActive = updateFields.isActive ?? true;
        rolePayload.role_type = updateFields.role_type;
        rolePayload.description = updateFields.description;

        const permissionsResponse = await permissionService.getAllPermissions(
            updateFields.permissions
        );

        if (role.permissions) {
            rolePayload.permissions = permissionsResponse;
        }

        return await this.roleRepository.update(id, rolePayload);
    }

    async deactivate(id: number, isActive: boolean) {
        const role = await this.roleRepository.findOneBy({ id });
        if (!role) throw new Error("Role not found");

        role.isActive = isActive;
        return await this.roleRepository.save(role);
    }
}

export default RoleService;
