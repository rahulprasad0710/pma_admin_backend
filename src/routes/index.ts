import { Router as ExpressRouter } from "express";
// Main router that aggregates all routes
import SettingRoute from "./settings/setting.route"; // Importing Route type from settings
import authRoute from "./auth.route";
import customerRoute from "./customer.route";
import ecommerceRoute from "./ecommerce/ecommerce.route";
import employeeRoute from "./users.route";
import featureRoute from "./feature.route";
import hotelRoute from "./hotel/hotel.route";
import internalCompanyRoute from "./internalCompany.route";
import labelRoute from "./label.route";
import permissionRoute from "./permission.route";
import projectRoute from "./projects.route";
import roleRoute from "./role.route";
import sprintRoute from "./sprint.route";
import taskRoute from "./tasks.route";
import uploadRoute from "./uploads.route";

export type Route = {
    path: string;
    routes: ExpressRouter;
};

const router: ExpressRouter = ExpressRouter();

const routes = [
    {
        path: "/auth",
        route: authRoute,
    },
    {
        path: "/employees",
        route: employeeRoute,
    },
    {
        path: "/projects",
        route: projectRoute,
    },
    {
        path: "/features",
        route: featureRoute,
    },
    {
        path: "/tasks",
        route: taskRoute,
    },
    {
        path: "/uploads",
        route: uploadRoute,
    },
    {
        path: "/sprints",
        route: sprintRoute,
    },
    {
        path: "/labels",
        route: labelRoute,
    },
    {
        path: "/internal-companies",
        route: internalCompanyRoute,
    },
    {
        path: "/permissions",
        route: permissionRoute,
    },
    {
        path: "/roles",
        route: roleRoute,
    },

    {
        path: "/settings",
        route: SettingRoute,
    },
    {
        path: "/hotels",
        route: hotelRoute,
    },
    {
        path: "/ecommerce",
        route: ecommerceRoute,
    },
    {
        path: "/customers",
        route: customerRoute,
    },
];

// apply middleware to all routes

routes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
