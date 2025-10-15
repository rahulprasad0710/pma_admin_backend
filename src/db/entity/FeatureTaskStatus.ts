// entities/ProjectTaskStatus.ts

import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

import { Feature } from "./Feature";
import { TaskStatus } from "./taskStatus";

@Entity("feature_task_status")
export class FeatureTaskStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    feature_id: number;

    @ManyToOne(() => Feature, (feature) => feature.id, {
        onDelete: "CASCADE",
        eager: false,
    })
    @JoinColumn({ name: "feature_id" })
    feature: Feature;

    @ManyToOne(() => TaskStatus, (taskStatus) => taskStatus.id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "task_status_id" })
    taskStatus: TaskStatus;
}
