import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

import { BookingRoom } from "./BookingRoom";
import { InternalCompany } from "../InternalCompany";
import { RoomType } from "./RoomType";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    roomNumber: string;

    @Column({ default: true })
    isActive: boolean;

    @Column()
    internal_company_id: number;

    @ManyToOne(
        () => InternalCompany,
        (internal_company) => internal_company.id,
        {
            eager: false,
        }
    )
    @JoinColumn({ name: "internal_company_id" })
    internal_company: InternalCompany;

    @ManyToOne(() => RoomType, (roomType) => roomType.rooms, {
        eager: true,
    })
    roomType: RoomType;
}
