import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Booking } from "./Booking";
import { Task } from "../task";

// --- SubTask for Booking ---

@Entity("booking_task")
export class BookingTask {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Task, { onDelete: "CASCADE" })
    @JoinColumn({ name: "taskId" })
    task: Task;

    @Column()
    userBookingId: string;

    @Column()
    booking_id: number;

    @OneToOne(() => Booking, { eager: false })
    @JoinColumn({ name: "booking_id" })
    booking: Booking;
}
