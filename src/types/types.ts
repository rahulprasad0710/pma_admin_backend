import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface TEmail {
    to: string[];
    subject: string;
    text: string;
    html?: string;
}

export type TNotification = {
    type: string;
    message: string;
    payload: string;
    link?: string;
    html_template?: string;
};

export interface IUserInfo {
    id: number;
    email: string;
    type: string;
    internalCompanies: TInternalCompany[];
    role: IRoleInfo;
}

export interface TInternalCompany {
    internal_company_id: number;
    name: string;
    slug: string;
    logoUrl: string;
    isActive: boolean;
    features: IFeatureInfo[];
}

export interface IFeatureInfo {
    features_id: number;
    features_name: string;
    features_slug: string;
    features_profilePicture: string | null;
    features_user_id: number;
    features_sprint_id: number | null;
    features_sprint_name: string | null;
}

export interface IRoleInfo {
    id: number;
    isActive: boolean;
    name: string;
    permissions: string[];
}

export interface AxiosErrorResponse {
    message: string;
    code?: string;
    config: AxiosRequestConfig;
    request?: unknown;
    response?: AxiosResponse<unknown>;
}

export interface ApiInfo {
    apiName?: string;
    apiAction?: string;
    apiFor?: string;
    method?: string;
    requestBody?: Record<string, unknown>;
}
