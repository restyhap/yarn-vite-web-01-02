import { type BackOuterComponents } from "../../interface";

export interface PageBackOuterComponents {
    records?: BackOuterComponents[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
