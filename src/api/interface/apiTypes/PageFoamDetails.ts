import { type FoamDetails } from "../../interface";

export interface PageFoamDetails {
    records?: FoamDetails[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
