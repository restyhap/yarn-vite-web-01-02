import { type SeatInnerComponents } from "../../interface";

export interface PageSeatInnerComponents {
    records?: SeatInnerComponents[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
