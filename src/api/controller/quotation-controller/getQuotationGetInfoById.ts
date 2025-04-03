import request from "@/api/request";
import { type ResultVo, type Quotation } from "../../interface";
import { type AxiosRequestConfig } from "axios";

/**
 * /quotation/get/{id}
 */
export function getQuotationGetInfoById(params: GetQuotationGetInfoByIdParams, config?: AxiosRequestConfig) {
    return request.get<ResultVo<Quotation>>(`/quotation/get/${params.id}`, config);
}

export interface GetQuotationGetInfoByIdParams {
    id: string;
}
