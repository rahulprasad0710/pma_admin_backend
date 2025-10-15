// CREATE TABLE service_failures (
//     id SERIAL PRIMARY KEY,
//     booking_id INT NOT NULL,
//     service_name VARCHAR(50) NOT NULL,
//     error_message TEXT,
//     created_at TIMESTAMP DEFAULT now(),
//     FOREIGN KEY (booking_id) REFERENCES bookings(id)
// );

// CREATE TABLE booking_logs (
//     id SERIAL PRIMARY KEY,
//     booking_id INT NOT NULL,
//     action VARCHAR(50) NOT NULL,
//     log_time TIMESTAMP DEFAULT now(),
//     details JSONB,
//     FOREIGN KEY (booking_id) REFERENCES bookings(id)
// );

import {
    BookingServiceEnum,
    BookingStatusEnum,
} from "../../../enums/BookingEnum";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { ActionAction } from "../../../enums/enums";
import { Booking } from "../hotel/Booking";

@Entity("booking_service_failures")
export class BookingServiceFailures {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    booking_id: number;

    @ManyToOne(() => Booking, (booking) => booking.id, {
        eager: false,
    })
    @JoinColumn({ name: "booking_id" })
    bookingId: Booking;

    @Column({
        type: "enum",
        enum: BookingServiceEnum,
    })
    service_name: string;

    @Column({ type: "text", nullable: true })
    error_message: string;

    @Column({ type: "enum", enum: BookingStatusEnum, nullable: true })
    status: string;

    @Column()
    created_at: Date;

    @Column({ default: 0 })
    retries: number;
}

@Entity("booking_logs")
export class BookingLogs {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "jsonb", nullable: true })
    details: string;

    @Column({
        type: "enum",
        enum: ActionAction,
    })
    action: string;

    @Column()
    log_time: Date;

    @Column({
        type: "enum",
        enum: BookingServiceEnum,
    })
    service_name: string;

    @Column()
    booking_id: number;

    @ManyToOne(() => Booking, (booking) => booking.id, {
        eager: false,
    })
    @JoinColumn({ name: "booking_id" })
    bookingId: Booking;
}
