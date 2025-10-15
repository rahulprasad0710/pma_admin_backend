import APP_CONSTANT from "../../constants/AppConfig";
import { Facility } from "../../enums/Facility";
import { IActivePagination } from "../../types/payload";
import { ILike } from "typeorm";
import { RoomType } from "../../db/entity/hotel/RoomType";
import { UploadFile } from "../../db/entity/uploads";
import UploadService from "../upload.service";
import createPagination from "../../utils/createPagination";
import dataSource from "../../db/data-source";
import { generateSlug } from "../../utils/fn";
import hotelService from "./hotel.service";
import { sanitizeDBResult } from "../../utils/sanitizeDbResult";
interface IRoomType {
    name: string;
    facilities?: Facility[];
    roomPrice: number;
    total_number_of_rooms: number;
    thumbnailUrl: string;
    isActive: boolean;
    description: string;
}

export class RoomTypeService {
    private readonly roomTypeRepository = dataSource.getRepository(RoomType);
    private readonly uploadRepository = dataSource.getRepository(UploadFile);

    async create(roomType: IRoomType, userId: number) {
        const result = await this.insert(roomType);

        const path = `/rooms`;

        const url = `${APP_CONSTANT.NEXT_CLIENT_URL}/api/revalidate?secret=${
            APP_CONSTANT.REVALIDATE_TOKEN
        }&path=${encodeURIComponent(path)}`;

        await hotelService.getRequest(url, userId, {
            apiAction: "CREATE_ROOM_TYPE",
            apiName: `${
                APP_CONSTANT.NEXT_CLIENT_URL
            }/api/revalidate&path=${encodeURIComponent(path)}$secret=${
                APP_CONSTANT.REVALIDATE_TOKEN
            }&tag=rooms`,
            apiFor: "ROOM_TYPE",
            method: "POST",
        });

        return result;
    }

    async insert(roomType: IRoomType) {
        const roomTypeObj = new RoomType();
        roomTypeObj.name = roomType.name;
        roomTypeObj.facilities = roomType.facilities || [];
        roomTypeObj.roomPrice = roomType.roomPrice;
        roomTypeObj.total_number_of_rooms = roomType.total_number_of_rooms;
        roomTypeObj.isActive = roomType.isActive;
        roomTypeObj.description = roomType.description;
        roomTypeObj.slug = generateSlug(roomType.name);

        const uploadFile = await this.uploadRepository.findOne({
            where: { id: roomType.thumbnailUrl },
        });

        if (uploadFile) {
            roomTypeObj.thumbnailUrlId = uploadFile.id;
            roomTypeObj.thumbnailUrl = uploadFile;
            roomTypeObj.thumbnailPublicUrl = uploadFile.cloudUrl;
        }

        const result = await this.roomTypeRepository.save(roomTypeObj);

        return result;
    }

    async getAll(query: IActivePagination) {
        const { skip, take, isPaginationEnabled, keyword, isActive } = query;

        const result = await this.roomTypeRepository.find({
            skip,
            take,
            select: [
                "id",
                "name",
                "description",
                "isActive",
                "thumbnailUrlId",
                "roomPrice",
                "total_number_of_rooms",
                "facilities",
                "thumbnailPublicUrl",
            ],
            relations: ["rooms"],

            where: {
                ...{ isActive: isActive },
                ...(keyword ? { name: ILike(`%${keyword}%`) } : {}),
            },
            order: {
                id: "DESC",
            },
        });

        const sanitizeResult = result?.map((item) => {
            return {
                ...item,
                rooms: sanitizeDBResult({
                    result: item.rooms,
                    selectFields: ["id", "roomNumber"],
                }),
            };
        });

        return {
            result: sanitizeResult,
            pagination: createPagination(
                skip,
                take,
                result.length,
                isPaginationEnabled
            ),
        };
    }

    async getById(id: number) {
        const result = await this.roomTypeRepository.findOne({
            where: { id },
            relations: ["rooms"],
        });

        return {
            ...result,
            rooms: result?.rooms?.map((room) => {
                return {
                    id: room.id,
                    roomNumber: room.roomNumber,
                    isActive: room.isActive,
                };
            }),
        };
    }

    async update(id: number, roomType: IRoomType, userId: number) {
        const roomTypeResponse = await this.roomTypeRepository.findOneBy({
            id,
        });
        if (!roomTypeResponse) throw new Error("RoomType not found");

        const roomTypeObj = new RoomType();

        roomTypeObj.name = roomType.name;
        roomTypeObj.facilities = roomType.facilities || [];
        roomTypeObj.roomPrice = roomType.roomPrice;
        roomTypeObj.total_number_of_rooms = roomType.total_number_of_rooms;
        roomTypeObj.isActive = roomType.isActive;
        roomTypeObj.description = roomType.description;
        roomTypeObj.slug = generateSlug(roomType.name);

        if (roomType?.thumbnailUrl) {
            const uploadFile = await this.uploadRepository.findOne({
                where: { id: roomType.thumbnailUrl },
            });

            if (uploadFile) {
                roomTypeObj.thumbnailUrlId = uploadFile.id;
                roomTypeObj.thumbnailUrl = uploadFile;
                roomTypeObj.thumbnailPublicUrl = uploadFile.cloudUrl;
            }
        }

        const response = await this.roomTypeRepository.update(id, roomTypeObj);

        const path = `/rooms`;

        const url = `${APP_CONSTANT.NEXT_CLIENT_URL}/api/revalidate?secret=${
            APP_CONSTANT.REVALIDATE_TOKEN
        }&path=${encodeURIComponent(path)}&tag=rooms`;
        console.log("userId", userId);

        await hotelService.getRequest(url, userId, {
            apiAction: "UPDATE_ROOM_TYPE",
            apiName: `${
                APP_CONSTANT.NEXT_CLIENT_URL
            }/api/revalidate&path=${encodeURIComponent(path)}`,
            apiFor: "ROOM_TYPE",
            method: "PUT",
        });
        return response;
    }

    async delete(id: number) {
        const roomType = await this.roomTypeRepository.findOneBy({ id });
        if (!roomType) throw new Error("RoomType not found");

        await this.roomTypeRepository.remove(roomType);
        return { message: "RoomType deleted successfully" };
    }
}

export default RoomTypeService;
