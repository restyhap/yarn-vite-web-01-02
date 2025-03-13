import { type CartonDetails } from "../../interface";

export interface PageCartonDetails {
    records?: CartonDetails[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
