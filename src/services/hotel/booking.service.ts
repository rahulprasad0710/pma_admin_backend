import {
    BookingFullPayload,
    BookingPayload,
    IBookingLogPayload,
    IBookingServiceFailuresPayload,
} from "../../types/Booking";
import {
    BookingLogs,
    BookingServiceFailures,
} from "../../db/entity/hotel/BookingServiceFailure";
import { IBookingPagination, IBookingResponse } from "../../types/payload";

import AppError from "../../utils/AppError";
import { Booking } from "../../db/entity/hotel/Booking";
import { BookingRoom } from "./../../db/entity/hotel/BookingRoom";
import { CredentialType } from "../../enums/CredentialType";
import { Customer } from "../../db/entity/client/index";
import { ErrorType } from "../../enums/Eums";
import { ICustomerByAdmin } from "../customer.service";
import { ILike } from "typeorm";
import { RedisService } from "./../config/redis.service";
import { Room } from "../../db/entity/hotel/Room";
import createPagination from "../../utils/createPagination";
import dataSource from "../../db/data-source";
import { generateUniqueId } from "../../utils/generateUniqueId";
import roomAvailabilityService from "./roomAvailability.service";
import { sanitizeCustomerResult } from "../../utils/sanitizeCustomer";

export class BookingService {
    private readonly bookingRepository = dataSource.getRepository(Booking);
    private readonly bookingRoomRepository =
        dataSource.getRepository(BookingRoom);
    private readonly bookingServiceFailuresRepository =
        dataSource.getRepository(BookingServiceFailures);

    private readonly bookingLogsRepository =
        dataSource.getRepository(BookingLogs);

    async create(fullPayload: BookingFullPayload) {
        const { bookingIdemKey, ...payload } = fullPayload;

        if (!bookingIdemKey || bookingIdemKey === "") {
            throw new AppError(
                "Bad Request. Missing Key.",
                400,
                ErrorType.BAD_REQUEST_ERROR
            );
        } else {
            const alreadyCachedBookingKey = await RedisService.getValue(
                `bookingKey:${bookingIdemKey}`
            );

            if (alreadyCachedBookingKey) {
                const data = JSON.parse(alreadyCachedBookingKey as string);
                return data;
            } else {
                const bookingResult = await this.createBooking(payload);

                await RedisService.setValue(
                    `bookingKey:${bookingIdemKey}`,
                    JSON.stringify(bookingResult)
                );

                return bookingResult;
            }
        }
    }

