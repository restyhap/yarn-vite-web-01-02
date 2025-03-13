import { type Mechanism } from "../../interface";

export interface PageMechanism {
    records?: Mechanism[];
    pageNumber?: number;
    pageSize?: number;
    totalPage?: number;
    totalRow?: number;
    optimizeCountQuery?: boolean;
}
