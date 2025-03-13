import { type Bases } from "../../interface";

export interface PageBases {
    records?: Bases[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
