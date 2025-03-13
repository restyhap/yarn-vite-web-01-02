import { type GasLift } from "../../interface";

export interface PageGasLift {
    records?: GasLift[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
