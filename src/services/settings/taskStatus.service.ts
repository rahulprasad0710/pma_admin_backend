import { IActivePagination } from "../../types/payload";
import { ILike } from "typeorm";
import { ProjectTaskStatus } from "../../db/entity/ProjectTaskStatus";
import { TaskStatus } from "../../db/entity/taskStatus";
import createPagination from "../../utils/createPagination";
import dataSource from "../../db/data-source";

interface ITaskStatus {
    name: string;
    colorCode?: string;
}

export class TaskStatusService {
    constructor(
        private readonly taskStatusRepository = dataSource.getRepository(
            TaskStatus
        ),

        private readonly projectTaskStatusRepository = dataSource.getRepository(
            ProjectTaskStatus
        )
    ) {}
    /**
     * Create a new task status
     * @param status - The task status to create
     * @returns The created task status
     */
    async create(status: ITaskStatus) {
        const taskStatus = new TaskStatus();
        taskStatus.name = status.name;
        taskStatus.color_code = status.colorCode || "#023047";
        taskStatus.is_active = true; // Default to active

        return await this.taskStatusRepository.save(taskStatus);
    }

    async getAll(query: IActivePagination) {
        const { skip, take, isPaginationEnabled, keyword, isActive } = query;
        const result = await this.taskStatusRepository.find({
            select: ["id", "name", "color_code", "is_active"],
            skip: skip,
            take: take,
            order: {
                id: "DESC",
            },

            where: {
                ...(isActive !== undefined && {
                    is_active: isActive,
                }),
                ...(keyword ? { name: ILike(`%${keyword}%`) } : {}),
            },
        });

        const totalCount = await this.taskStatusRepository.count();
        console.log({
            result,
        });
        return {
            result,
            pagination: createPagination(
                skip,
                take,
                totalCount,
                isPaginationEnabled
            ),
        };
    }

    async getTaskStatusByProjectId(projectId: number) {
        return await this.projectTaskStatusRepository.find({
            where: { project: { id: projectId } },
        });
    }

    async getById(id: number) {
        return await this.taskStatusRepository.findOneBy({ id });
    }

    async update(id: number, updateFields: Partial<ITaskStatus>) {
        const taskStatus = await this.taskStatusRepository.findOneBy({ id });
        if (!taskStatus) throw new Error("Task status not found");

        Object.assign(taskStatus, updateFields);
        const result = await this.taskStatusRepository.save(taskStatus);

        return result;
    }

    async delete(id: number, isActive: boolean) {
        const taskStatus = await this.taskStatusRepository.findOneBy({ id });
        if (!taskStatus) throw new Error("Task status not found");

        const result = await this.taskStatusRepository.save({
            is_active: isActive,
        });

        return result;
    }
}

export default TaskStatusService;
