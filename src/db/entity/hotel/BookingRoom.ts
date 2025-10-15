import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Booking } from "./Booking";
import { Room } from "./Room";

@Entity()
export class BookingRoom {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    userBookingRoomId: string;

    @Column()
    bookingId: number;

    @ManyToOne(() => Booking, (booking) => booking.bookingRooms, {
        eager: false,
    })
    @JoinColumn({ name: "bookingId" })
    booking: Booking;

    @Column()
    roomById: number;

    @ManyToOne(() => Room, (room) => room.id, {
        eager: false,
    })
    @JoinColumn({ name: "roomById" })
    room: Room;

    @Column()
    room_status: string;
}
