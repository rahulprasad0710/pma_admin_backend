declare global {
    namespace Express {
        interface Request {
            pagination: IPagination;
            verifiedUserId: number;
            verifiedUser: IUser;
        }
    }
}

export interface IPagination {
    skip?: number;
    take?: number;
    keyword?: string;
    isPaginationEnabled: boolean;
    requestFromUrl?: string;
}
