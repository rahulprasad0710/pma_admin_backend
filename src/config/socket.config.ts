import { IncomingMessage, ServerResponse } from "http";

import AppConfig from "../constants/AppConfig";
import { Server } from "socket.io";
import { TNotification } from "../types/types";
import { socketAuth } from "../middlewares/authentication";
import socketFn from "../services/config/socket.service";

interface ServerToClientEvents {
    NOTIFICATION_TO_CLIENT: (notification: TNotification) => void;
    // you can add more events here
}

interface ClientToServerEvents {
    NOTIFICATION_TO_SERVER: (data: any) => void;
}

type ISocketIORef = {
    io: Server<ClientToServerEvents, ServerToClientEvents> | null;
};

export const socketIORef: ISocketIORef = {
    io: null,
};

export function socketConnect(httpServer: import("http").Server) {
    const io = new Server(httpServer, {
        cors: {
            credentials: true,
            origin: AppConfig.CLIENT_BASE_URL,
        },
    });

    socketIORef.io = io;

    io.use(socketAuth);

    io.on("connection", async (socket) => {
        const userId = socket.verifiedUserId;
        console.log({
            socket: socket.id,
            userId: socket.verifiedUserId,
        });

        if (!userId) return;

        const response = await socketFn.addClient(userId, socket.id, {
            userId,
            socketId: socket.id,
        });

        return response;
    });

    io.on("error", (error) => {
        console.error("Socket.io error:", error);
    });
}
