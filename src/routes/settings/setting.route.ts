import { Router as ExpressRouter } from "express";
import taskStatusRoute from "./taskStatus.route";

export type Route = {
    path: string;
    routes: ExpressRouter;
};

const router: ExpressRouter = ExpressRouter();

const routes = [
    {
        path: "/task-status",
        route: taskStatusRoute,
    },
];

routes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