    async createBooking(payload: BookingPayload) {
        const queryRunner = dataSource.createQueryRunner();

        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            let totalPrice = 0;
            const roomList: Room[] = [];

            await Promise.all(
                payload.roomNumberIds.map(async (roomId) => {
                    const room = await queryRunner.manager
                        .getRepository(Room)
                        .findOne({
                            where: { id: roomId },
                            relations: ["roomType"],
                        });

                    if (room?.roomType?.roomPrice) {
                        roomList.push(room);
                        totalPrice += Number(room.roomType.roomPrice);
                    }
                })
            );

            let customerResult;

            if (payload.isNewCustomer) {
                const createCustomer: ICustomerByAdmin = {
                    name: payload.name,
                    associated_internal_company_id:
                        payload.associated_internal_company_id,
                    email: payload.email,
                    mobileNumber: payload.mobileNumber,
                    CredentialType: CredentialType.ADMIN,
                    isAccountByAdmin: true,
                    createdAt: new Date(),
                    id: await generateUniqueId(),
                };
                // Customer creation under same transaction

                customerResult = await queryRunner.manager
                    .getRepository(Customer)
                    .save(createCustomer);
            } else {
                customerResult = await queryRunner.manager
                    .getRepository(Customer)
                    .findOneBy({
                        id: payload.customerId,
                    });
            }
            if (!customerResult) {
                throw new AppError(
                    "User Error.",
                    500,
                    ErrorType.INTERNAL_SERVER_ERROR
                );
            }

            const totalBookingCount = await queryRunner.manager
                .getRepository(Booking)
                .count();

            const userBookingNumber = String(totalBookingCount + 1).padStart(
                4,
                "0"
            );

            const newBooking = queryRunner.manager.create(Booking, {
                customer: customerResult,
                userBookingId: `BID-${userBookingNumber}`,
                checkInDate: payload.checkInDate,
                checkOutDate: payload.checkOutDate,
                bookingDate: payload.bookingDate,
                hotelId: payload.associated_internal_company_id,
                status: "CONFIRMED",
                payment_status: "CASH_ON_DELIVERY",
                totalPrice,
            });

            const newBookingResult = await queryRunner.manager
                .getRepository(Booking)
                .save(newBooking);

            const bookedRoomResult = await Promise.all(
                roomList.map(async (room, index) => {
                    const totalBookingRoomCount = await queryRunner.manager
                        .getRepository(BookingRoom)
                        .count();

                    const userBookingRoomNumber = String(
                        totalBookingRoomCount + index + 1
                    ).padStart(4, "0");

                    const newBookingRoom = queryRunner.manager.create(
                        BookingRoom,
                        {
                            booking: newBookingResult,
                            room_status: "BOOKED",
                            room,
                            userBookingRoomId: `BRID-${userBookingRoomNumber}`,
                        }
                    );

                    return await queryRunner.manager
                        .getRepository(BookingRoom)
                        .save(newBookingRoom);
                })
            );

            await queryRunner.commitTransaction();

            const bookingResponse: IBookingResponse = {
                ...newBookingResult,
                bookedRoomResult,
            };

            return bookingResponse;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async getAll(query: IBookingPagination) {
        const {
            skip,
            take,
            isPaginationEnabled,
            dateStart,
            dateEnd,
            customerId,
            bookingDate,
            keyword,
        } = query;

        const [result, totalCount] = await this.bookingRepository.findAndCount({
            skip: skip,
            take: take,
            order: {
                id: "DESC",
            },
            relations: ["customer"],
            where: {
                ...(dateStart ? { checkInDate: dateStart } : {}),
                ...(dateEnd ? { checkOutDate: dateEnd } : {}),
                ...(customerId ? { customerId: customerId } : {}),
                ...(bookingDate ? { bookingDate: bookingDate } : {}),
                ...(keyword ? { userBookingId: ILike(`%${keyword}%`) } : {}),
            },
        });
        return {
            result: result.map((item) => {
                return {
                    ...item,
                    customer: {
                        id: item.customer.id,
                        name: item.customer.name,
                        email: item.customer.email,
                        mobileNumber: item.customer.mobileNumber,
                        associated_internal_company_id:
                            item.customer.associated_internal_company_id,
                    },
                };
            }),
            pagination: createPagination(
                skip,
                take,
                totalCount,
                isPaginationEnabled
            ),
        };
    }

    async getById(id: number) {
        const result = await this.bookingRepository.findOne({
            where: { id: id },
            relations: ["customer"],
        });

        if (!result) {
            throw new AppError(
                "Booking not found.",
                404,
                ErrorType.NOT_FOUND_ERROR
            );
        }

        const bookingRoomResult = await this.bookingRoomRepository.find({
            where: { bookingId: id },
            relations: ["room"],
        });

        return {
            ...result,
            customer: sanitizeCustomerResult({ customer: result?.customer }),
            bookingRooms: bookingRoomResult,
        };
    }

    async createBookingServiceFailures({
        bookingId,
        serviceName,
        error,
        status,
        retry,
    }: IBookingServiceFailuresPayload) {
        const payload = new BookingServiceFailures();
        payload.booking_id = bookingId;
        payload.service_name = serviceName;
        payload.error_message = error;
        payload.created_at = new Date();
        payload.status = status;
        payload.retries = retry;

        const result = await this.bookingServiceFailuresRepository.save(
            payload
        );
        return result;
    }

    async createBookingLog({
        bookingId,
        serviceName,
        action,
        details,
    }: IBookingLogPayload) {
        const payload = new BookingLogs();
        payload.booking_id = bookingId;
        payload.service_name = serviceName;
        payload.action = action;
        payload.details = details;
        payload.log_time = new Date();

        const result = await this.bookingLogsRepository.save(payload);
        return result;
    }
}
