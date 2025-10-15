import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "./User";

@Entity()
export class Department {
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

    @Column({ nullable: true })
    iconUrl: string;

    @ManyToOne(() => User, (user) => user.id)
    addedBy: User;
}
