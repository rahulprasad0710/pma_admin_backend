import { Activity } from "../db/entity/activity";
import { ActivityAction } from "../enums/ActivityAction";
import { Task } from "../db/entity/task";
import { User } from "../db/entity/User";
import dataSource from "../db/data-source";

interface IActivity {
    activityBy: User;
    action: ActivityAction;
    task: Task;
    details?: string;
    comment?: string;
}

type SimplifiedActivity = {
    id: number;
    action: ActivityAction;
    details: string;
    comment: string;
    createdAt: Date;
    activityBy: User;
    task: {
        id: number;
        taskNumber: string;
        title: string;
        assignedTo: User;
    };
};

export class ActivityService {
    constructor(
        private readonly activityRepository = dataSource.getRepository(Activity)
    ) {}

    async create(payload: IActivity) {
        const data = new Activity();
        data.action = payload.action;
        data.activityBy = payload.activityBy;
        data.task = payload.task;
        data.details = payload.details || "";
        data.comment = payload.comment || "";

        return await this.activityRepository.save(payload);
    }

    async getAll() {
        const response = await this.activityRepository.find();
        return response;
    }

    async getActivityByTaskId({ taskId }: { taskId: number }) {
        const response = await this.activityRepository.find({
            where: {
                task: { id: taskId },
            },
            select: ["activityBy"],
            relations: ["activityBy", "task.project", "task.assignedTo"],
            order: {
                createdAt: "DESC",
            },
        });

        let result: SimplifiedActivity[] = [];

        if (response.length > 0) {
            result = response.map((activity) => {
                return {
                    ...activity,
                    activityBy: activity.activityBy,
                    task: {
                        id: activity.task.id,
                        projectId: activity.task.project.id,
                        taskNumber: activity.task.taskNumber,
                        title: activity.task.title,
                        assignedTo: {
                            ...activity.task.assignedTo,
                        },
                    },
                };
            });
        }

        return result;
    }
}

export default ActivityService;

//
