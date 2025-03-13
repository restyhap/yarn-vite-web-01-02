import { type Fittings } from "../../interface";

export interface PageFittings {
    records?: Fittings[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
