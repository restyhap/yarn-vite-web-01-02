import { type ProductionLogistics } from "../../interface";

export interface PageProductionLogistics {
    records?: ProductionLogistics[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
