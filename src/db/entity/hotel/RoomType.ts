import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Facility } from "../../../enums/Facility";
import { Room } from "./Room";
import { UploadFile } from "../uploads";

@Entity()
export class RoomType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    slug: string;

    @Column({
        type: "text",
        nullable: true,
    })
    description: string;

    @Column({
        type: "enum",
        enum: Facility,
        array: true,
        nullable: true,
    })
    facilities: Facility[];

    @Column()
    isActive: boolean;

    @Column({ nullable: true })
    thumbnailPublicUrl: string;

    @Column({ nullable: true })
    thumbnailUrlId: string;

    @OneToOne(() => UploadFile, (user) => user.id, {
        nullable: true,
        eager: false,
    })
    @JoinColumn({ name: "thumbnailUrlId" })
    thumbnailUrl: UploadFile;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    roomPrice: number;

    @OneToMany(() => Room, (room) => room.roomType)
    rooms: Room[];

    @Column()
    total_number_of_rooms: number;
}
