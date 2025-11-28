import {
    BOOKING_EMAIL,
    BOOKING_LOGS,
    BOOKING_NOTIFICATION,
    BOOKING_TASK,
} from "../events/bookingEvents";
import { BookingServiceEnum, BookingStatusEnum } from "../enums/BookingEnum";
import {
    IBookingResponse,
    IBookingResponseDetails,
    ITask,
} from "../types/payload";

import { ActionAction } from "../enums/enums";
import { BookingService } from "../services/hotel/booking.service";
import { EmailService } from "../services/config/email.service";
import NotificationService from "../services/notification.service";
import { Priority } from "../enums/Priority";
import TaskService from "../services/task.service";
import UserService from "../services/users.service";
// subscribers/bookingSubscribers.ts
import { eventBus } from "../events/eventBus";
import socketFn from "../services/config/socket.service";

const bookingService = new BookingService();
const emailService = new EmailService();
const notificationService = new NotificationService();
const userService = new UserService();

// 1. Email subscriber
eventBus.on(BOOKING_EMAIL, async (booking: IBookingResponse) => {
    try {
        const response = await emailService.sendBookingConfirmationEmail(
            booking
        );

        const { customer: _customer, hotel: _hotel, ...payload } = booking;

        const logPayload = {
            ...payload,
            bookedRoomResult: payload?.bookedRoomResult?.map((item) => {
                const { booking: _booking, ...rest } = item;
                return rest;
            }),
        };

        await bookingService.createBookingLog({
            bookingId: booking.id,
            action: ActionAction.EMAIL_SENT,
            details: JSON.stringify(logPayload),
            serviceName: BookingServiceEnum.BOOKING_EMAIL,
        });

        return response;
    } catch (err) {
        console.log("LOG: ~ err Email:", err);
        await bookingService.createBookingServiceFailures({
            bookingId: booking.id,
            error: JSON.stringify(err),
            retry: 0,
            serviceName: BookingServiceEnum.BOOKING_EMAIL,
            status: BookingStatusEnum.FAILED,
        });
    }
});

// 3. Booking logs subscriber
eventBus.on(BOOKING_LOGS, async (booking: IBookingResponse) => {
    try {
        console.log({
            BOOKING_LOGS,
        });

        const { customer: _customer, hotel: _hotel, ...payload } = booking;

        const logPayload = {
            ...payload,
            bookedRoomResult: payload?.bookedRoomResult?.map((item) => {
                const { booking: _booking, ...rest } = item;
                return rest;
            }),
        };

        const response = await bookingService.createBookingLog({
            bookingId: booking.id,
            action: ActionAction.CREATED,
            details: JSON.stringify(logPayload),
            serviceName: BookingServiceEnum.BOOKING_CREATED,
        });
        console.log("LOG: ~ BOOKING_LOGS response:", response);
        return response;
    } catch (err) {
        console.log("LOG: ~ BOOKING_LOGS err:", err);

        await bookingService.createBookingServiceFailures({
            bookingId: booking.id,
            error: JSON.stringify(err),
            retry: 0,
            serviceName: BookingServiceEnum.BOOKING_EMAIL,
            status: BookingStatusEnum.FAILED,
        });
        return false;
    }
});

// 3. Booking Notification save and send subscriber
eventBus.on(BOOKING_NOTIFICATION, async (booking: IBookingResponseDetails) => {
    console.log({
        BOOKING_NOTIFICATION,
        bookingAddedBy: booking.addedBy,
    });
    try {
        const createNotificationResponse =
            await notificationService.createNotification({
                message: `New Booking ${
                    booking.userBookingId
                } for date ${new Date(
                    booking.checkInDate
                ).toLocaleDateString()} has been created.`,
                type: "BOOKING_NOTIFICATION",
                payload: "",
                link: `/admin/features/bookings/details/${booking.id}`,
            });

        const featureMember = await userService.getEmployeeViewByFeatureId({
            featureId: booking.feature_id,
        });

        const notificationToUsersResponse =
            await notificationService.addNotificationToUsers(
                createNotificationResponse.id,
                featureMember?.map((user) => user.id)
            );

        await Promise.all(
            featureMember?.map(async (featureUsers) => {
                await socketFn.sendNotificationByUserId(
                    featureUsers.id,
                    createNotificationResponse
                );
            })
        );

        const { customer: _customer, hotel: _hotel, ...payload } = booking;

        const logPayload = {
            ...payload,
            bookedRoomResult: payload?.bookedRoomResult?.map((item) => {
                const { booking: _booking, ...rest } = item;
                return rest;
            }),
        };

        await bookingService.createBookingLog({
            bookingId: booking.id,
            action: ActionAction.NOTIFICATION_SENT,
            details: JSON.stringify(logPayload),
            serviceName: BookingServiceEnum.BOOKING_NOTIFICATION,
        });

        return createNotificationResponse;
    } catch (err) {
        console.log("LOG: ~ err:", err);
        await bookingService.createBookingServiceFailures({
            bookingId: booking.id,
            error: JSON.stringify(err),
            retry: 0,
            serviceName: BookingServiceEnum.BOOKING_NOTIFICATION,
            status: BookingStatusEnum.FAILED,
        });
    }
});

// 1. Booking Task subscriber
eventBus.on(BOOKING_TASK, async (booking: IBookingResponseDetails) => {
    try {
        const taskService = new TaskService();
        const result = await taskService.createTaskForBooking(booking);

        const response = await bookingService.createBookingLog({
            bookingId: booking.id,
            action: ActionAction.TASK_CREATED,
            details: JSON.stringify(result),
            serviceName: BookingServiceEnum.BOOKING_TASK,
        });

        return response;
    } catch (err) {
        console.log("LOG: ~ err BOOKING_TASK:", err);
        await bookingService.createBookingServiceFailures({
            bookingId: booking.id,
            error: JSON.stringify(err),
            retry: 0,
            serviceName: BookingServiceEnum.BOOKING_TASK,
            status: BookingStatusEnum.FAILED,
        });
    }
});
