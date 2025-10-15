import { BookingServiceEnum, BookingStatusEnum } from "../enums/BookingEnum";

import { ActionAction } from "../enums/enums";

export interface BookingFullPayload extends BookingPayload {
    bookingIdemKey: string | undefined;
}

export interface BookingPayload {
    checkInDate: Date;
    checkOutDate: Date;
    bookingDate: Date;
    name: string;
    email: string;
    mobileNumber: string;
    associated_internal_company_id: number;
    feature_id: number;
    roomNumberIds: number[];
    isNewCustomer: boolean;
    customerId: string | undefined;
}

export interface IBookingServiceFailuresPayload {
    bookingId: number;
    serviceName: BookingServiceEnum;
    error: string;
    status: BookingStatusEnum;
    retry: number;
}

export interface IBookingLogPayload {
    bookingId: number;
    details: string;
    action: ActionAction;
    serviceName: BookingServiceEnum;
}
