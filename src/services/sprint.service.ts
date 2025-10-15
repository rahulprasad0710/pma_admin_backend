import { IActivePagination } from "../types/payload";
import { ILike } from "typeorm";
import { Sprint } from "../db/entity/sprint";
import { User } from "../db/entity/User";
import createPagination from "../utils/createPagination";
import dataSource from "../db/data-source";

interface ISprint {
    name: string;
    goal?: string;
    startDate: Date;
    endDate: Date;
}

export class SprintService {
    private readonly sprintRepository = dataSource.getRepository(Sprint);

    async create(sprint: ISprint) {
        const sprintObj = new Sprint();
        sprintObj.name = sprint.name;
        sprintObj.goal = sprint.goal || "";
        sprintObj.startDate = sprint.startDate;
        sprintObj.endDate = sprint.endDate;
        sprintObj.isActive = true;

        return await this.sprintRepository.save(sprintObj);
    }

    async getAll(query: IActivePagination) {
        const { skip, take, isPaginationEnabled, keyword, isActive } = query;

        const [result, totalCount] = await this.sprintRepository.findAndCount({
            skip,
            take,
            where: {
                ...{ isActive: isActive },
                ...(keyword ? { name: ILike(`%${keyword}%`) } : {}),
            },
        });

        return {
            result: result,
            pagination: createPagination(
                skip,
                take,
                totalCount,
                isPaginationEnabled
            ),
        };
    }

    async getById(id: number) {
        return await this.sprintRepository.findOne({
            where: { id, isActive: true },
            relations: ["addedBy"],
        });
    }

    async update(id: number, updateFields: Partial<ISprint>) {
        const sprint = await this.sprintRepository.findOneBy({ id });
        if (!sprint) throw new Error("Sprint not found");

        Object.assign(sprint, updateFields);
        return await this.sprintRepository.save(sprint);
    }

    async deactivate(id: number, isActive: boolean) {
        const sprint = await this.sprintRepository.findOneBy({ id });
        if (!sprint) throw new Error("Sprint not found");
        sprint.isActive = isActive;
        return await this.sprintRepository.save(sprint);
    }
}

export default SprintService;
