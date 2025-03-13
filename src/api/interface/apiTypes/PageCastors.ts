import { type Castors } from "../../interface";

export interface PageCastors {
    records?: Castors[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
