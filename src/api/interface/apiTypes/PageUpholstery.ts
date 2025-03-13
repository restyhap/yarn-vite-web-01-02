import { type Upholstery } from "../../interface";

export interface PageUpholstery {
    records?: Upholstery[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
