import {
    HOTEL_COMPANY_PERMISSION_GROUPS,
    NORMAL_PERMISSION_GROUPS,
    NORMAL_SETTINGS_PERMISSION_GROUPS,
    SUPER_ADMIN_PERMISSION_GROUPS,
} from "./Permissions";

import PermissionService from "../services/permission.service";

const permissionService = new PermissionService();

const data = [
    ...SUPER_ADMIN_PERMISSION_GROUPS,
    ...NORMAL_PERMISSION_GROUPS,
    ...HOTEL_COMPANY_PERMISSION_GROUPS,
    ...NORMAL_SETTINGS_PERMISSION_GROUPS,
];

export const seedPermissionFn = async () => {
    try {
        const response = await Promise.all(
            data.map(async (permissionGroup) => {
                const response =
                    await permissionService.insertPermissionsWithGroupStaticData(
                        permissionGroup
                    );
                return response;
            })
        );

        console.log("Permission Seeded", response);
        return response;
    } catch (error) {
        console.error("Error seeding permissions", error);
        throw error;
    }
};
