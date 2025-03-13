import { type QcReports } from "../../interface";

export interface PageQcReports {
    records?: QcReports[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
