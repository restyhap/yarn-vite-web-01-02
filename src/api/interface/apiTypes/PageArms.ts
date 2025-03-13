import { type Arms } from "../../interface";

export interface PageArms {
    records?: Arms[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
