import {
    COMPANY_PERMISSION_ENUM,
    PERMISSION_ENUM,
    PERMISSION_GROUP,
    PERMISSION_TYPE,
    SUPER_ADMIN_PERMISSION_ENUM,
} from "./../enums/Permission";

// !! PERMISSION_GROUP NAME SHOULD BE UNIQUE //

// ! DEFAULT PERMISSIONS STARTS HERE

const SUPER_ADMIN_PERMISSION_GROUPS = [
    // SUPER_ADMIN STARTS
    {
        displayName: PERMISSION_GROUP.PERMISSIONS,
        description: "Access to permissions resources",
        permission_type: PERMISSION_TYPE.SUPER_ADMIN_SETTINGS,
        permissions: [
            SUPER_ADMIN_PERMISSION_ENUM.READ_PERMISSION,
            SUPER_ADMIN_PERMISSION_ENUM.UPDATE_PERMISSION,
            SUPER_ADMIN_PERMISSION_ENUM.ASSIGN_PERMISSION,
        ],
    },
    {
        displayName: PERMISSION_GROUP.EMPLOYEES,
        description: "Access to employee resources",
        permission_type: PERMISSION_TYPE.SUPER_ADMIN_SETTINGS,
        permissions: [
            SUPER_ADMIN_PERMISSION_ENUM.READ_EMPLOYEE,
            SUPER_ADMIN_PERMISSION_ENUM.UPDATE_EMPLOYEE,
            SUPER_ADMIN_PERMISSION_ENUM.DELETE_EMPLOYEE,
            SUPER_ADMIN_PERMISSION_ENUM.CREATE_EMPLOYEE,
            SUPER_ADMIN_PERMISSION_ENUM.READ_EMPLOYEE_DETAILS,
        ],
    },

    {
        displayName: PERMISSION_GROUP.ROLES,
        description: "Access to role resources",
        permission_type: PERMISSION_TYPE.SUPER_ADMIN_SETTINGS,
        permissions: [
            SUPER_ADMIN_PERMISSION_ENUM.READ_ROLE,
            SUPER_ADMIN_PERMISSION_ENUM.UPDATE_ROLE,
            SUPER_ADMIN_PERMISSION_ENUM.DELETE_ROLE,
            SUPER_ADMIN_PERMISSION_ENUM.CREATE_ROLE,
        ],
    },

    {
        displayName: PERMISSION_GROUP.FEATURES_AND_TEAMS,
        description: "Access to features and teams resources",
        permission_type: PERMISSION_TYPE.SUPER_ADMIN_SETTINGS,
        permissions: [
            SUPER_ADMIN_PERMISSION_ENUM.READ_FEATURES_AND_TEAMS,
            SUPER_ADMIN_PERMISSION_ENUM.UPDATE_FEATURES_AND_TEAMS,
            SUPER_ADMIN_PERMISSION_ENUM.DELETE_FEATURES_AND_TEAMS,
            SUPER_ADMIN_PERMISSION_ENUM.ADD_MEMBER_TO_FEATURES_AND_TEAMS,
            SUPER_ADMIN_PERMISSION_ENUM.REMOVE_MEMBER_FROM_FEATURES_AND_TEAMS,
        ],
    },

    {
        displayName: PERMISSION_GROUP.INTERNAL_COMPANY,
        description: "Access to internal company resources",
        permission_type: PERMISSION_TYPE.SUPER_ADMIN_SETTINGS,
        permissions: [
            SUPER_ADMIN_PERMISSION_ENUM.READ_INTERNAL_COMPANY,
            SUPER_ADMIN_PERMISSION_ENUM.UPDATE_INTERNAL_COMPANY,
            SUPER_ADMIN_PERMISSION_ENUM.DELETE_INTERNAL_COMPANY,
        ],
    },

    // ! SUPER_ADMIN ENDS
];
const HOTEL_COMPANY_PERMISSION_GROUPS = [
    {
        displayName: PERMISSION_GROUP.BOOKING,
        description: "Access to booking resources",
        permission_type: PERMISSION_TYPE.COMPANY_SETTINGS,
        permissions: [
            COMPANY_PERMISSION_ENUM.READ_BOOKING,
            COMPANY_PERMISSION_ENUM.READ_BOOKING_DETAILS,
            COMPANY_PERMISSION_ENUM.UPDATE_BOOKING,
            COMPANY_PERMISSION_ENUM.DELETE_BOOKING,
            COMPANY_PERMISSION_ENUM.CREATE_BOOKING,
        ],
    },
    {
        displayName: PERMISSION_GROUP.ROOMS,
        description: "Access to room resources",
        permission_type: PERMISSION_TYPE.COMPANY_SETTINGS,
        permissions: [
            COMPANY_PERMISSION_ENUM.CREATE_ROOM,
            COMPANY_PERMISSION_ENUM.READ_ROOM,
            COMPANY_PERMISSION_ENUM.UPDATE_ROOM,
            COMPANY_PERMISSION_ENUM.DELETE_ROOM,
        ],
    },

    {
        displayName: PERMISSION_GROUP.ROOM_TYPES,
        description: "Access to room type resources",
        permission_type: PERMISSION_TYPE.COMPANY_SETTINGS,
        permissions: [
            COMPANY_PERMISSION_ENUM.CREATE_ROOM_TYPE,
            COMPANY_PERMISSION_ENUM.READ_ROOM_TYPE,
            COMPANY_PERMISSION_ENUM.UPDATE_ROOM_TYPE,
            COMPANY_PERMISSION_ENUM.DELETE_ROOM_TYPE,
        ],
    },
];

