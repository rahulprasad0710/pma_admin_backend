import { FindOptionsRelations, ILike, In } from "typeorm";

import { IRoomPagination } from "../../types/payload";
import { InternalCompany } from "../../db/entity/InternalCompany";
import { Room } from "../../db/entity/hotel/Room";
import { RoomType } from "../../db/entity/hotel/RoomType";
import createPagination from "../../utils/createPagination";
import dataSource from "../../db/data-source";

export interface IRoom {
    roomNumber: string;
    internal_company: number;
    roomType: number;
    isActive: boolean;
}

export class RoomService {
    private readonly roomRepository = dataSource.getRepository(Room);
    private readonly internalCompanyRepository =
        dataSource.getRepository(InternalCompany);

    private readonly roomTypeRepository = dataSource.getRepository(RoomType);

    async create(room: IRoom) {
        const roomObj = new Room();

        const internalCompany = await this.internalCompanyRepository.findOneBy({
            id: room.internal_company,
        });

        const roomTypeData = await this.roomTypeRepository.findOne({
            where: {
                id: room.roomType,
            },
        });

        if (!internalCompany) throw new Error("Internal company not found");

        if (!roomTypeData) throw new Error("Room Type not found");

        roomObj.roomNumber = room.roomNumber;
        roomObj.roomType = roomTypeData;
        roomObj.isActive = room.isActive;
        roomObj.internal_company = internalCompany;

        return await this.roomRepository.save(roomObj);
    }

    async getAll(query: IRoomPagination) {
        const {
            skip,
            take,
            isPaginationEnabled,
            keyword,
            isActive,
            roomTypeId,
        } = query;

        const result = await this.roomRepository.find({
            skip,
            take,
            relations: ["roomType"],
            where: {
                ...{ isActive: isActive },
                ...(keyword ? { roomNumber: ILike(`%${keyword}%`) } : {}),
                ...(roomTypeId ? { roomType: In(roomTypeId) } : {}),
            },
        });
        return {
            result,
            pagination: createPagination(
                skip,
                take,
                result.length,
                isPaginationEnabled
            ),
        };
    }

    async getById(
        id: number,
        relation: FindOptionsRelations<Room> | undefined
    ) {
        if (!relation) {
            relation = {
                internal_company: true,
                roomType: true,
            };
        }

        const result = await this.roomRepository.findOne({
            where: { id },
            relations: relation,
        });

        return result;
    }

    async update(id: number, room: IRoom) {
        const roomObj = new Room();

        const internalCompany = await this.internalCompanyRepository.findOneBy({
            id: room.internal_company,
        });

        const roomTypeData = await this.roomTypeRepository.findOne({
            where: {
                id: room.roomType,
            },
        });

        if (!internalCompany) throw new Error("Internal company not found");

        if (!roomTypeData) throw new Error("Room Type not found");

        roomObj.roomNumber = room.roomNumber;
        roomObj.roomType = roomTypeData;
        roomObj.isActive = room.isActive;
        roomObj.internal_company = internalCompany;
        const response = await this.roomRepository.update(id, roomObj);
        return response;
    }

    async delete(id: number) {
        const room = await this.roomRepository.findOneBy({ id });
        if (!room) throw new Error("Room not found");

        await this.roomRepository.remove(room);
        return { message: "Room deleted successfully" };
    }
}

export default RoomService;
