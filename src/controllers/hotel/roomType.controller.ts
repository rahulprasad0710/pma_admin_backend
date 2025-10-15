import { Request, Response } from "express";

import { IPagination } from "../../types/express";
import RoomTypeService from "../../services/hotel/roomType.service";

const roomTypeService = new RoomTypeService();

export class RoomTypeController {
    async create(req: Request, res: Response) {
        const data = req.body;
        const { verifiedUserId } = req;

        const result = await roomTypeService.create(data, verifiedUserId);
        res.status(200).json({
            success: true,
            data: result,
            message: "RoomType created successfully",
        });
    }

    async getAll(req: Request, res: Response) {
        const { isActive } = req.query;
        const { skip, take, keyword, isPaginationEnabled }: IPagination =
            req.pagination;
        const result = await roomTypeService.getAll({
            isActive: isActive === "true",
            isPaginationEnabled,
            keyword,
            skip,
            take,
        });
        res.status(200).json({
            success: true,
            data: result,
            message: "RoomType fetched successfully",
        });
    }

    async getById(req: Request, res: Response) {
        const { id } = req.params;
        const result = await roomTypeService.getById(Number(id));
        res.status(200).json({
            success: true,
            data: result,
            message: "RoomType fetched successfully",
        });
    }

    async update(req: Request, res: Response) {
        const { id } = req.params;
        const data = req.body;
        const { verifiedUserId } = req;
        const result = await roomTypeService.update(
            Number(id),
            data,
            verifiedUserId
        );
        res.status(200).json({
            success: true,
            data: result,
            message: "RoomType updated successfully",
        });
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params;
        const result = await roomTypeService.delete(Number(id));
        res.status(200).json({
            success: true,
            data: result,
            message: "RoomType deleted successfully",
        });
    }
}

export default new RoomTypeController();
