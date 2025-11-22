import { IActivePagination, IFeaturePayload } from "../types/payload";

import { Feature } from "../db/entity/Feature";
import { FeatureTaskStatus } from "../db/entity/FeatureTaskStatus";
import { ILike } from "typeorm";
import { IUploadSignedUrlResponse } from "./upload.service";
import { TaskStatus } from "../db/entity/taskStatus";
import UploadService from "./upload.service";
import { User } from "../db/entity/User";
import createPagination from "../utils/createPagination";
import dataSource from "../db/data-source";
import { sanitizeEmployeeResult } from "../utils/sanitizeCustomer";
import { taskStatus } from "./../../../client/src/db/schema";

const uploadService = new UploadService();

class FeatureService {
    private readonly featureRepository = dataSource.getRepository(Feature);

    private readonly taskStatusRepository =
        dataSource.getRepository(TaskStatus);

    private readonly userRepository = dataSource.getRepository(User);
    private readonly featureTaskStatusRepository =
        dataSource.getRepository(FeatureTaskStatus);

    async getById(id: number) {
        const result = await this.featureRepository.findOne({
            where: { id },
            relations: ["featureTeamMember", "admin", "internalCompany"],
        });

        let profilePictureResponse: IUploadSignedUrlResponse | null = null;

        if (result?.profilePicture) {
            profilePictureResponse = await uploadService.getSignedUrlByUploadId(
                result?.profilePicture
            );
        } else {
            profilePictureResponse = null;
        }

        const featureTaskStatusResponse = await this.getFeatureTaskStatus(id);

        return {
            ...result,
            featureTeamMember: result?.featureTeamMember?.map((user) => {
                return sanitizeEmployeeResult({ employee: user }) ?? [];
            }),
            admin: result?.admin
                ? sanitizeEmployeeResult({ employee: result?.admin })
                : {},
            profilePictureResponse,
            featureTaskStatus: featureTaskStatusResponse?.result || [],
        };
    }

    async getAll(query: IActivePagination) {
        const { skip, take, isPaginationEnabled, keyword, isActive } = query;
        const [result, totalCount] = await this.featureRepository.findAndCount({
            skip: skip,
            take: take,
            order: {
                id: "DESC",
            },

            where: {
                ...(isActive ? { active: isActive } : {}),
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

    async update(id: number, updateFields: Partial<IFeaturePayload>) {
        const { featureTeamMember, featureTaskStatus } = updateFields;

        const result = await this.featureRepository.findOneBy({ id });
        if (!result) throw new Error("Feature not found");
        Object.assign(result, updateFields);

        const response = await this.featureRepository.save(result);

        if (featureTeamMember && featureTeamMember?.length > 0) {
            await this.addTeamMember(id, featureTeamMember);
        }

        if (featureTaskStatus) {
            await this.deleteTaskStatus(id);
            await this.addTaskStatus(id, featureTaskStatus);
        }
        return response;
    }

    async addTeamMember(featureId: number, userIds: number[]) {
        const feature = await this.featureRepository.findOne({
            where: { id: featureId },
            relations: ["featureTeamMember"],
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

        if (feature !== null && userList !== null && userList.length > 0) {
            feature.featureTeamMember = userList;
            const response = await this.featureRepository.save(feature);
            if (response) {
                return response;
            }
        }
    }

    async addTaskStatus(featureId: number, taskStatusIds: number[]) {
        const result = await Promise.all(
            taskStatusIds?.map(async (item) => {
                const taskStatus = await this.taskStatusRepository.findOneBy({
                    id: item,
                });

                if (taskStatus) {
                    const response =
                        await this.featureTaskStatusRepository.save({
                            feature_id: featureId,
                            taskStatus: taskStatus,
                        });
                    return response;
                }
            })
        );
        return result;
    }

    async deleteTaskStatus(featureId: number) {
        const result = await this.featureTaskStatusRepository.delete({
            feature_id: featureId,
        });
        return result;
    }

    async getFeatureTaskStatus(id: number) {
        const response = await this.featureTaskStatusRepository.find({
            where: {
                feature_id: id,
            },

            relations: ["taskStatus"],
        });
        const result = response?.map((e) => e.taskStatus);

        return {
            result,
        };
    }
}

export default FeatureService;
