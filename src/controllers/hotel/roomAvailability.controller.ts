import { Request, Response } from "express";

import roomAvailabilityService from "../../services/hotel/roomAvailability.service";

export class RoomAvailabilityController {
    async getRoomTypeAvailability(req: Request, res: Response) {
        const { checkInDate, checkOutDate, roomTypeId } = req.query;

        const roomTypeIdsArray: number[] =
            typeof roomTypeId === "string"
                ? roomTypeId.split(",").map((id) => Number(id))
                : [];

        const result = await roomAvailabilityService.getRoomTypeAvailability({
            roomTypeId: roomTypeIdsArray,
            checkInDate: checkInDate as string,
            checkOutDate: checkOutDate as string,
        });
        res.status(201).json({
            success: true,
            data: result,
            message: "Room Availability Fetched successfully",
        });
    }
}

export default RoomAvailabilityController;
