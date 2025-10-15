import { RedisService } from "./redis.service";
import { TNotification } from "../../types/types";
import { socketIORef } from "../../config/socket.config";

const RedisConstant = {
    SOCKET_CLIENTS: "SOCKET_CLIENTS",
};

const getAllClients = async <T>(): Promise<Record<string, T>> => {
    const response = await RedisService.hGetAllValues(
        RedisConstant.SOCKET_CLIENTS
    );
    return response as Record<string, T>;
};

const addClient = async <T>(
    userId: number,
    socketId: string,
    payload: T
): Promise<number> => {
    // Store the client in Redis
    const response = await RedisService.hSetValue<T>(
        `${RedisConstant.SOCKET_CLIENTS}:${userId}`,
        socketId,
        payload
    );
    return response;
};

const getClient = async <T>(
    userId: number,
    socketId: string
): Promise<T | null> => {
    const response = await RedisService.hGetValue<T>(
        `${RedisConstant.SOCKET_CLIENTS}:${userId}`,
        socketId
    );
    return response;
};

const getAllSocketIdByUserId = async (userId: number): Promise<string[]> => {
    const response = await RedisService.hGetAllValues<unknown>(
        `${RedisConstant.SOCKET_CLIENTS}:${userId}`
    );
    return Object.keys(response); // keys = socketIds
};

const removeClient = async (
    userId: number,
    socketId: string
): Promise<number> => {
    return await RedisService.hDeleteField(
        `${RedisConstant.SOCKET_CLIENTS}:${userId}`,
        socketId
    );
};

const sendNotificationByUserId = async (
    userId: number,
    notification: TNotification
) => {
    const io = socketIORef.io;
    if (!io) {
        console.error("Socket.io not initialized");
        return;
    }

    // Get all socketIds for this user from Redis
    const sockets = await getAllSocketIdByUserId(userId);

    if (!sockets || Object.keys(sockets).length === 0) {
        console.warn(`No active sockets for userId=${userId}`);
        return;
    }
    // NOTIFICATION_TO_CLIENT
    for (const socketId of sockets) {
        io.to(socketId).emit("NOTIFICATION_TO_CLIENT", notification);
    }
};

export default {
    getAllClients,
    addClient,
    getClient,
    getAllSocketIdByUserId,
    removeClient,
    sendNotificationByUserId,
};
