import { COMPANY_INFORMATION_SEEDER, COMPANY_MAIN_ADMIN } from "./information";

import { IRole } from "../services/role.service";
import PermissionService from "../services/permission.service";
import { ROLE_TYPE } from "../enums/Permission";
import RoleService from "../services/role.service";
import UserService from "../services/users.service";
import dataSource from "../db/data-source";
import { seedPermissionFn } from "./permission.seed";

const permissionService = new PermissionService();
const roleService = new RoleService();
const userService = new UserService();

async function startApp() {
    try {
        await dataSource.initialize();

        const _insertedPermission = await seedPermissionFn();

        const permissionsResponse = await permissionService.getAllPermissions();

        const rolePayload: IRole = {
            name: "Super Admin",
            isActive: true,
            role_type: ROLE_TYPE.SUPER_ADMIN,
            description: "Super Admin added by seed.",
            permissions: permissionsResponse?.map((p) => p.id),
        };

        // INSERT ADMIN ROLE
        const insertedRole = await roleService.create(rolePayload);
        console.log("LOG: ~ startApp ~ insertedRole:", insertedRole);

        const roleResponse = await userService.getRoleById(insertedRole.id);

        if (!roleResponse) {
            throw new Error(
                "Role not found after insertion, something went wrong."
            );
        }

        // INSERT INTERNAL COMPANY

        const insertedInternalCompany = await dataSource.query(
            `INSERT INTO internal_company (
                name,
                slug,
                "logoUrl",
                address,
                "contactEmail",
                "contactPhone",
                "isActive",
                "createdAt",
                "updatedAt"
            ) VALUES (
                $1,
                $2,
                $3,
                $4,
                $5, 
                $6,
                $7,
                $8,
                $9
                ) RETURNING id `,
            COMPANY_INFORMATION_SEEDER
        );

        const userPayload = {
            email: COMPANY_MAIN_ADMIN.email,
            mobileNumber: COMPANY_MAIN_ADMIN.mobileNumber,
            firstName: COMPANY_MAIN_ADMIN.firstName,
            lastName: COMPANY_MAIN_ADMIN.lastName,
            role: insertedRole.id as number,
            roleResponse,
            internalCompany: [insertedInternalCompany[0].id as number],
            password: "Rahul@1234",
        };

        const addEmployeeResponse = await userService.addUser(
            userPayload,
            "PMA-0001",
            "VERIFIED_BY_SEEDER",
            true
        );

        const addAdminToInternalCompany = await await dataSource.query(
            `  INSERT INTO internal_company_member (
                internal_company_id,
                user_id
                ) VALUES ( $1, $2) `,
            [insertedInternalCompany[0].id, addEmployeeResponse.id]
        );

        const insertFeature = await await dataSource.query(
            `INSERT INTO "feature" (
                name,
                description,
                slug,
                "active",
                "profilePicture",
                "internalCompanyId",
                "adminId",
                "activeSprintId"
            ) VALUES  (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7,
                $8
                ) RETURNING id `,
            [
                "Booking",
                "Handles hotel room booking process",
                "booking",
                true,
                null,
                insertedInternalCompany[0].id,
                addEmployeeResponse.id,
                null,
            ]
        );

        const addUserToFeature = await await dataSource.query(
            `  INSERT INTO feature_team_member (
                feature_id,
                user_id
                ) VALUES ( $1, $2) `,
            [insertFeature[0].id, addEmployeeResponse.id]
        );
    } catch (error) {
        console.log("Seeder Error", error);
    }
}

startApp();
