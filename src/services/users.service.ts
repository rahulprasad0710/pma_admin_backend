import APP_CONSTANT from "../constants/AppConfig";
import AppError from "../utils/AppError";
import { EmailService } from "./config/email.service";
import { ErrorType } from "../enums/Eums";
import { Feature } from "../db/entity/Feature";
import { IEmployeePagination } from "../types/payload";
import { ILike } from "typeorm";
import { InternalCompany } from "../db/entity/InternalCompany";
import { Role } from "../db/entity/role";
import { User } from "../db/entity/User";
import { UserInternalCompany } from "../db/entity/UserInternalCompany";
import bcrypt from "bcryptjs";
import createPagination from "../utils/createPagination";
import crypto from "crypto";
import dataSource from "../db/data-source";
import generateToken from "../utils/generateToken";
import { sanitizeDBResult } from "../utils/sanitizeDbResult";
import { sendEmail } from "../config/email.config";

const emailService = new EmailService();

interface IUser {
    firstName: string;
    lastName: string;
    role: number;
    email: string;
    mobileNumber: string;
    internalCompany: number[];
    password?: string;
}

interface IUserPayload extends IUser {
    roleResponse: Role;
}
export class UserService {
    private readonly userRepository = dataSource.getRepository(User);
    private readonly userInternalCompanyRepository =
        dataSource.getRepository(UserInternalCompany);

    private readonly internalCompanyRepository =
        dataSource.getRepository(InternalCompany);

    private readonly featureRepository = dataSource.getRepository(Feature);

    private readonly roleRepository = dataSource.getRepository(Role);

    async create(user: IUser) {
        const isEmailAlreadyRegistered = await this.userRepository.findOne({
            where: {
                email: user.email,
            },
        });

        if (isEmailAlreadyRegistered) {
            throw new AppError(
                "Email already registered.",
                409,
                ErrorType.BAD_REQUEST_ERROR
            );
        }

        const roleResponse = await this.getRoleById(user.role);

        if (!roleResponse) {
            throw new AppError(
                "Role not found",
                404,
                ErrorType.NOT_FOUND_ERROR
            );
        }

        const generateVerificationToken = () =>
            crypto.randomBytes(32).toString("hex");

        const token = generateVerificationToken();

        const employeeId = await this.generateEmployeeId();

        const response = await this.addUser(
            {
                ...user,
                roleResponse,
            },
            employeeId,
            token
        );

        const verifyLink = `${APP_CONSTANT.FRONTEND_BASE_URL}auth/verify-email/${response.id}?token=${token}`;

        const emailResponse = await emailService.sendVerificationEmail(
            response,
            verifyLink
        );

        return {
            ...response,
            emailResponse,
        };
    }

    async getRoleById(roleId: number) {
        const roleResponse = await this.roleRepository.findOne({
            where: { id: roleId },
        });
        return roleResponse;
    }

    async addUser(
        user: IUserPayload,
        employeeId: string,
        verifyEmailToken: string,
        isSeederUser = false
    ) {
        try {
            const userObj = new User();
            userObj.firstName = user.firstName;
            userObj.lastName = user.lastName;
            userObj.email = user.email;
            userObj.emailVerified = false;
            userObj.mobileNumber = user.mobileNumber;
            userObj.role = user.roleResponse;
            userObj.roleId = user.roleResponse.id;
            userObj.employeeId = employeeId;
            userObj.verifyEmailToken = verifyEmailToken;

            if (isSeederUser) {
                userObj.emailVerified = true;
                userObj.isActive = true;
                userObj.verifyEmailToken = "VERIFIED_BY_SEEDER";
                userObj.password = await this.getPasswordHash(
                    user?.password || "Admin@123"
                );
            }

            const response = await this.userRepository.save(userObj);

            if (isSeederUser) {
                const refreshToken = generateToken.refreshToken({
                    userId: response?.id,
                    userType: "credentials",
                    loginType: "credentials",
                });
                await this.updateRefreshToken(response.id, refreshToken);
            }

            const userInternalCompanyResult = await this.addInternalCompany(
                response.id,
                user.internalCompany
            );

            return {
                ...response,
                userInternalCompanyResult,
            };
        } catch (error) {
            console.error("Error adding user:", error);
            throw new Error("Error adding user");
        }
    }

