import { Router as ExpressRouter } from "express";
import productRoute from "./products.route";

export type Route = {
    path: string;
    routes: ExpressRouter;
};

const router: ExpressRouter = ExpressRouter();

const routes = [
    {
        path: "/products",
        route: productRoute,
    },
];

routes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
