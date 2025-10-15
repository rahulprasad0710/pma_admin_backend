import { Request, Response } from "express";

import CommentService from "../services/comments.service";

const commentService = new CommentService();

// 1. Add comment
const addComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { taskId } = req.params;

        const { content, addedBy } = req.body;

        const result = await commentService.addComment({
            content,
            taskId: Number(taskId),
            addedBy,
        });

        res.status(201).json({
            success: true,
            data: result,
            message: "Comment added successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: error instanceof Error ? error.message : String(error),
        });
    }
};

// 2. Soft delete comment
const deleteComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const result = await commentService.deleteComment(Number(id));

        res.status(200).json({
            success: true,
            data: result,
            message: "Comment deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: error instanceof Error ? error.message : String(error),
        });
    }
};

// 3. Update comment
const updateComment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const result = await commentService.updateComment(Number(id), content);

        res.status(200).json({
            success: true,
            data: result,
            message: "Comment updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: error instanceof Error ? error.message : String(error),
        });
    }
};

// 4. Get all active comments for a task
const getCommentsByTaskId = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const taskId = Number(req.params.taskId);

        const result = await commentService.getCommentsByTaskId(taskId);

        res.status(200).json({
            success: true,
            data: result,
            message: "Comments fetched successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            data: null,
            message: error instanceof Error ? error.message : String(error),
        });
    }
};

export default {
    addComment,
    deleteComment,
    updateComment,
    getCommentsByTaskId,
};