    async getAllEmployee(query: IEmployeePagination) {
        const {
            skip,
            take,
            isPaginationEnabled,
            isActive,
            keyword,
            emailVerified,
            requestFromUrl,
        } = query;

        console.log({
            skip,
            take,
            isPaginationEnabled,
            isActive,
            keyword,
            emailVerified,
        });

        const FROM_URL = ["LIST_PAGE"];

        const whereCondition = keyword
            ? [
                  { firstName: ILike(`%${keyword}%`), isActive },
                  { employeeId: ILike(`%${keyword}%`), isActive },
                  { email: ILike(`%${keyword}%`), isActive },
              ]
            : { isActive };

        const [result, totalCount] = await this.userRepository.findAndCount({
            select: [
                "id",
                "email",
                "firstName",
                "lastName",
                "employeeId",
                "profilePictureUrl",
                "isActive",
                "emailVerified",
                "mobileNumber",
                "createdAt",
                "emailVerified",
                "roleId",
            ],
            skip: skip,
            take: take,
            order: {
                id: "DESC",
            },
            ...(requestFromUrl && FROM_URL.includes(requestFromUrl)
                ? { relations: ["role"] }
                : {}),
            where: whereCondition,
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

    async getByEmail(email: string) {
        const response = await this.userRepository.findOne({
            where: { email: email },
        });
        return response;
    }

    async getById(id: number) {
        const result = await this.userRepository.findOne({
            where: { id: id },
        });

        return result;
    }

    async getInternalCompanyByUserId({
        userId,
        populateUser = false,
        populateInternalCompany = false,
    }: {
        userId: number;
        populateUser?: boolean;
        populateInternalCompany?: boolean;
    }) {
        const relationArray = [];

        if (populateUser) relationArray.push("user");
        if (populateInternalCompany) relationArray.push("internal_company");

        if (relationArray.length === 0) relationArray.push("");

        const result = await this.userInternalCompanyRepository.find({
            where: {
                user_id: userId,
            },
            relations: relationArray,
        });

        return result;
    }

    async getUserFeatures(employeeId: number, internal_company_id: number) {
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
            .andWhere("features.internalCompanyId = :internalCompanyId", {
                internalCompanyId: internal_company_id,
            })
            .getRawMany();
        return feature;
    }

    async generateEmployeeId() {
        const [response] = await this.userRepository.find({
            order: { id: "DESC" },
            take: 1,
        });
        const randomNumber = Math.floor(Math.random() * 10000);
        const newEmployeeId = `${APP_CONSTANT.COMPANY_NAME}-${
            response?.id ?? randomNumber + 1
        }`;

        return newEmployeeId;
    }

    async confirmUser({
        password,
        userId,
    }: {
        password: string;
        userId: number;
    }) {
        const response = await this.userRepository.update(userId, {
            password: password,
            verifyEmailToken: () => "NULL",
            emailVerified: true,
            isActive: true,
        });
        return response;
    }

    async getPasswordHash(password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    }

    async getEmployeeViewByProjectId({ featureId }: { featureId: number }) {
        return await this.featureRepository.findOne({
            where: { id: featureId },
            relations: ["featureTeamMember"],
        });
    }

    async getEmployeeViewByFeatureId({ featureId }: { featureId: number }) {
        const result = await this.featureRepository.findOne({
            where: { id: featureId },
            relations: ["featureTeamMember"],
            select: ["id", "featureTeamMember"],
        });

        const response = sanitizeDBResult<
            User,
            | "id"
            | "firstName"
            | "lastName"
            | "email"
            | "mobileNumber"
            | "profilePictureUrl"
            | "role"
        >({
            selectFields: [
                "id",
                "firstName",
                "lastName",
                "email",
                "mobileNumber",
                "profilePictureUrl",
                "role",
            ],
            result: result?.featureTeamMember ?? [],
        });

        return response;
    }

    async updateRefreshToken(userId: number, refreshToken?: string) {
        const response = await this.userRepository.update(userId, {
            refreshToken: refreshToken ? refreshToken : () => "NULL",
        });
        return response;
    }

    async addInternalCompany(userId: number, internalCompanyIds: number[]) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
        });

        if (!user) return null;

        const result = await Promise.all(
            internalCompanyIds.map(async (companyId) => {
                const newUserInternalPayLoad = new UserInternalCompany();
                const internalCompany =
                    await this.internalCompanyRepository.findOne({
                        where: { id: companyId },
                    });

                if (internalCompany) {
                    newUserInternalPayLoad.user = user;
                    newUserInternalPayLoad.internal_company = internalCompany;

                    const userInternalCompany =
                        await this.userInternalCompanyRepository.save(
                            newUserInternalPayLoad
                        );

                    return userInternalCompany;
                } else {
                    return null;
                }
            })
        );
        return result;
    }
}

export default UserService;
