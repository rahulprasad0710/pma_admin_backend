import { BookingRoom } from "../db/entity/hotel/BookingRoom";
import { BookingSummary } from "../db/entity/hotel/BookingSummary";
import BookingSummaryService from "../services/hotel/bookingSummary.service";
import { ChatOllama } from "@langchain/ollama";
import { Customer } from "../db/entity/client";
import { InternalCompany } from "../db/entity/InternalCompany";
import { PromptTemplate } from "@langchain/core/prompts";
import { bookingPrompt } from "../prompts/bookingSummary";

// import { db } from "../db";

const llm = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "mistral",
    temperature: 0.2,
});

interface IBookingResponse {
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

const bookingSummaryPrompt = new PromptTemplate({
    inputVariables: ["booking", "customerDetails", "roomTypeDetails"],
    template: bookingPrompt.template,
});

export async function generateBookingSummary(
    bookingResponse: IBookingResponse,
) {
    const startTime = Date.now();

    const bookingSummaryService = new BookingSummaryService();

    try {
        const { customer, bookingRooms, ...bookingCore } = bookingResponse;

        const roomDetails = bookingRooms?.map((item) => ({
            roomNumber: item.room.roomNumber,
            roomType: item.room.roomType.name,
            facilities: item.room.roomType.facilities,
        }));

        const formattedPrompt = await bookingSummaryPrompt.format({
            booking: JSON.stringify(
                {
                    checkInDate: bookingCore.checkInDate,
                    checkOutDate: bookingCore.checkOutDate,
                    bookingDate: bookingCore.bookingDate,
                    status: bookingCore.status,
                    payment_status: bookingCore.payment_status,
                    totalPrice: bookingCore.totalPrice,
                },
                null,
                2,
            ),
            customerDetails: JSON.stringify(
                {
                    name: customer.name,
                    email: customer.email,
                    mobileNumber: customer.mobileNumber,
                    customerHistory: "Not specified",
                    previousIssues: "Not specified",
                },
                null,
                2,
            ),
            roomTypeDetails: JSON.stringify(roomDetails, null, 2),
        });

        const response = await llm.invoke(formattedPrompt);

        const summaryText = response.content as string;

        const endTime = Date.now();
        const processingTime = endTime - startTime;

        const payload = {
            booking_id: bookingResponse.id,
            summary: summaryText,
            generatedAt: new Date(),
            status: "success",
            process_time_ms: String(processingTime),
            token_used: Math.ceil(summaryText.length / 4),
        };
        const result = await bookingSummaryService.create(payload);

        return result;
    } catch (error) {
        console.error("generateBookingSummary error:", error);

        const endTime = Date.now();
        const processingTime = endTime - startTime;

        const payload = {
            booking_id: bookingResponse.id,
            summary: "",
            generatedAt: new Date(),
            status: "failed",
            process_time_ms: String(processingTime),
            token_used: 0,
        };
        const result = await bookingSummaryService.create(payload);

        return result;
    }
}
