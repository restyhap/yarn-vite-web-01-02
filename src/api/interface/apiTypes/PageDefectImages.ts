import { type DefectImages } from "../../interface";

export interface PageDefectImages {
    records?: DefectImages[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
