// services/bookingSummary.service.ts

import { BookingSummary } from "../../db/entity/hotel/BookingSummary";
import { IActivePagination } from "../../types/payload";
import { ILike } from "typeorm";
import createPagination from "../../utils/createPagination";
import dataSource from "../../db/data-source";

interface IBookingSummaryCreate {
    booking_id: number;
    summary: string;
    status: string;
    process_time_ms: string;
    token_used?: number;
}

interface IBookingSummaryUpdate {
    summary?: string;
    status?: string;
    process_time_ms?: string;
    token_used?: number;
}

export class BookingSummaryService {
    private readonly bookingSummaryRepository =
        dataSource.getRepository(BookingSummary);

    // CREATE
    async create(payload: IBookingSummaryCreate) {
        const summary = new BookingSummary();

        summary.booking_id = payload.booking_id;
        summary.summary = payload.summary;
        summary.status = payload.status;
        summary.process_time_ms = payload.process_time_ms;
        summary.token_used = payload.token_used ?? 0;

        return await this.bookingSummaryRepository.save(summary);
    }

    // GET ALL (with pagination)
    async getAll(query: IActivePagination) {
        const { skip, take, isPaginationEnabled, keyword } = query;

        const [result, totalCount] =
            await this.bookingSummaryRepository.findAndCount({
                skip,
                take,
                where: {
                    ...(keyword ? { summary: ILike(`%${keyword}%`) } : {}),
                },
                relations: ["booking"],
                order: {
                    generatedAt: "DESC",
                },
            });

        return {
            result,
            pagination: createPagination(
                skip,
                take,
                totalCount,
                isPaginationEnabled,
            ),
        };
    }

    // GET BY ID
    async getById(id: string) {
        return await this.bookingSummaryRepository.findOne({
            where: { id },
            relations: ["booking"],
        });
    }

    // GET BY BOOKING ID (VERY IMPORTANT)
    async getByBookingId(bookingId: number) {
        return await this.bookingSummaryRepository.find({
            where: { booking_id: bookingId },
            order: {
                generatedAt: "DESC",
            },
        });
    }

    // UPDATE
    async update(id: string, updateFields: IBookingSummaryUpdate) {
        const summary = await this.bookingSummaryRepository.findOneBy({ id });

        if (!summary) {
            throw new Error("Booking summary not found");
        }

        Object.assign(summary, updateFields);
        return await this.bookingSummaryRepository.save(summary);
    }

    // DELETE (hard delete)
    async delete(id: string) {
        const summary = await this.bookingSummaryRepository.findOneBy({ id });

        if (!summary) {
            throw new Error("Booking summary not found");
        }

        return await this.bookingSummaryRepository.remove(summary);
    }
}

export default BookingSummaryService;
