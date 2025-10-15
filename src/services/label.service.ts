import { IActivePagination } from "../types/payload";
import { Label } from "../db/entity/taskLabel";
import { User } from "../db/entity/User";
import createPagination from "../utils/createPagination";
import dataSource from "../db/data-source";

interface ILabel {
    name: string;
    description?: string;
    addedBy: User;
    colorCode: string;
    isActive: boolean;
}

export class LabelService {
    private readonly labelRepository = dataSource.getRepository(Label);

    async create(label: ILabel) {
        const labelPayload = new Label();

        labelPayload.name = label.name;
        labelPayload.description = label.description || "";
        labelPayload.addedBy = label.addedBy;
        labelPayload.colorCode = label.colorCode;
        labelPayload.addedAt = new Date();
        labelPayload.isActive = label.isActive;

        const { addedBy, ...result } = await this.labelRepository.save(
            labelPayload
        );
        return result;
    }

    async getAll(query: IActivePagination) {
        const { skip, take, isPaginationEnabled, keyword, isActive } = query;

        const sqlQuery = this.labelRepository
            .createQueryBuilder("label")
            .leftJoinAndSelect("label.addedBy", "addedBy")
            .select([
                "label.id",
                "label.name",
                "label.description",
                "label.colorCode",
                "label.isActive",
                "addedBy.id",
                "addedBy.email",
                "addedBy.firstName",
                "addedBy.lastName",
                "addedBy.employeeId",
                "addedBy.profilePictureUrl",
            ])
            .where("label.isActive = :isActive", { isActive });

        if (keyword && keyword.trim() !== "") {
            sqlQuery.andWhere("label.name LIKE :keyword", {
                keyword: `%${keyword}%`,
            });
        }

        const [result, totalCount] = await sqlQuery
            .skip(skip)
            .take(take)
            .getManyAndCount();

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

    async getById(id: number) {
        return await this.labelRepository.findOne({
            where: { id, isActive: true },
            relations: ["addedBy"],
        });
    }

    async update(id: number, updateFields: Partial<ILabel>) {
        const label = await this.labelRepository.findOneBy({ id });
        if (!label) throw new Error("Label not found");
        Object.assign(label, updateFields);
        return await this.labelRepository.save(label);
    }

    async deactivate(id: number, isActive: boolean) {
        const label = await this.labelRepository.findOneBy({ id });
        if (!label) throw new Error("Label not found");
        label.isActive = isActive;
        return await this.labelRepository.save(label);
    }
}

export default LabelService;
