import { Request, Response } from "express";
import RoomService, { IRoom } from "../../services/hotel/rooms.service";

import { IPagination } from "../../types/express";

const roomService = new RoomService();

export class RoomController {
    async create(req: Request, res: Response) {
        const { roomNumber, internalCompanyId, roomTypeId, isActive } =
            req.body;

        const result = await roomService.create({
            roomNumber,
            internal_company: internalCompanyId,
            roomType: roomTypeId,
            isActive: isActive,
        });
        res.status(201).json({
            success: true,
            data: result,
            message: "Room created successfully",
        });
    }

    async getAll(req: Request, res: Response) {
        const { isActive } = req.query;
        const { skip, take, keyword, isPaginationEnabled }: IPagination =
            req.pagination;

        const result = await roomService.getAll({
            isActive: isActive === "true",
            isPaginationEnabled,
            keyword,
            skip,
            take,
        });
        res.status(200).json({
            success: true,
            data: result,
            message: "Room created successfully",
        });
    }

    async getById(req: Request, res: Response) {
        const { id } = req.params;
        const result = await roomService.getById(Number(id), undefined);
        res.json({
            success: true,
            data: result,
            message: "Room fetched successfully",
        });
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const { roomNumber, internalCompanyId, roomTypeId, isActive } =
            req.body;

        const updateData: IRoom = {
            roomNumber,
            internal_company: internalCompanyId,
            roomType: roomTypeId,
            isActive: isActive,
        };

        const result = await roomService.update(Number(id), updateData);

        res.json({
            success: true,
            data: result,
            message: "Room updated successfully",
        });
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const result = await roomService.delete(Number(id));
        res.json({
            success: true,
            data: result,
            message: "Room deleted successfully",
        });
    }
}

export default new RoomController();
