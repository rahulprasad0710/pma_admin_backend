import { Router as ExpressRouter } from "express";
import productRoute from "./products.route";
import productSettingsRoute from "./product-settings.route";

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
    {
        path: "/product-settings",
        route: productSettingsRoute,
    },
];

routes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
