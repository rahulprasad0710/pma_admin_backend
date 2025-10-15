import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToMany,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Notification } from "./Notification";
import { User } from "./User";

@Entity("user_notifications")
export class UserNotification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn({ default: null, nullable: true })
    read_at: Date;

    @Column()
    user_id: number;

    @ManyToMany(() => User, (user) => user.id)
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column()
    notification_id: number;

    @ManyToMany(() => Notification, (notification) => notification.id)
    @JoinColumn({ name: "notification_id" })
    notification: Notification;
}
