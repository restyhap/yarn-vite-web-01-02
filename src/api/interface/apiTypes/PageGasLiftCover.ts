import { type GasLiftCover } from "../../interface";

export interface PageGasLiftCover {
    records?: GasLiftCover[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
