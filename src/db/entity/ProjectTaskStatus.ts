// entities/ProjectTaskStatus.ts

import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Project } from "./project";
import { TaskStatus } from "./taskStatus";

@Entity("project_task_status")
export class ProjectTaskStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Project, (project) => project.id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "project_id" })
    project: Project;

    @ManyToOne(() => TaskStatus, (taskStatus) => taskStatus.id, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "task_status_id" })
    taskStatus: TaskStatus;
}
