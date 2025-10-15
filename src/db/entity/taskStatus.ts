import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TaskStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ type: "text", default: "#023047" })
    color_code: string;

    @Column({ default: true })
    is_active: boolean;
}
