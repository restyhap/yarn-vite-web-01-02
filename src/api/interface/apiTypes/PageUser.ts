import { type User } from "../../interface";

export interface PageUser {
    records?: User[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
