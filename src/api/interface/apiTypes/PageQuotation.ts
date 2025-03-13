import { type Quotation } from "../../interface";

export interface PageQuotation {
    records?: Quotation[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
