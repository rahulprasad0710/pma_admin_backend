import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from "typeorm";

@Entity("notifications")
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    link: string;

    @Column()
    message: string;

    @Column({ type: "json" })
    payload: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    html_template: string;
}
