import { Router as ExpressRouter } from "express";
import bookingRoute from "./booking.route";
import roomAvailabilityRoute from "./roomAvailability.route";
// ROUTES
import roomRoute from "./room.route";
import roomTypeRoute from "./roomType.route";

export type Route = {
    path: string;
    routes: ExpressRouter;
};

const router: ExpressRouter = ExpressRouter();

const routes = [
    {
        path: "/rooms",
        route: roomRoute,
    },
    {
        path: "/bookings",
        route: bookingRoute,
    },
    {
        path: "/room-types",
        route: roomTypeRoute,
    },

    {
        path: "/availability",
        route: roomAvailabilityRoute,
    },
];

routes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
