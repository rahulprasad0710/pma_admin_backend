import { ILike, In } from "typeorm";
import {
    IProject,
    IProjectPagination,
    IUpdateProjectPayload,
} from "../types/payload";
import UploadService, { IUploadFileURL } from "./upload.service";

import { Project } from "../db/entity/project";
import { Task } from "../db/entity/task";
import { UploadFile } from "../db/entity/uploads";
import { User } from "../db/entity/User";
import createPagination from "../utils/createPagination";
import dataSource from "../db/data-source";

const uploadService = new UploadService();
export class ProjectService {
    constructor(
        private readonly projectRepository = dataSource.getRepository(Project),
        private readonly taskRepository = dataSource.getRepository(Task),
        private readonly userRepository = dataSource.getRepository(User),
        private readonly uploadRepository = dataSource.getRepository(UploadFile)
    ) {}

    async create(project: IProject) {
        const projectObj = new Project();
        projectObj.name = project.name;
        projectObj.description = project.description;
        projectObj.startDate = project.startDate;
        projectObj.endDate = project.endDate;
        projectObj.admin = project.admin;
        projectObj.status = project.status;
        projectObj.priority = project.priority;

        if (project?.profilePicture) {
            projectObj.profilePicture = project?.profilePicture ?? "";
        }
        const newProjectResult = await this.projectRepository.save(projectObj);

        if (project.teamMember.length > 0) {
            await this.addTeamMember(newProjectResult.id, project.teamMember);
        }

        if (project.projectUploads.length > 0) {
            await this.addProjectAttachments(
                newProjectResult.id,
                project.projectUploads
            );
        }

        return newProjectResult;
    }

    async getAll(query: IProjectPagination) {
        const { skip, take, isPaginationEnabled, priority, status, keyword } =
            query;

        console.log({
            skip,
            take,
            isPaginationEnabled,
            priority,
            status,
            keyword,
        });

        const [result, totalCount] = await this.projectRepository.findAndCount({
            select: [
                "id",
                "name",
                "startDate",
                "endDate",
                "status",
                "priority",
                "profilePicture",
                "admin",
            ],
            skip: skip,
            take: take,
            order: {
                id: "DESC",
            },
            where: {
                ...(status ? { status: In(status) } : {}),
                ...(priority ? { status: In(priority) } : {}),
                ...(keyword ? { name: ILike(`%${keyword}%`) } : {}),
            },
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

    async update(id: number, project: IUpdateProjectPayload) {
        const queryRunner = dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            const projectObj = new Project();
            projectObj.name = project.name;
            projectObj.description = project.description;
            projectObj.startDate = project.startDate;
            projectObj.endDate = project.endDate;
            projectObj.admin = project.admin;

            const projectResponse = await this.projectRepository.update(
                id,
                projectObj
            );

            if (project.teamMember) {
                await this.addTeamMember(id, project.teamMember);
            }
            if (project.projectUploads && project.updatedProjectUploads) {
                await this.addProjectAttachments(id, [
                    ...project.projectUploads,
                    ...project.updatedProjectUploads,
                ]);
            }

            await queryRunner.commitTransaction();
            return projectResponse;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async delete(id: number) {
        return await this.projectRepository.delete(id);
    }

    async addTeamMember(projectId: number, userIds: number[]) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: ["teamMember"],
        });

        const userList = (
            await Promise.all(
                userIds.map(async (userId) => {
                    return await this.userRepository.findOne({
                        where: { id: userId },
                    });
                })
            )
        ).filter((user): user is User => user !== null);

        if (project !== null && userList !== null && userList.length > 0) {
            project.teamMember = userList;
            const response = await this.projectRepository.save(project);
            if (response) {
                return response;
            }
        }
    }

    async addProjectAttachments(projectId: number, uploadIds: string[]) {
        const project = await this.projectRepository.findOne({
            where: { id: projectId },
            relations: ["projectUploads"],
        });

        const uploadResponse = (
            await Promise.all(
                uploadIds.map(async (uploadId) => {
                    return await this.uploadRepository.findOne({
                        where: { id: uploadId },
                    });
                })
            )
        ).filter((uploadId): uploadId is UploadFile => uploadId !== null);

        if (
            project !== null &&
            uploadResponse !== null &&
            uploadResponse.length > 0
        ) {
            project.projectUploads = uploadResponse;
            const response = await this.projectRepository.save(project);
            if (response) {
                return response;
            }
        }
    }

    async getById(id: number, withTask: boolean) {
        const response = await this.projectRepository.findOne({
            where: { id },
            relations: ["admin", "teamMember", "projectUploads"],
        });

        let tasks: Task[] = [];
        if (withTask) {
            tasks = await this.taskRepository.find({
                where: { project: { id } },
                select: [
                    "id",
                    "title",
                    "assignedTo",
                    "taskNumber",
                    "status",
                    "priority",
                ],
                relations: ["assignedTo"],
                order: {
                    id: "DESC",
                },
            });
        }

        let projectUploads: IUploadFileURL[] = [];

        if (response?.projectUploads && response?.projectUploads?.length > 0) {
            projectUploads = await uploadService.getUrlList(
                response?.projectUploads
            );
        }

        return {
            ...response,
            projectUploads,
            tasks,
        };
    }
}

export default ProjectService;
