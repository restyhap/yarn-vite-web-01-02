import { type Permissions } from "../../interface";

export interface PagePermissions {
    records?: Permissions[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
