import { type BackInnerComponents } from "../../interface";

export interface PageBackInnerComponents {
    records?: BackInnerComponents[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
