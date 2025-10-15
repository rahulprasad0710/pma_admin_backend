import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";
import { EmailStatus, EmailType } from "../../enums/email.enum";

@Entity("email_notifications")
export class EmailNotifications {
    constructor() {
        this.createdAt = new Date();
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: EmailType,
    })
    type: EmailType;

    @Column()
    to: string;

    @Column({
        type: "enum",
        enum: EmailStatus,
    })
    status: EmailStatus;

    @Column()
    data_id: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    subject: string;

    @Column({ nullable: true })
    text: string;

    @Column({ nullable: true })
    html_template: string;

    @Column({ default: 0 })
    retries: number;
}
