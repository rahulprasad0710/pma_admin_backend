import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";

@Entity()
export class Label {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ type: "text", default: "#023047" })
    colorCode: string;

    @Column({ default: true })
    isActive: boolean;

    @Column()
    addedAt: Date;

    @Column()
    addedById: number;

    @ManyToOne(() => User, (user) => user.id, { eager: false })
    @JoinColumn({ name: "addedById" })
    addedBy: User;
}
