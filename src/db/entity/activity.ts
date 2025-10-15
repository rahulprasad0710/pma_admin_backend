import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { ActivityAction } from "./../../enums/ActivityAction";
import { Task } from "./task";
import { User } from "./User";

@Entity()
export class Activity {
    constructor() {
        this.createdAt = new Date();
    }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.id)
    activityBy: User;

    @Column({
        type: "enum",
        enum: ActivityAction,
    })
    action: ActivityAction;

    @ManyToOne(() => Task, (task) => task.id)
    task: Task;

    @Column({ type: "text", nullable: true })
    details: string;

    @Column({ type: "text", nullable: true })
    comment: string;

    @CreateDateColumn()
    createdAt: Date;
}

// Adam moved the ticket from In Progress to Done
// Adam created a ticket for you
// Adam updated a ticket assigned to you
// Adam assigned a ticket to you
// Adam added a comment to the ticket assigned to you
// adam edited a comment on the ticket assigned to you
// Adam deleted a comment to the ticket  assigned to you
