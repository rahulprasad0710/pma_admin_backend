import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Booking } from "./Booking";

@Entity({ name: "booking_summaries" })
export class BookingSummary {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    booking_id: number;

    @ManyToOne(() => Booking, (booking) => booking.aiSummaries, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "booking_id" })
    booking: Booking;

    @Column({ type: "text" })
    summary: string;

    @CreateDateColumn({ type: "timestamp" })
    generatedAt: Date;

    @Column()
    status: string;

    @Column({ type: "timestamp" })
    process_time_ms: string;

    @Column({ type: "int", default: 0 })
    token_used: number;
}
