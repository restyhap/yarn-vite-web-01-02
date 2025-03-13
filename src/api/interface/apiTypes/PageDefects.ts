import { type Defects } from "../../interface";

export interface PageDefects {
    records?: Defects[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
