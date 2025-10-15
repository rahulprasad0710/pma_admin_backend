import { ActivityAction } from "../enums/ActivityAction";
import ActivityService from "./activity.service";
import { Comment } from "../db/entity/comment";
import { Task } from "../db/entity/task";
import { User } from "../db/entity/User";
import dataSource from "../db/data-source";

const activityService = new ActivityService();

interface IComment {
    content: string;
    addedBy: User;
    taskId: number;
}

export class CommentService {
    constructor(
        private readonly commentRepository = dataSource.getRepository(Comment),
        private readonly taskRepository = dataSource.getRepository(Task)
    ) {}

    // 1. Add a new comment
    async addComment(commentData: IComment) {
        const task = await this.taskRepository.findOneBy({
            id: commentData.taskId,
        });

        if (!task) throw new Error("task not found");

        const comment = new Comment();
        comment.content = commentData.content;
        comment.addedBy = commentData.addedBy;
        comment.task = task;
        comment.isActive = true;

        const response = await this.commentRepository.save(comment);

        await activityService.create({
            activityBy: commentData.addedBy,
            action: ActivityAction.COMMENTED_TICKET,
            task: task,
            comment: commentData.content,
        });

        return response;
    }

    // 2. Soft delete (mark as inactive)
    async deleteComment(commentId: number) {
        const comment = await this.commentRepository.findOneBy({
            id: commentId,
        });
        if (!comment) throw new Error("Comment not found");

        comment.isActive = false;
        const response = await this.commentRepository.save(comment);

        return response;
    }

    // 3. Update comment content
    async updateComment(commentId: number, newContent: string) {
        const comment = await this.commentRepository.findOneBy({
            id: commentId,
        });
        if (!comment) throw new Error("Comment not found");

        comment.content = newContent;
        return await this.commentRepository.save(comment);
    }

    // 4. Get all active comments for a task
    async getCommentsByTaskId(taskId: number) {
        return await this.commentRepository.find({
            where: {
                task: { id: taskId },
                isActive: true,
            },
            relations: ["addedBy"],
            order: {
                addedAt: "ASC",
            },
        });
    }
}

export default CommentService;