const NORMAL_PERMISSION_GROUPS = [
    {
        displayName: PERMISSION_GROUP.DASHBOARD,
        description: "Access to dashboard resources",
        permission_type: PERMISSION_TYPE.NORMAL,
        permissions: [PERMISSION_ENUM.READ_DASHBOARD],
    },
    {
        displayName: PERMISSION_GROUP.PROJECTS,
        description: "Access to project/event resources",
        permission_type: PERMISSION_TYPE.NORMAL,
        permissions: [
            PERMISSION_ENUM.CREATE_PROJECT,
            PERMISSION_ENUM.READ_PROJECT,
            PERMISSION_ENUM.UPDATE_PROJECT,
            PERMISSION_ENUM.DELETE_PROJECT,
        ],
    },
    {
        displayName: PERMISSION_GROUP.TASKS,
        description: "Access to task resources",
        permission_type: PERMISSION_TYPE.NORMAL,
        permissions: [
            PERMISSION_ENUM.CREATE_TASK,
            PERMISSION_ENUM.READ_TASK,
            PERMISSION_ENUM.UPDATE_TASK,
            PERMISSION_ENUM.DELETE_TASK,
        ],
    },
    {
        displayName: PERMISSION_GROUP.CUSTOMERS,
        description: "Access to customer resources",
        permission_type: PERMISSION_TYPE.NORMAL,
        permissions: [
            PERMISSION_ENUM.CREATE_CUSTOMER,
            PERMISSION_ENUM.READ_CUSTOMER,
            PERMISSION_ENUM.UPDATE_CUSTOMER,
            PERMISSION_ENUM.DELETE_CUSTOMER,
        ],
    },
];

const NORMAL_SETTINGS_PERMISSION_GROUPS = [
    {
        displayName: PERMISSION_GROUP.SPRINTS,
        description: "Access to sprint resources",
        permission_type: PERMISSION_TYPE.NORMAL_SETTINGS,
        permissions: [
            PERMISSION_ENUM.READ_SPRINT,
            PERMISSION_ENUM.CREATE_SPRINT,
            PERMISSION_ENUM.UPDATE_SPRINT,
            PERMISSION_ENUM.DELETE_SPRINT,
        ],
    },
    {
        displayName: PERMISSION_GROUP.LABELS,
        description: "Access to normal labels resources",
        permission_type: PERMISSION_TYPE.NORMAL_SETTINGS,
        permissions: [
            PERMISSION_ENUM.DELETE_LABEL,
            PERMISSION_ENUM.CREATE_LABEL,
            PERMISSION_ENUM.READ_LABEL,
            PERMISSION_ENUM.UPDATE_LABEL,
        ],
    },

    {
        displayName: PERMISSION_GROUP.TASK_STATUS,
        description: "Access to task status resources",
        permission_type: PERMISSION_TYPE.NORMAL_SETTINGS,
        permissions: [
            PERMISSION_ENUM.CREATE_TASK_STATUS,
            PERMISSION_ENUM.READ_TASK_STATUS,
            PERMISSION_ENUM.UPDATE_TASK_STATUS,
            PERMISSION_ENUM.DELETE_TASK_STATUS,
        ],
    },
];

// ! DEFAULT PERMISSIONS ENDS HERE

export {
    SUPER_ADMIN_PERMISSION_GROUPS,
    NORMAL_PERMISSION_GROUPS,
    HOTEL_COMPANY_PERMISSION_GROUPS,
    NORMAL_SETTINGS_PERMISSION_GROUPS,
};
