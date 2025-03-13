import { type SeatOuterComponents } from "../../interface";

export interface PageSeatOuterComponents {
    records?: SeatOuterComponents[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
