import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./User";

@Entity()
export class Sprint {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: "text", nullable: true })
    goal: string;

    @Column({ type: "timestamp" })
    startDate: Date;

    @Column({ type: "timestamp" })
    endDate: Date;

    @Column({ default: true })
    isActive: boolean;
}
