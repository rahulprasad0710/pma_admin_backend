import AppError from "../utils/AppError";
import { ErrorType } from "../enums/Eums";
import { Feature } from "../db/entity/Feature";
import { IActivePagination } from "../types/payload";
import { ILike } from "typeorm";
import { InternalCompany } from "../db/entity/InternalCompany";
import createPagination from "../utils/createPagination";
import dataSource from "../db/data-source";

interface IInternalCompany {
    name: string;
    slug: string;
    logoUrl?: string;
    address?: string;
    contactEmail?: string;
    contactPhone?: string;
}

export class InternalCompanyService {
    constructor(
        private readonly companyRepository = dataSource.getRepository(
            InternalCompany
        ),

        private readonly featureRepository = dataSource.getRepository(Feature)
    ) {}

    async create(companyData: IInternalCompany) {
        const company = new InternalCompany();
        company.name = companyData.name;
        company.slug = companyData.slug;
        company.logoUrl = companyData.logoUrl || "";
        company.address = companyData.address || "";
        company.contactEmail = companyData.contactEmail || "";
        company.contactPhone = companyData.contactPhone || "";
        company.isActive = true;

        return await this.companyRepository.save(company);
    }

    async getAll(query: IActivePagination) {
        const {
            skip,
            take,
            isPaginationEnabled,
            keyword,
            isActive,
            requestFromUrl: _requestFromUrl,
        } = query;

        const whereCondition = keyword
            ? [{ name: ILike(`%${keyword}%`), isActive }]
            : { isActive };

        const [result, totalCount] = await this.companyRepository.findAndCount({
            skip,
            take,
            order: { id: "DESC" },
            where: whereCondition,
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
        const result = await this.companyRepository.findOne({
            where: { id },
            relations: ["projects"],
        });
        return result;
    }

    async update(id: number, updateFields: Partial<IInternalCompany>) {
        const company = await this.companyRepository.findOneBy({ id });
        if (!company) throw new Error("Internal company not found");

        Object.assign(company, updateFields);
        return await this.companyRepository.save(company);
    }

    async deactivate(id: number, isActive: boolean) {
        const company = await this.companyRepository.findOneBy({ id });
        if (!company) throw new Error("Internal company not found");

        company.isActive = isActive;
        return await this.companyRepository.save(company);
    }

    async getInternalCompanyDetailsForEmployee(employeeId: number) {
        console.log({
            employeeId,
        });
        const internalCompanyResult = dataSource
            .getRepository(InternalCompany)
            .createQueryBuilder("internal_company")
            .select([
                "internal_company.id",
                "internal_company.name",
                "internal_company.slug",
                "internal_company.logoUrl",
            ])
            .leftJoin("internal_company.internalCompanyTeamMember", "user")
            .addSelect("user.id", "internal_company_user_id")
            .where("user.id = :userId", { userId: employeeId });

        const result = await internalCompanyResult.getRawMany();

        console.log(internalCompanyResult.getSql());

        if (!internalCompanyResult)
            throw new AppError(
                "Internal company not found",
                404,
                ErrorType.NOT_FOUND_ERROR
            );

        const resultAll = await Promise.all(
            result.map(async (company) => {
                const feature = await dataSource
                    .getRepository(Feature)
                    .createQueryBuilder("features")
                    .select([
                        "features.id",
                        "features.name",
                        "features.slug",
                        "features.profilePicture",
                    ])
                    .leftJoin("features.featureTeamMember", "user")

                    .addSelect("user.id", "features_user_id")
                    .leftJoin("features.active_sprint", "sprint")
                    .addSelect("sprint.id", "features_sprint_id")
                    .addSelect("sprint.name", "features_sprint_name")
                    .where("user.id = :userId", { userId: employeeId })
                    .andWhere(
                        "features.internalCompanyId = :internalCompanyId",
                        {
                            internalCompanyId: company.internal_company_id,
                        }
                    )
                    .getRawMany();
                return {
                    ...company,
                    feature,
                };
            })
        );

        return resultAll;
    }
}

export default InternalCompanyService;
