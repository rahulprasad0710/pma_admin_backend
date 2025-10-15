import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Task } from "./task";
import { User } from "./User";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text" })
    content: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    addedAt: Date;

    @ManyToOne(() => User, (user) => user.id, { nullable: false })
    addedBy: User;

    @ManyToOne(() => Task, (task) => task.id, { nullable: false })
    @JoinColumn({
        name: "task",
    })
    task: Task;
}
