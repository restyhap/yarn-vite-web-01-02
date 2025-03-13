import { type ProductImages } from "../../interface";

export interface PageProductImages {
    records?: ProductImages[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
