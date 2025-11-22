import {
    COMPANY_PERMISSION_ENUM,
    PERMISSION_ENUM,
    PERMISSION_GROUP,
    PERMISSION_TYPE,
    SUPER_ADMIN_PERMISSION_ENUM,
} from "../enums/Permission";

import { In } from "typeorm";
import { Permission } from "../db/entity/Permission";
import { PermissionGroup } from "../db/entity/PermissionGroup";
import createPagination from "../utils/createPagination";
import dataSource from "../db/data-source";
import { makeDisplayName } from "../utils/generateUniqueId";

interface IPermissionWithGroup {
    displayName: PERMISSION_GROUP;
    description: string;
    permission_type: PERMISSION_TYPE;
    permissions:
        | SUPER_ADMIN_PERMISSION_ENUM[]
        | COMPANY_PERMISSION_ENUM[]
        | PERMISSION_ENUM[];
}

export class PermissionService {
    private permissionRepository = dataSource.getRepository(Permission);

    private permissionGroupRepository =
        dataSource.getRepository(PermissionGroup);

    async getPermissionByPermissionGroupId(groupId: number) {
        const result = await this.permissionGroupRepository.findOne({
            where: { id: groupId },
            relations: ["permissions"],
        });
        return result;
    }

    async getAllPermissionGroups({
        permissionTypes,
        isActive,
    }: {
        permissionTypes?: string;
        isActive?: boolean;
    }) {
        let result = null;

        if (permissionTypes === "ALL") {
            result = await this.permissionGroupRepository.find({
                where: {
                    isActive: isActive,
                },
            });
        } else {
            result = await this.permissionGroupRepository.find({
                where: {
                    isActive: isActive,
                    permission_type: permissionTypes,
                },
            });
        }

        return {
            result,
            pagination: createPagination(0, 10, result.length, false),
        };
    }

    async getAllPermissions(permissionsIds?: number[]) {
        let result = null;

        if (permissionsIds) {
            result = await this.permissionRepository.find({
                where: {
                    id: In(permissionsIds),
                },
            });
        } else {
            result = await this.permissionRepository.find();
        }
        return result;
    }

    async getPermissionById(id: number) {
        const response = await this.permissionRepository.findOneBy({
            id,
        });
        return response;
    }

    async insertPermissionsWithGroupStaticData(
        permissionsWithGroup: IPermissionWithGroup
    ) {
        try {
            console.log({
                permissionsWithGroup,
            });

            if (permissionsWithGroup.permissions.length === 0) {
                throw new Error("No permissions Group provided");
            }
            const permissionGroup = this.permissionGroupRepository.create({
                displayName: makeDisplayName(permissionsWithGroup.displayName),
                description: permissionsWithGroup.description,
                permission_type: permissionsWithGroup.permission_type,
                isActive: true,
            });

            const savedPermissionGroup =
                await this.permissionGroupRepository.save(permissionGroup);

            const permissionEntities = permissionsWithGroup.permissions.map(
                (permission) => {
                    const permissionEntity = new Permission();
                    permissionEntity.displayName = makeDisplayName(permission);
                    permissionEntity.description = `Allows users to ${makeDisplayName(
                        permission
                    ).toLowerCase()}`;
                    permissionEntity.enumName = permission;
                    permissionEntity.permissionGroup = savedPermissionGroup;
                    return permissionEntity;
                }
            );

            const response = await this.permissionRepository.save(
                permissionEntities
            );
            return response;
        } catch (error) {
            console.error(
                "Error inserting permissions with group static data",
                error
            );
            throw error;
        }
    }
}

export default PermissionService;
