import Queue, { Queue as QueueType } from "bull";

import { BookingRoom } from "../db/entity/hotel/BookingRoom";
import { BookingSummary } from "../db/entity/hotel/BookingSummary";
import { Customer } from "../db/entity/client";
import { InternalCompany } from "../db/entity/InternalCompany";
import { redisConfig } from "./jobs";

// types/booking-ai.types.ts

interface TBookingAISummaryJob {
    customer: Partial<Customer>;
    bookingRooms: BookingRoom[];
    id: number;
    userBookingId: string;
    checkInDate: Date;
    checkOutDate: Date;
    status: string;
    payment_status: string;
    totalPrice: number;
    bookingDate: Date;
    customerId: string;
    hotelId: number;
    hotel: InternalCompany;
    aiSummaries: BookingSummary[];
}

let bookingAISummaryQueue: QueueType<TBookingAISummaryJob> | null = null;

export async function getBookingAISummaryQueue(): Promise<
    QueueType<TBookingAISummaryJob>
> {
    if (bookingAISummaryQueue) return bookingAISummaryQueue;

    bookingAISummaryQueue = new Queue<TBookingAISummaryJob>(
        "booking-ai-summary-queue",
        redisConfig,
    );

    return bookingAISummaryQueue;
}

export async function addBookingAISummaryToQueue(
    bookingSummary: TBookingAISummaryJob,
) {
    const emailQueue = await getBookingAISummaryQueue();
    await emailQueue.add("booking-ai-summary-queue", bookingSummary, {
        attempts: 5,
        backoff: {
            type: "exponential",
            delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    });
}
