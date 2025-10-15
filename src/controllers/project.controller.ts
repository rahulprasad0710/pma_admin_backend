import { Priority, ProjectStatus } from "../enums/Priority";
import { Request, Response } from "express";

import { IPagination } from "../types/express";
import ProjectService from "../services/projects.service";
import normalizeToString from "../utils/sanatizeQueryParams";

const projectService = new ProjectService();

const create = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await projectService.create({
            name: req.body.name,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            admin: req.body.admin,
            teamMember: req.body.teamMember,
            status: req.body.status,
            priority: req.body.priority,
            projectUploads: req.body.projectUploads,
        });
        res.status(201).json({
            success: true,
            data: data,
            message: "Project created successfully",
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            success: false,
            message: "Error creating project",
            error: error,
        });
    }
};

const update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const data = await projectService.update(Number(id), {
            name: req.body.name,
            description: req.body.description,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            admin: req.body.admin,
            teamMember: req.body.teamMember,
            status: req.body.status,
            priority: req.body.priority,
            projectUploads: req.body.projectUploads,
            updatedProjectUploads: req.body.updatedProjectUploads,
        });
        res.status(201).json({
            success: true,
            data: data,
            message: "Project created successfully",
        });
    } catch (error) {
        res.status(500).json({
            data: null,
            success: false,
            message: "Error creating project",
            error: error,
        });
    }
};

const getAll = async (req: Request, res: Response) => {
    try {
        const { skip, take, keyword, isPaginationEnabled }: IPagination =
            req.pagination;

        const rawStatus = normalizeToString(req.query.status);

        const isValidStatus = (val: string): val is ProjectStatus => {
            return Object.values(ProjectStatus).includes(val as ProjectStatus);
        };

        let statusArray: ProjectStatus[] | undefined = undefined;

        if (Array.isArray(rawStatus)) {
            const filtered = rawStatus.filter(isValidStatus);
            statusArray = filtered.length ? filtered : undefined;
        } else if (typeof rawStatus === "string" && isValidStatus(rawStatus)) {
            statusArray = [rawStatus];
        }

        const rawPriority = normalizeToString(req.query.priority);

        const isValidPriority = (val: string): val is Priority => {
            return Object.values(Priority).includes(val as Priority);
        };

        let priorityArray: Priority[] | undefined = undefined;

        if (Array.isArray(rawPriority)) {
            const filtered = rawPriority.filter(isValidPriority);
            priorityArray = filtered.length ? filtered : undefined;
        } else if (
            typeof rawPriority === "string" &&
            isValidPriority(rawPriority)
        ) {
            priorityArray = [rawPriority];
        }

        const users = await projectService.getAll({
            skip,
            take,
            keyword,
            isPaginationEnabled,
            status: statusArray,
            priority: priorityArray,
        });
        res.status(200).json({
            success: true,
            data: users,
            message: "Project fetched successfully",
        });
    } catch (error) {
        res.status(500).json({ data: null, success: false, message: error });
    }
};

const getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { withTask } = req.query;
    try {
        const users = await projectService.getById(
            Number(id),
            withTask === "true" ? true : false
        );
        res.status(200).json({
            success: true,
            data: users,
            message: "Project fetched successfully",
        });
    } catch (error) {
        console.log(
            "LOG: ~ file: project.controller.ts:52 ~ getById ~ error:",
            error
        );
        res.status(500).json({ message: error });
    }
};

const addTeamMember = async (req: Request, res: Response) => {
    const { projectId, userId } = req.body;
    try {
        const response = await projectService.addTeamMember(projectId, userId);
        res.status(200).json({
            success: true,
            data: response,
            message: "Team member added successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

export default {
    create,
    getAll,
    getById,
    addTeamMember,
    update,
};
