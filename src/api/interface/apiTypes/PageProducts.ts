import { type Products } from "../../interface";

export interface PageProducts {
    records?: Products[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
