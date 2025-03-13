import { type ProductDimensions } from "../../interface";

export interface PageProductDimensions {
    records?: ProductDimensions[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
